/** Suggestions only: existing and custom labels remain valid. */
export const technologySuggestions = [
  "TypeScript",
  "JavaScript",
  "Vue.js",
  "Vue 3",
  "Nuxt",
  "React",
  "Next.js",
  "Angular",
  "Node.js",
  "Express",
  "NestJS",
  "HTML",
  "CSS",
  "SCSS",
  "Tailwind CSS",
  "shadcn/ui",
  "Prisma",
  "PostgreSQL",
  "Supabase",
  "Redis",
  "Docker",
  "Vercel",
  "Cloudflare",
  "Vitest",
  "Playwright",
  "GitHub Actions",
  "Python",
  "Java",
  "PHP",
  "Laravel",
  "GraphQL",
  "REST API",
  "WebSocket",
  "PDF.js",
  "Konva.js",
  "Canvas",
  "MCP",
  "Claude",
  "OpenAI API",
];
export const roleSuggestions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Engineer",
  "Full-stack Developer",
  "Frontend Technical Lead",
  "Tech Lead",
  "Software Architect",
  "AI Engineer",
  "AI Agent Engineer",
  "Developer",
  "Maintainer",
];
export function uniqueChipOptions(options: readonly string[]): string[] {
  const seen = new Set<string>();
  return options.flatMap((option) => {
    const label = option.trim();
    const key = label.toLowerCase();
    if (!label || seen.has(key)) return [];
    seen.add(key);
    return [label];
  });
}
