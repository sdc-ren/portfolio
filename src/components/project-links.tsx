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
  className = "mb-6 flex flex-wrap gap-1",
}: {
  links: ProjectLink[];
  labels: UiLabels;
  className?: string;
}) {
  if (!links.length) return null;
  return (
    <div className={className}>
      {links.map((link) => {
        const Icon = icons[link.type];
        const label = projectLinkLabel(link, labels);
        return (
          <Button
            key={link.id}
            asChild
            variant="ghost"
            size="icon"
            tooltip={label}
            className="size-11 sm:size-9"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          </Button>
        );
      })}
    </div>
  );
}
