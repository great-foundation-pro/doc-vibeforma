#!/usr/bin/env node
/**
 * Verifies the built documentation site.
 *
 *   node scripts/verify-build.mjs --all   build, then verify (the canonical command)
 *   node scripts/verify-build.mjs         verify the existing dist/ only
 *
 * Required: every contracted route exists under dist/, both landing pages link
 * to documentation, blog, logs, the repository and the other language, and the
 * language switch keeps the current section on every documentation page.
 *
 * Exit code 0 when all checks pass, 1 with an explicit list of failures.
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

// The contract: English at the root, Russian under /ru, plus the first
// entries of the blog and the journal.
const requiredRoutes = [
  '/',
  '/introduction/',
  '/installation/',
  '/usage/',
  '/privacy/',
  '/troubleshooting/',
  '/blog/',
  '/blog/2026-11-21-documentation-site/',
  '/logs/',
  '/logs/2026-11-21-start/',
  '/ru/',
  '/ru/introduction/',
  '/ru/installation/',
  '/ru/usage/',
  '/ru/privacy/',
  '/ru/troubleshooting/',
  '/ru/blog/',
  '/ru/blog/2026-11-21-documentation-site/',
  '/ru/logs/',
  '/ru/logs/2026-11-21-start/',
];

const landingChecks = [
  {
    page: '/',
    file: 'index.html',
    hrefs: [
      '/introduction/',
      '/installation/',
      '/usage/',
      '/privacy/',
      '/troubleshooting/',
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
      '/ru/installation/',
      '/ru/usage/',
      '/ru/privacy/',
      '/ru/troubleshooting/',
      '/ru/blog/',
      '/ru/logs/',
      'https://github.com/FormaMindPro/vibeforma',
      '/',
    ],
  },
];

// The language switch must lead to the same section in the other language.
const sectionPairs = [
  '/introduction/',
  '/installation/',
  '/usage/',
  '/privacy/',
  '/troubleshooting/',
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

  console.log('');
  console.log(`Routes:           ${routesOk}/${requiredRoutes.length}`);
  console.log(`Landing links:    ${linksOk}/${linksTotal}`);
  console.log(`Language switch:  ${switchOk}/${switchTotal}`);

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
