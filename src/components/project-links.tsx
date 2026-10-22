import {
  Apple,
  Chrome,
  ExternalLink,
  FlaskConical,
  Github,
  Globe,
  Play,
} from "lucide-react";
import type { ProjectLink } from "@/features/content/project-assets";
import { projectLinkLabel } from "@/features/content/project-link-label";
import type { UiLabels } from "@/features/content/ui";
import { Button } from "./ui/button";

const icons = {
  website: Globe,
  github: Github,
  "chrome-web-store": Chrome,
  "app-store": Apple,
  "google-play": Play,
  testflight: FlaskConical,
  custom: ExternalLink,
};

export function ProjectLinks({
  links,
  labels,
}: {
  links: ProjectLink[];
  labels: UiLabels;
}) {
  if (!links.length) return null;
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {links.map((link) => {
        const Icon = icons[link.type];
        return (
          <Button key={link.id} asChild variant="outline">
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <Icon size={16} aria-hidden="true" />
              {projectLinkLabel(link, labels)}
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </Button>
        );
      })}
    </div>
  );
}
