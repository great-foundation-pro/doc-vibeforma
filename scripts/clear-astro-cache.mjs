// Wipe the Astro content-layer caches before a build.
//
// The deploy environment keeps a persistent build-cache mount at
// node_modules/.astro across deploys; on 2026-11-27 a deploy served pages
// rendered from that stale cached store even though the sources in the
// same commit were newer. The mount point itself cannot be removed
// ("Device or resource busy"), so this script never removes the
// directories - it clears their contents only.
import { readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function clearContents(dir) {
  const full = join(root, dir);
  let entries;
  try {
    entries = readdirSync(full);
  } catch {
    console.log(`${dir} absent - nothing to clear`);
    return;
  }
  for (const entry of entries) {
    rmSync(join(full, entry), { recursive: true, force: true });
  }
  console.log(`cleared contents of ${dir} (${entries.length} entries)`);
}

for (const dir of [".astro", join("node_modules", ".astro")]) {
  clearContents(dir);
}
