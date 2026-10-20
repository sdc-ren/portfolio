import LocaleLayout from "../[locale]/layout";
import { DEFAULT_LOCALE } from "@/lib/public-path";
export const dynamic = "force-dynamic";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LocaleLayout params={Promise.resolve({ locale: DEFAULT_LOCALE })}>
      {children}
    </LocaleLayout>
  );
}
