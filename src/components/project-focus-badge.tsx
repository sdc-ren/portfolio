import { AudioLines, Sparkles, Workflow } from "lucide-react";
import {
  projectFocusLabels,
  type ProjectFocus,
} from "@/features/content/project-focus";
import styles from "./project-focus-badge.module.scss";

export function ProjectFocusBadge({ focus }: { focus: ProjectFocus }) {
  if (!focus) return null;
  const Icon =
    focus === "speech-ai"
      ? AudioLines
      : focus === "workflow-automation"
        ? Workflow
        : Sparkles;
  return (
    <span className={styles.badge} data-focus={focus}>
      <Icon size={13} aria-hidden="true" />
      {projectFocusLabels[focus]}
    </span>
  );
}
