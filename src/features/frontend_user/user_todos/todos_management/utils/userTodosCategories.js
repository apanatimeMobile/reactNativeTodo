/**
 * RESPONSIBILITY: Normalize and deduplicate category input.
 * FLOW: User/category storage values → trimmed case-insensitive category list.
 */
export function normalizeCategoryName(name) {
  if (typeof name !== 'string') return '';
  return name.trim().replace(/\s+/g, ' ');
}

/**
 * Normalize and dedupe a list of category names
 */
export function normalizeCategoryList(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const result = [];
  value.forEach(entry => {
    const name = normalizeCategoryName(entry);
    const key = name.toLowerCase();
    if (name && !seen.has(key)) {
      seen.add(key);
      result.push(name);
    }
  });
  return result;
}

/**
 * Normalize dueDate to a consistent value.
 * Keeps "No date", converts Today/Tomorrow to ISO YYYY-MM-DD,
 * and preserves already valid ISO dates.
 */
