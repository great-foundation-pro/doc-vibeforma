// Wipe the Astro content-layer caches before a build.
//
// The deploy environment keeps a persistent "astro" build cache across
// deploys; on 2026-11-27 a deploy served pages rendered from stale cached
// content even though the sources in the same commit were newer. Deleting
// the caches here makes every build re-read the sources on disk.
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const dir of [".astro", join("node_modules", ".astro"), "dist"]) {
  rmSync(join(root, dir), { recursive: true, force: true });
  console.log(`cleared ${dir}`);
}
