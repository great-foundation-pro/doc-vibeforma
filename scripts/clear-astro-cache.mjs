// Wipe the Astro content-layer caches before a build.
//
// The deploy environment keeps a persistent build-cache mount at
// node_modules/.astro across deploys; on 2026-11-27 a deploy served pages
// rendered from that stale cached store even though the sources in the
// same commit were newer. The mount point itself cannot be removed
// ("Device or resource busy"), so its contents are cleared instead.
import { readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function clear(dir) {
  const full = join(root, dir);
  try {
    rmSync(full, { recursive: true, force: true });
    console.log(`cleared ${dir}`);
  } catch (err) {
    if (err.code !== "EBUSY") throw err;
    for (const entry of readdirSync(full)) {
      rmSync(join(full, entry), { recursive: true, force: true });
    }
    console.log(`cleared contents of ${dir} (mount point kept)`);
  }
}

for (const dir of [".astro", join("node_modules", ".astro")]) {
  clear(dir);
}
