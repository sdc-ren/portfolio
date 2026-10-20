import LocaleProject, {
  generateMetadata as localeMetadata,
} from "../../../[locale]/projects/[slug]/page";
import { DEFAULT_LOCALE } from "@/lib/public-path";
type Props = { params: Promise<{ slug: string }> };
async function withLocale(params: Props["params"]) {
  return { ...(await params), locale: DEFAULT_LOCALE };
}
export function generateMetadata({ params }: Props) {
  return localeMetadata({ params: withLocale(params) });
}
export default function Project({ params }: Props) {
  return LocaleProject({ params: withLocale(params) });
}
