import type { ProjectLink } from "./project-assets";
import type { UiLabels } from "./ui";

export function projectLinkLabel(link: ProjectLink, labels: UiLabels): string {
  return (
    link.label ||
    {
      website: labels.visitWebsite,
      github: labels.sourceCode,
      "chrome-web-store": labels.installExtension,
      "app-store": labels.downloadAppStore,
      "google-play": labels.downloadGooglePlay,
      testflight: labels.joinBeta,
      custom: labels.visitWebsite,
    }[link.type]
  );
}
