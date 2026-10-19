import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublished, getLocales } from "@/features/content/repository";
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
  const locales = await getLocales();
  return (
    <div lang={locale}>
      <header className="border-b border-slate-800">
        <nav
          aria-label="Main navigation"
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
            <Link href={`/${locale}/projects`}>Projects</Link>
            <Link href={`/${locale}#experience`}>Experience</Link>
            <Link href={`/${locale}/cv/${data.cvs[0].id}`}>CV</Link>
            {locales.length > 1 &&
              locales.map((l) => (
                <Link
                  key={l}
                  href={`/${l}`}
                  aria-current={locale === l ? "page" : undefined}
                >
                  {l.toUpperCase()}
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
        <Link href={`mailto:${data.profile.email}`}>Let’s talk ↗</Link>
      </footer>
    </div>
  );
}
