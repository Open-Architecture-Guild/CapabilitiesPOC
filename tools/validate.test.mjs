import test from 'node:test';
import assert from 'node:assert/strict';
import { validateItems, derive } from './lib.mjs';

const base = (over = {}) => ({
  id: 'CAP-0001',
  name: 'Strategy Development',
  description: 'The ability to set the long-term direction of the enterprise.',
  parent: null,
  stratum: 'strategic',
  status: 'accepted',
  since: '0.1.0',
  provenance: { type: 'original' },
  __file: 'model/core/test.yaml',
  ...over,
});
const child = (over = {}) =>
  base({ id: 'CAP-0002', name: 'Market Analysis', parent: 'CAP-0001', stratum: undefined, status: 'proposed', ...over });

const errorsOf = (items) => validateItems(items).problems.filter((p) => p.level === 'error');
const warningsOf = (items) => validateItems(items).problems.filter((p) => p.level === 'warning');

test('a valid small catalog passes', () => {
  assert.deepEqual(errorsOf([base(), child()]), []);
});

test('duplicate ids are rejected', () => {
  const errs = errorsOf([base(), child({ id: 'CAP-0001' })]);
  assert.ok(errs.some((e) => /Duplicate id/.test(e.message)));
});

test('missing parent is rejected', () => {
  const errs = errorsOf([base(), child({ parent: 'CAP-0999' })]);
  assert.ok(errs.some((e) => /does not exist/.test(e.message)));
});

test('hierarchy cycles are rejected', () => {
  const a = child({ id: 'CAP-0010', name: 'Alpha Capability', parent: 'CAP-0011' });
  const b = child({ id: 'CAP-0011', name: 'Beta Capability', parent: 'CAP-0010' });
  const errs = errorsOf([a, b]);
  assert.ok(errs.some((e) => /cycle/i.test(e.message)));
});

test('level 1 needs a stratum, lower levels must not have one', () => {
  assert.ok(errorsOf([base({ stratum: undefined })]).length > 0);
  assert.ok(errorsOf([base(), child({ stratum: 'core' })]).length > 0);
});

test('description that only repeats the name is rejected', () => {
  const errs = errorsOf([base({ description: 'Strategy Development capability.' })]);
  assert.ok(errs.some((e) => /repeats the name/.test(e.message)));
});

test('description without "The ability to" only warns', () => {
  const items = [base({ description: 'Sets the long-term direction of the enterprise.' })];
  assert.deepEqual(errorsOf(items), []);
  assert.ok(warningsOf(items).some((w) => /The ability to/.test(w.message)));
});

test('organisation words in names warn', () => {
  const items = [base({ name: 'Marketing Department' })];
  assert.ok(warningsOf(items).some((w) => /organisation word/.test(w.message)));
});

test('deprecated capabilities need a successor or a note', () => {
  assert.ok(errorsOf([base({ status: 'deprecated' })]).length > 0);
  assert.deepEqual(errorsOf([base({ status: 'deprecated', deprecation_note: 'Merged into another capability.' })]), []);
});

test('open-license provenance needs source and license', () => {
  assert.ok(errorsOf([base({ provenance: { type: 'open-license' } })]).length > 0);
  assert.deepEqual(
    errorsOf([base({ provenance: { type: 'open-license', source: 'https://example.org/x', license: 'CC0-1.0' } })]),
    [],
  );
});

test('sibling names must be unique', () => {
  const errs = errorsOf([base(), child(), child({ id: 'CAP-0003' })]);
  assert.ok(errs.some((e) => /sibling/.test(e.message)));
});

test('derive adds level, stratum, path and counts', () => {
  const d = derive([base(), child(), child({ id: 'CAP-0003', name: 'Deep Capability', parent: 'CAP-0002' })]);
  const deep = d.find((i) => i.id === 'CAP-0003');
  assert.equal(deep.level, 3);
  assert.equal(deep.stratum, 'strategic');
  assert.deepEqual(deep.path, ['CAP-0001', 'CAP-0002']);
  assert.equal(d.find((i) => i.id === 'CAP-0001').descendants, 2);
});
