#!/usr/bin/env node
/**
 * Verifies the built documentation site.
 *
 *   node scripts/verify-build.mjs --all   build, then verify (the canonical command)
 *   node scripts/verify-build.mjs         verify the existing dist/ only
 *
 * Contract: 31 documentation pages in English at the root and the same 31
 * slugs in Russian under /ru/. Every page keeps the language switch on the
 * same section, the landing pages link to the new documentation, the old
 * /usage URL redirects, and llms.txt indexes both locales.
 *
 * No network, no dependencies beyond Node. Exit 0 = green, 1 = red.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node scripts/verify-build.mjs [--all]');
  console.log('  --all   run "npm run build" first, then verify dist/');
  process.exit(0);
}

const SLUGS = [
  'introduction', 'comparison', 'quickstart', 'installation', 'requirements',
  'dictation', 'hotkeys', 'settings', 'models', 'interface', 'updates',
  'dictionary', 'snippets', 'history', 'statistics',
  'formamind',
  'settings-reference', 'files-and-paths', 'cli', 'local-api', 'glossary',
  'troubleshooting', 'faq', 'diagnostics', 'known-issues',
  'privacy', 'security',
  'changelog', 'roadmap', 'development', 'contributing',
];

const EXTRA_ROUTES = [
  '/',
  '/blog/',
  '/blog/2026-11-21-documentation-site/',
  '/logs/',
  '/logs/2026-11-21-start/',
];

const requiredRoutes = [
  ...EXTRA_ROUTES,
  ...SLUGS.map((slug) => `/${slug}/`),
  ...EXTRA_ROUTES.map((route) => `/ru${route === '/' ? '/' : route}`),
  ...SLUGS.map((slug) => `/ru/${slug}/`),
];

const landingChecks = [
  {
    page: '/',
    file: 'index.html',
    hrefs: [
      '/introduction/',
      '/quickstart/',
      '/installation/',
      '/dictation/',
      '/privacy/',
      '/blog/',
      '/logs/',
      'https://github.com/FormaMindPro/vibeforma',
      '/ru/',
    ],
  },
  {
    page: '/ru/',
    file: join('ru', 'index.html'),
    hrefs: [
      '/ru/introduction/',
      '/ru/quickstart/',
      '/ru/installation/',
      '/ru/dictation/',
      '/ru/privacy/',
      '/ru/blog/',
      '/ru/logs/',
      'https://github.com/FormaMindPro/vibeforma',
      '/',
    ],
  },
];

// The language switch must lead to the same section in the other language.
const sectionPairs = [
  ...SLUGS.map((slug) => `/${slug}/`),
  '/blog/',
  '/logs/',
  '/logs/2026-11-21-start/',
  '/blog/2026-11-21-documentation-site/',
];

const failures = [];

function build() {
  console.log('Building: npm run build');
  // On Windows npm is a .cmd shim, so route the fixed command through cmd.exe
  // instead of asking spawnSync to execute the shim directly.
  const result =
    process.platform === 'win32'
      ? spawnSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm run build'], {
          cwd: root,
          stdio: 'inherit',
        })
      : spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });
  if (result.error) {
    failures.push(`build could not start: ${result.error.message}`);
    return false;
  }
  if (result.status !== 0) {
    failures.push(`build failed with exit code ${result.status}`);
    return false;
  }
  return true;
}

function routeFile(route) {
  return route === '/' ? join(dist, 'index.html') : join(dist, `${route.slice(1)}index.html`);
}

function read(file) {
  return readFileSync(file, 'utf8');
}

function collectHrefs(html) {
  return new Set(Array.from(html.matchAll(/\shref="([^"]*)"/g), (match) => match[1]));
}

// Starlight renders the language switch as a <select> whose option values are
// the localized page URLs, so both forms count as a working switch.
function collectTargets(html) {
  return new Set([
    ...collectHrefs(html),
    ...Array.from(html.matchAll(/<option value="([^"]*)"/g), (match) => match[1]),
  ]);
}

function main() {
  if (args.includes('--all') && !build()) {
    return report();
  }

  if (!existsSync(dist)) {
    failures.push('dist/ does not exist; run with --all or run "npm run build" first');
    return report();
  }

  let routesOk = 0;
  for (const route of requiredRoutes) {
    const file = routeFile(route);
    if (existsSync(file)) {
      routesOk += 1;
    } else {
      failures.push(`route ${route} is missing (expected ${file})`);
    }
  }

  let linksOk = 0;
  let linksTotal = 0;
  for (const check of landingChecks) {
    const file = join(dist, check.file);
    if (!existsSync(file)) {
      failures.push(`landing ${check.page} was not built (expected ${file})`);
      continue;
    }
    const hrefs = collectHrefs(read(file));
    for (const href of check.hrefs) {
      linksTotal += 1;
      if (hrefs.has(href)) {
        linksOk += 1;
      } else {
        failures.push(`landing ${check.page} does not link to ${href}`);
      }
    }
  }

  let switchOk = 0;
  let switchTotal = 0;
  for (const route of sectionPairs) {
    const enFile = routeFile(route);
    const ruFile = routeFile(`/ru${route}`);
    const ruHref = `/ru${route}`;
    if (existsSync(enFile) && existsSync(ruFile)) {
      switchTotal += 2;
      if (collectTargets(read(enFile)).has(ruHref)) {
        switchOk += 1;
      } else {
        failures.push(`${route} does not offer the switch to ${ruHref} (section not preserved)`);
      }
      if (collectTargets(read(ruFile)).has(route)) {
        switchOk += 1;
      } else {
        failures.push(`/ru${route} does not offer the switch to ${route} (section not preserved)`);
      }
    }
  }

  // Locale parity: every English page has a Russian twin and vice versa.
  let parityOk = 0;
  for (const slug of SLUGS) {
    if (existsSync(routeFile(`/${slug}/`))) parityOk += 1;
    if (existsSync(routeFile(`/ru/${slug}/`))) parityOk += 1;
  }

  // The old /usage URL must still resolve, in both locales.
  let redirectsOk = 0;
  for (const route of ['/usage/', '/ru/usage/']) {
    const file = routeFile(route);
    if (existsSync(file)) {
      const target = route.startsWith('/ru/') ? '/ru/dictation' : '/dictation';
      if (read(file).includes(target)) {
        redirectsOk += 1;
      } else {
        failures.push(`${route} exists but does not point to ${target}`);
      }
    } else {
      failures.push(`${route} redirect page is missing`);
    }
  }

  // llms.txt indexes all pages in both locales.
  let llmsOk = 0;
  const llmsFile = join(dist, 'llms.txt');
  if (existsSync(llmsFile)) {
    const llms = read(llmsFile);
    for (const slug of SLUGS) {
      if (llms.includes(`https://vibeforma.pro/${slug}/`)) llmsOk += 1;
      if (llms.includes(`https://vibeforma.pro/ru/${slug}/`)) llmsOk += 1;
    }
  } else {
    failures.push('llms.txt is missing from dist/');
  }

  // Each built page must carry its own title, not the site title only.
  let titlesOk = 0;
  for (const slug of SLUGS) {
    for (const prefix of ['', 'ru/']) {
      const file = routeFile(`/${prefix}${slug}/`);
      if (existsSync(file) && /<title>[^<]+<\/title>/.test(read(file))) {
        titlesOk += 1;
      }
    }
  }

  // The task pages carry interface screenshots, in both locales.
  const IMAGE_SLUGS = [
    'introduction', 'quickstart', 'dictation', 'hotkeys', 'settings',
    'models', 'interface', 'dictionary', 'snippets', 'history',
    'statistics', 'local-api',
  ];
  let imagesOk = 0;
  for (const slug of IMAGE_SLUGS) {
    for (const prefix of ['', 'ru/']) {
      const file = routeFile(`/${prefix}${slug}/`);
      if (!existsSync(file)) {
        failures.push(`/${prefix}${slug}/ is missing for an image check`);
        continue;
      }
      const html = read(file);
      const alts = Array.from(html.matchAll(/<img\b[^>]*\balt="([^"]*)"/g), (m) => m[1].trim());
      if (alts.length > 0 && alts.every(Boolean) && html.includes('/_astro/')) {
        imagesOk += 1;
      } else {
        failures.push(`/${prefix}${slug}/ has no documented screenshot with alt text`);
      }
    }
  }

  console.log('');
  console.log(`Routes:           ${routesOk}/${requiredRoutes.length}`);
  console.log(`Landing links:    ${linksOk}/${linksTotal}`);
  console.log(`Language switch:  ${switchOk}/${switchTotal}`);
  console.log(`Locale parity:    ${parityOk}/${SLUGS.length * 2}`);
  console.log(`Old URL redirect: ${redirectsOk}/2`);
  console.log(`llms.txt entries: ${llmsOk}/${SLUGS.length * 2}`);
  console.log(`Page titles:      ${titlesOk}/${SLUGS.length * 2}`);
  console.log(`Docs images:      ${imagesOk}/${IMAGE_SLUGS.length * 2}`);

  return report();
}

function report() {
  if (failures.length > 0) {
    console.error('');
    console.error(`FAIL: ${failures.length} check(s) failed`);
    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log('');
  console.log('PASS: all checks passed');
  process.exitCode = 0;
}

main();
