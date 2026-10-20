export const DEFAULT_LOCALE = "en";
/** English is the default language and has no public URL prefix. */
export function publicPath(locale: string, path = ""): string {
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  return locale === DEFAULT_LOCALE ? suffix || "/" : `/${locale}${suffix}`;
}
