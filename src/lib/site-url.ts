/** Accept a bare deployment hostname while retaining explicit HTTP(S) schemes. */
export function normalizeSiteUrl(value: string): string {
  const input = value.trim();
  if (!input || /^[a-z][a-z\d+.-]*:\/\//i.test(input)) return input;
  return `https://${input}`;
}
