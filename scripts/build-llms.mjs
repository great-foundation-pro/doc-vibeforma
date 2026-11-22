#!/usr/bin/env node
'use strict';

/**
 * Generates public/llms.txt from the approved documentation structure.
 *
 *   node scripts/build-llms.mjs
 *
 * The structure lives in the project's card-194 folder. Both locales are
 * emitted: English at the site root, Russian under /ru/. The file is a plain
 * index for agents, not a copy of the pages.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const structurePath = join(root, '..', '..', '..', 'project', 'cards', 'card-194', 'docs-structure.json');
const publicDir = join(root, 'public');
const output = join(publicDir, 'llms.txt');

if (!existsSync(structurePath)) {
  console.error(`llms: structure not found at ${structurePath}`);
  process.exit(1);
}

const data = JSON.parse(readFileSync(structurePath, 'utf8'));
const site = 'https://vibeforma.pro';
const groups = Array.isArray(data.groups) ? data.groups : [];

const lines = [
  '# VibeForma',
  '',
  '> Local voice dictation for Windows. Press a hotkey, speak, and the text appears where the cursor is.',
  '',
  `Version: ${data.product_version}. Documentation languages: English and Russian.`,
  '',
  '## Documentation',
  '',
];

for (const group of groups) {
  lines.push(`### ${group.title_en}`);
  lines.push('');
  for (const page of group.pages || []) {
    lines.push(`- [${page.title_en}](${site}${page.path}/): ${page.type}`);
  }
  lines.push('');
}

lines.push('## Russian documentation');
lines.push('');

for (const group of groups) {
  lines.push(`### ${group.title_ru}`);
  lines.push('');
  for (const page of group.pages || []) {
    const purpose = page.purpose_ru ? `: ${page.purpose_ru}` : '';
    lines.push(`- [${page.title_ru}](${site}/ru${page.path}/${purpose})`);
  }
  lines.push('');
}

lines.push('## Optional');
lines.push('');
lines.push(`- [Source code](https://github.com/FormaMindPro/vibeforma)`);
lines.push(`- [Blog](${site}/blog/)`);
lines.push(`- [Project journal](${site}/logs/)`);
lines.push('');

mkdirSync(publicDir, { recursive: true });
writeFileSync(output, lines.join('\n'), 'utf8');

const pageCount = groups.reduce((total, group) => total + (group.pages || []).length, 0);
console.log(`llms.txt: ${pageCount} pages in ${groups.length} groups, both locales -> public/llms.txt`);
