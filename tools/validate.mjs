// Validate the catalog. Exit code 1 when there are errors. Warnings do not fail the build.
import { loadItems, validateItems } from './lib.mjs';

export function runValidation() {
  const { items, problems: loadProblems } = loadItems();
  const { problems } = validateItems(items);
  const all = [...loadProblems, ...problems];
  const gh = process.env.GITHUB_ACTIONS === 'true';
  for (const p of all) {
    const where = [p.file, p.id].filter(Boolean).join(' ');
    if (gh) {
      const file = p.file ? ` file=${p.file}` : '';
      console.log(`::${p.level}${file}::${p.id ? p.id + ': ' : ''}${p.message}`);
    } else {
      console.log(`${p.level === 'error' ? 'ERROR  ' : 'warning'} ${where ? where + ': ' : ''}${p.message}`);
    }
  }
  const errors = all.filter((p) => p.level === 'error').length;
  const warnings = all.length - errors;
  console.log(`${items.length} capabilities checked: ${errors} errors, ${warnings} warnings.`);
  return { items, errors, warnings };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { errors } = runValidation();
  process.exit(errors > 0 ? 1 : 0);
}
