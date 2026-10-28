/** Explicit editorial classification, never inferred from a project name or tech stack. */
export const projectFocusValues = [
  "",
  "ai-agent-memory",
  "ai-agent-tooling",
  "ai-workflow",
  "workflow-automation",
  "speech-ai",
] as const;
export type ProjectFocus = (typeof projectFocusValues)[number];
export const projectFocusLabels: Record<ProjectFocus, string> = {
  "": "No badge",
  "ai-agent-memory": "AI Agent Memory",
  "ai-agent-tooling": "AI Agent Tooling",
  "ai-workflow": "AI Workflow",
  "workflow-automation": "Workflow Automation",
  "speech-ai": "Speech AI",
};
