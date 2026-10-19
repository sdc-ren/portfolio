export function normalizeContentInput(value: unknown): unknown {
  if (Array.isArray(value))
    return value.every((v) => typeof v === "string")
      ? value.map((v) => v.trim()).filter(Boolean)
      : value.map(normalizeContentInput);
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, normalizeContentInput(v)]),
    );
  return value;
}
export function uniqueItemId(base: string, items: { id: string }[]): string {
  const used = new Set(items.map((item) => item.id));
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix++;
  return `${base}-${suffix}`;
}
