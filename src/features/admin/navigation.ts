import {
  BriefcaseBusiness,
  Code2,
  FileText,
  FolderKanban,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Settings2,
  Tags,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
export type Section = "overview" | "translations" | keyof PortfolioContent;
export const navigation: {
  key: Section;
  label: string;
  description: string;
  group: string;
  icon: LucideIcon;
}[] = [
  {
    key: "overview",
    label: "Overview",
    description: "Manage your portfolio content and publishing workflow.",
    group: "Workspace",
    icon: LayoutDashboard,
  },
  {
    key: "projects",
    label: "Projects",
    description: "Manage project details, technologies and featured work.",
    group: "Content",
    icon: FolderKanban,
  },
  {
    key: "experience",
    label: "Experience",
    description: "Manage roles, companies and professional achievements.",
    group: "Content",
    icon: BriefcaseBusiness,
  },
  {
    key: "profile",
    label: "Profile & contact",
    description:
      "Update your introduction, personal details and contact channels.",
    group: "Content",
    icon: UserRound,
  },
  {
    key: "skills",
    label: "Skill groups",
    description: "Organize the skills shown on your website and CV.",
    group: "Content",
    icon: Code2,
  },
  {
    key: "cvs",
    label: "CV documents",
    description: "Select shared content and set its order in each CV.",
    group: "Content",
    icon: FileText,
  },
  {
    key: "education",
    label: "Education",
    description: "Maintain qualifications and education history.",
    group: "Content",
    icon: GraduationCap,
  },
  {
    key: "languages",
    label: "Spoken languages",
    description: "Manage language proficiency displayed on your CV.",
    group: "Content",
    icon: Languages,
  },
  {
    key: "technologies",
    label: "Technologies",
    description: "Maintain reusable technology choices for your projects.",
    group: "Configuration",
    icon: Tags,
  },
  {
    key: "roles",
    label: "Role catalog",
    description: "Maintain reusable role choices for your content.",
    group: "Configuration",
    icon: BriefcaseBusiness,
  },
  {
    key: "ui",
    label: "Interface copy",
    description:
      "Translate navigation, labels and public-facing interface text.",
    group: "Configuration",
    icon: Languages,
  },
  {
    key: "settings",
    label: "Site settings",
    description: "Manage SEO metadata, header roles and footer text.",
    group: "Configuration",
    icon: Settings2,
  },
  {
    key: "translations",
    label: "Translations",
    description: "Switch content language or create a new draft translation.",
    group: "Configuration",
    icon: Languages,
  },
];
