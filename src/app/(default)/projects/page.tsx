import LocaleProjects, {
  generateMetadata as localeMetadata,
} from "../../[locale]/projects/page";
import { DEFAULT_LOCALE } from "@/lib/public-path";
const params = () => Promise.resolve({ locale: DEFAULT_LOCALE });
export function generateMetadata() {
  return localeMetadata({ params: params() });
}
export default function Projects() {
  return LocaleProjects({ params: params() });
}
