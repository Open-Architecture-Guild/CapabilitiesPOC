// Build the static site into dist/. Fails when the catalog has validation errors.
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadItems, loadMeta, validateItems, derive } from './lib.mjs';
import { runValidation } from './validate.mjs';

const DIST = join(ROOT, 'dist');

const { errors } = runValidation();
if (errors > 0) {
  console.error('Build stopped: fix the validation errors first.');
  process.exit(1);
}

const meta = loadMeta();
const { items } = loadItems();
const catalog = derive(items);

// In GitHub Actions the repository is known. Locally it can come from model/catalog.yaml.
const repository = process.env.GITHUB_REPOSITORY
  ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
  : (meta.repository || '').replace(/\/$/, '');

rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, 'vendor'), { recursive: true });
mkdirSync(join(DIST, 'fonts'), { recursive: true });

// Site files
for (const f of ['index.html', 'app.js', 'style.css']) cpSync(join(ROOT, 'site', f), join(DIST, f));

// Search library (MIT) and fonts (SIL OFL 1.1), both served from our own origin.
const nm = (p) => join(ROOT, 'node_modules', p);
cpSync(nm('minisearch/dist/umd/index.js'), join(DIST, 'vendor/minisearch.js'));
cpSync(nm('minisearch/LICENSE.txt'), join(DIST, 'vendor/minisearch.LICENSE.txt'));
const fonts = [
  ['@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2', 'atkinson-latin-wght.woff2'],
  ['@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2', 'newsreader-latin-wght.woff2'],
];
for (const [src, dst] of fonts) {
  if (!existsSync(nm(src))) throw new Error(`Font file missing: ${src}. Run "npm ci" first.`);
  cpSync(nm(src), join(DIST, 'fonts', dst));
}
cpSync(nm('@fontsource-variable/atkinson-hyperlegible-next/LICENSE'), join(DIST, 'fonts/atkinson.LICENSE.txt'));
cpSync(nm('@fontsource-variable/newsreader/LICENSE'), join(DIST, 'fonts/newsreader.LICENSE.txt'));

// Data
const out = {
  meta: {
    name: meta.name,
    version: meta.version,
    license: meta.license,
    demo: !!meta.demo,
    repository,
    branch: meta.branch || 'main',
    generated: new Date().toISOString(),
    count: catalog.length,
  },
  capabilities: catalog,
};
writeFileSync(join(DIST, 'catalog.json'), JSON.stringify(out));

// CSV for spreadsheets. Fields with commas or quotes are quoted.
const q = (v) => {
  const s = Array.isArray(v) ? v.join('; ') : String(v ?? '');
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const cols = ['id', 'level', 'name', 'description', 'parent', 'stratum', 'status', 'synonyms', 'name_de', 'description_de'];
const rows = catalog.map((c) =>
  [c.id, c.level, c.name, c.description, c.parent ?? '', c.stratum, c.status, c.synonyms ?? [], c.labels?.de?.name ?? '', c.labels?.de?.description ?? ''].map(q).join(','),
);
writeFileSync(join(DIST, 'capabilities.csv'), '﻿' + [cols.join(','), ...rows].join('\n') + '\n');

console.log(`Built ${catalog.length} capabilities into ${DIST}`);
