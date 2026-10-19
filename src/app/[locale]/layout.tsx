import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublished,
  getLanguageOptions,
} from "@/features/content/repository";
export const dynamic = "force-dynamic";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getPublished(locale);
  if (!data) notFound();
  const locales = await getLanguageOptions();
  return (
    <div lang={locale}>
      <header className="border-b border-slate-800">
        <nav
          aria-label={data.ui.navLabel}
          className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-6"
        >
          <Link
            href={`/${locale}`}
            className="font-bold tracking-tight text-white"
          >
            {data.profile.name}
            <span className="text-teal-300">.</span>
          </Link>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <Link href={`/${locale}/projects`}>{data.ui.navProjects}</Link>
            <Link href={`/${locale}#experience`}>{data.ui.navExperience}</Link>
            <Link href={`/${locale}/cv/${data.cvs[0].id}`}>
              {data.ui.navCv}
            </Link>
            {locales.length > 1 &&
              locales.map((l) => (
                <Link
                  key={l.locale}
                  href={`/${l.locale}`}
                  aria-current={locale === l.locale ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
          </div>
        </nav>
      </header>
      {children}
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 border-t border-slate-800 px-6 py-8 text-sm text-slate-500">
        <span>
          © {new Date().getFullYear()} {data.profile.name}.{" "}
          {data.settings.footer}
        </span>
        <Link href={`mailto:${data.profile.email}`}>{data.ui.letsTalk} ↗</Link>
      </footer>
    </div>
  );
}
