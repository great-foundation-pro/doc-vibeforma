#!/usr/bin/env node
/**
 * Writes the public giscus IDs for the product repository.
 *
 *   COMMUNITY_GITHUB_TOKEN=... node scripts/giscus-ids.mjs
 *   npm run giscus:ids        (reads the site .env, then the project root .env)
 *
 * The repository and discussion-category IDs are public: giscus puts them in
 * the page HTML anyway. The token is only used to read them and is never
 * printed or written.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OWNER = 'FormaMindPro';
const REPO = 'vibeforma';
const CATEGORY_SLUG = 'comments';
const output = resolve('src/giscus-ids.json');

function readEnvKey(file, key) {
  if (!existsSync(file)) return null;
  const line = readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .find((entry) => new RegExp(`^${key}\\s*=`).test(entry));
  if (!line) return null;
  const value = line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
  return value.length > 0 ? value : null;
}

const token =
  process.env.COMMUNITY_GITHUB_TOKEN ||
  readEnvKey(resolve('.env'), 'COMMUNITY_GITHUB_TOKEN') ||
  readEnvKey(resolve('../../../.env'), 'COMMUNITY_GITHUB_TOKEN');
if (!token) {
  console.error(
    'COMMUNITY_GITHUB_TOKEN is not set. Put it in the site .env or the project root .env, or export it before running this script.'
  );
  process.exit(1);
}

const query = `query($owner: String!, $name: String!, $slug: String!) {
  repository(owner: $owner, name: $name) {
    id
    discussionCategory(slug: $slug) { id name }
  }
}`;

const response = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'doc-vibeforma-giscus-ids',
  },
  body: JSON.stringify({ query, variables: { owner: OWNER, name: REPO, slug: CATEGORY_SLUG } }),
});

if (!response.ok) {
  console.error(`GitHub API returned ${response.status}.`);
  process.exit(1);
}

const payload = await response.json();
if (payload.errors?.length) {
  console.error(`GitHub API error: ${payload.errors[0]?.message ?? 'unknown'}`);
  process.exit(1);
}

const repository = payload.data?.repository;
const category = repository?.discussionCategory;
if (!repository?.id) {
  console.error(`Repository ${OWNER}/${REPO} was not found.`);
  process.exit(1);
}
if (!category?.id) {
  console.error(
    `The "${CATEGORY_SLUG}" discussion category was not found. Enable Discussions and create the Comments category first.`
  );
  process.exit(1);
}

writeFileSync(
  output,
  `${JSON.stringify(
    {
      repo: `${OWNER}/${REPO}`,
      repoId: repository.id,
      category: category.name,
      categoryId: category.id,
    },
    null,
    2
  )}\n`
);

console.log(`Wrote ${output}`);
console.log(`repo: ${OWNER}/${REPO}`);
console.log(`category: ${category.name}`);
