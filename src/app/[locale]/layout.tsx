import { RoleAnimationProvider } from "@/components/role-animation";
import { Typewriter } from "@/components/typewriter";
import { publicPath } from "@/lib/public-path";
import { ActionLink as Link } from "@/components/action-link";
import navStyles from "@/components/header-nav.module.scss";
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
    <RoleAnimationProvider roles={data.settings.headerRoles}>
      <div lang={locale}>
        <header className="border-b border-border">
          <nav
            aria-label={data.ui.navLabel}
            className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-5 px-4 py-6 sm:px-6"
          >
            <Link
              href={publicPath(locale)}
              tooltip={data.profile.name}
              className="flex max-w-full items-center gap-2 sm:gap-3 font-bold tracking-tight text-foreground"
            >
              <img
                src="/icon.svg"
                alt=""
                width={40}
                height={40}
                className="size-8 shrink-0 rounded-lg sm:size-10"
              />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="flex items-center gap-2 whitespace-nowrap text-xs sm:text-base">
                  <span className="uppercase">{data.profile.name}</span>
                  <span
                    aria-hidden="true"
                    className="font-normal text-muted-foreground"
                  >
                    |
                  </span>
                  <Typewriter />
                </span>
                <span className="max-w-3xl text-[10px] font-normal leading-relaxed tracking-normal text-muted-foreground sm:text-[11px]">
                  {data.cvs[0].specialties}
                </span>
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link
                className={navStyles.link}
                href={`${publicPath(locale)}#projects`}
              >
                {data.ui.navProjects}
              </Link>
              <Link
                className={navStyles.link}
                href={`${publicPath(locale)}#experience`}
              >
                {data.ui.navExperience}
              </Link>
              <Link
                className={navStyles.link}
                href={publicPath(locale, `/cv/${data.cvs[0].id}`)}
              >
                {data.ui.navCv}
              </Link>
              {locales.length > 1 &&
                locales.map((l) => (
                  <Link
                    key={l.locale}
                    className={navStyles.link}
                    href={publicPath(l.locale)}
                    aria-current={locale === l.locale ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                ))}
            </div>
          </nav>
        </header>
        {children}
        <footer className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-4 border-t border-border px-6 py-8 text-sm text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {data.profile.name}.{" "}
            {data.settings.footer}
          </span>
          <Link href={`mailto:${data.profile.email}`}>
            {data.ui.letsTalk} ↗
          </Link>
        </footer>
      </div>
    </RoleAnimationProvider>
  );
}
