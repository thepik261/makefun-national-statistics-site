// Kalandra National Statistics Office — the entry program (Node 22, standard
// library only). It copies app/ and screenshots/ from beside this file to
// /output and writes /output/dossier.json with the vendored make.fun
// library, as the starter's main.ts does. Leave vendor/makefun-frontend.ts
// as it is: the scorer requires dossier.json to be byte for byte what its
// own copy writes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly when the site or its screenshots are missing: an entry with
// no index.html or with fewer than three screenshots is not a working site.
const indexPath = join(here, 'app', 'index.html');
if (!existsSync(indexPath) || !statSync(indexPath).isFile()) {
  throw new Error('missing app/index.html — the site has no home page');
}
const shotsDir = join(here, 'screenshots');
if (!existsSync(shotsDir) || !statSync(shotsDir).isDirectory()) {
  throw new Error('missing screenshots/ directory');
}
const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.') && statSync(join(shotsDir, name)).isFile());
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`screenshots/ holds ${shots.length} images, expected 3 or 4`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
