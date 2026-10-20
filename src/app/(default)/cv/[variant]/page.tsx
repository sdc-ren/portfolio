import LocaleCv, {
  generateMetadata as localeMetadata,
} from "../../../[locale]/cv/[variant]/page";
import { DEFAULT_LOCALE } from "@/lib/public-path";
type Props = { params: Promise<{ variant: string }> };
async function withLocale(params: Props["params"]) {
  return { ...(await params), locale: DEFAULT_LOCALE };
}
export function generateMetadata({ params }: Props) {
  return localeMetadata({ params: withLocale(params) });
}
export default function Cv({ params }: Props) {
  return LocaleCv({ params: withLocale(params) });
}
