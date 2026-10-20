import LocaleHome, {
  generateMetadata as localeMetadata,
} from "../[locale]/page";
import { DEFAULT_LOCALE } from "@/lib/public-path";
const params = () => Promise.resolve({ locale: DEFAULT_LOCALE });
export function generateMetadata() {
  return localeMetadata({ params: params() });
}
export default function Home() {
  return LocaleHome({ params: params() });
}
