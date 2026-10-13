// Shared loading, validation and derivation for the OpenCap catalog.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import { parse } from 'yaml';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MODEL_DIRS = ['model/core', 'model/extensions'];
const MAX_LEVELS = 6; // G211: between three and six levels are common in practice
const ORG_WORDS = /\b(department|team|division|unit|office|group|abteilung|bereich)\b/i;

export function readSchema() {
  return JSON.parse(readFileSync(join(ROOT, 'model/schema/capability.schema.json'), 'utf8'));
}

function walk(dir) {
  let out = [];
  let entries = [];
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries.sort()) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (/\.ya?ml$/.test(e)) out.push(p);
  }
  return out;
}

/** Read all capability files. Returns items with their source file attached. */
export function loadItems(root = ROOT) {
  const items = [];
  const problems = [];
  for (const d of MODEL_DIRS) {
    for (const file of walk(join(root, d))) {
      const rel = relative(root, file).split('\\').join('/');
      let doc;
      try {
        doc = parse(readFileSync(file, 'utf8'));
      } catch (e) {
        problems.push({ level: 'error', file: rel, message: `YAML cannot be parsed: ${e.message}` });
        continue;
      }
      const list = doc && Array.isArray(doc.capabilities) ? doc.capabilities : null;
      if (!list) {
        problems.push({ level: 'error', file: rel, message: 'Expected a top-level "capabilities" list.' });
        continue;
      }
      for (const it of list) items.push({ ...it, __file: rel });
    }
  }
  return { items, problems };
}

export function loadMeta(root = ROOT) {
  return parse(readFileSync(join(root, 'model/catalog.yaml'), 'utf8'));
}

const norm = (s) => String(s ?? '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

/** Validate a list of items. Returns { problems } where problems carry level 'error' or 'warning'. */
export function validateItems(items, { schema = readSchema() } = {}) {
  const problems = [];
  const add = (level, it, message) => problems.push({ level, file: it?.__file, id: it?.id, message });

  const ajv = new Ajv({ allErrors: true, strict: false, validateFormats: false });
  const check = ajv.compile(schema);
  // Strip the helper field before schema validation.
  for (const it of items) {
    const { __file, ...clean } = it;
    if (!check(clean)) {
      for (const e of check.errors) {
        add('error', it, `${e.instancePath || '(item)'} ${e.message}`.trim());
      }
    }
  }

  for (const it of items) {
    const src = it?.provenance?.source;
    if (src && !/^https?:\/\//.test(src)) add('error', it, 'provenance.source must be an http(s) URL.');
  }

  // Unique IDs
  const byId = new Map();
  for (const it of items) {
    if (!it.id) continue;
    if (byId.has(it.id)) add('error', it, `Duplicate id ${it.id} (also in ${byId.get(it.id).__file}).`);
    else byId.set(it.id, it);
  }

  // Parent, successor and hierarchy
  for (const it of items) {
    if (it.parent && !byId.has(it.parent)) add('error', it, `Parent ${it.parent} does not exist.`);
    if (it.parent && it.parent === it.id) add('error', it, 'A capability cannot be its own parent.');
    if (it.replaced_by && !byId.has(it.replaced_by)) add('error', it, `replaced_by ${it.replaced_by} does not exist.`);
    if (it.status === 'deprecated' && it.replaced_by === it.id) add('error', it, 'replaced_by points to itself.');
  }
  for (const it of items) {
    // cycle / depth detection
    const seen = new Set([it.id]);
    let cur = it;
    let depth = 1;
    while (cur && cur.parent && byId.has(cur.parent)) {
      cur = byId.get(cur.parent);
      depth++;
      if (seen.has(cur.id)) { add('error', it, `Hierarchy cycle through ${cur.id}.`); break; }
      seen.add(cur.id);
      if (depth > MAX_LEVELS + 1) break;
    }
    if (depth > MAX_LEVELS) add('error', it, `Hierarchy is deeper than ${MAX_LEVELS} levels.`);
  }

  // Content rules (from the naming and description guidance in G211 / G233)
  const siblingNames = new Map();
  for (const it of items) {
    if (typeof it.name === 'string' && typeof it.description === 'string') {
      if (norm(it.description).includes(norm(it.name)) && norm(it.description).length < norm(it.name).length + 25) {
        add('error', it, 'Description only repeats the name. Say what the ability is.');
      }
      if (!/^the ability to\b/i.test(it.description.trim())) {
        add('warning', it, 'Description should start with "The ability to".');
      }
      if (ORG_WORDS.test(it.name)) {
        add('warning', it, 'Name contains an organisation word. Capabilities are independent of the org chart.');
      }
      const key = `${it.parent ?? ''}|${norm(it.name)}`;
      if (siblingNames.has(key)) add('error', it, `Name already used by a sibling (${siblingNames.get(key)}).`);
      else siblingNames.set(key, it.id);
    }
    if (it.parent === null && !it.stratum) add('error', it, 'Level 1 capabilities need a stratum.');
  }

  // Catalog-level review triggers (G211: 20-30 on level 1; G233: more than ~100 entries is a smell)
  const live = items.filter((i) => i.status !== 'deprecated');
  const l1 = live.filter((i) => i.parent === null).length;
  if (l1 > 30) problems.push({ level: 'warning', message: `${l1} level 1 capabilities. Guidance suggests 20-30.` });
  if (live.length > 100) {
    problems.push({
      level: 'warning',
      message: `${live.length} active capabilities. Check that none of them is really a capability instance or a value stream stage.`,
    });
  }
  return { problems };
}

/** Add derived fields: level, root, stratum inheritance, path, children, order. */
export function derive(items) {
  const byId = new Map(items.map((i) => [i.id, i]));
  const children = new Map();
  for (const it of items) {
    if (it.parent) {
      if (!children.has(it.parent)) children.set(it.parent, []);
      children.get(it.parent).push(it.id);
    }
  }
  const out = [];
  const order = [];
  const visit = (id, pathIds) => {
    const it = byId.get(id);
    order.push(id);
    const kids = (children.get(id) || []).slice().sort((a, b) => byId.get(a).name.localeCompare(byId.get(b).name, 'en'));
    out.push({ it, pathIds, kids });
    for (const k of kids) visit(k, [...pathIds, id]);
  };
  const roots = items.filter((i) => !i.parent).sort((a, b) => a.name.localeCompare(b.name, 'en'));
  for (const r of roots) visit(r.id, []);

  const derived = new Map(out.map((o) => [o.it.id, o]));
  return out.map(({ it, pathIds, kids }, idx) => {
    const { __file, ...rest } = it;
    const root = byId.get(pathIds[0] ?? it.id);
    return {
      ...rest,
      level: pathIds.length + 1,
      root: root.id,
      stratum: root.stratum,
      path: pathIds,
      pathNames: pathIds.map((p) => byId.get(p).name),
      children: kids,
      descendants: countDesc(kids, derived),
      order: idx,
      file: __file,
    };
  });
}

function countDesc(kids, derived) {
  let n = 0;
  for (const k of kids) n += 1 + countDesc(derived.get(k).kids, derived);
  return n;
}
