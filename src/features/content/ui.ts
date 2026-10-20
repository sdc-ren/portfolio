import { z } from "zod";
export const englishUi = {
  closeDialog: "Close",
  navProjects: "Projects",
  navExperience: "Experience",
  navCv: "Curriculum Vitae (CV)",
  navLabel: "Main navigation",
  languageLabel: "Language",
  letsTalk: "Let’s talk",
  exploreWork: "Explore my work",
  viewCv: "View CV",
  selectedWork: "Selected work",
  workHeading: "Selected projects",
  allProjects: "All projects",
  experienceHeading: "Professional experience",
  toolkit: "Toolkit",
  toolkitHeading: "Technical skills",
  contactHeading: "Get in touch",
  contactButton: "Get in touch",
  portfolio: "Portfolio",
  projectsHeading: "Selected projects.",
  projectsDescription:
    "Selected frontend, full-stack, and open-source projects by Dang Chi Son, covering interactive PDF editing, personal finance, and AI agent tooling.",
  searchProjects: "Search projects",
  searchPlaceholder: "Name, role or description…",
  technology: "Technology",
  allTechnologies: "All technologies",
  projectsCount: "{count} projects",
  projectCount: "{count} project",
  noProjects: "No projects match your filters.",
  sourceCode: "Source code",
  liveProject: "Live project",
  contributions: "Contributions",
  downloadPdf: "Download PDF",
  cvVersions: "CV versions",
  cvSummary: "Professional Summary",
  cvSkills: "Technical Skills",
  cvExperience: "Professional Experience",
  cvProjects: "Selected Projects",
  cvEducation: "Education",
  cvLanguages: "Languages",
  emailLabel: "Email",
} as const;
export type UiLabels = { [K in keyof typeof englishUi]: string };
export const vietnameseUi: UiLabels = {
  closeDialog: "Đóng",
  navProjects: "Dự án",
  navExperience: "Kinh nghiệm",
  navCv: "Hồ sơ năng lực (CV)",
  navLabel: "Điều hướng chính",
  languageLabel: "Ngôn ngữ",
  letsTalk: "Liên hệ",
  exploreWork: "Khám phá dự án",
  viewCv: "Xem CV",
  selectedWork: "Dự án nổi bật",
  workHeading: "Dự án tiêu biểu",
  allProjects: "Tất cả dự án",
  experienceHeading: "Kinh nghiệm làm việc",
  toolkit: "Công nghệ",
  toolkitHeading: "Kỹ năng chuyên môn",
  contactHeading: "Liên hệ",
  contactButton: "Liên hệ với tôi",
  portfolio: "Hồ sơ dự án",
  projectsHeading: "Các dự án tiêu biểu.",
  projectsDescription:
    "Phát triển sản phẩm, dẫn dắt frontend và công cụ mã nguồn mở dành cho lập trình viên.",
  searchProjects: "Tìm dự án",
  searchPlaceholder: "Tên, vai trò hoặc mô tả…",
  technology: "Công nghệ",
  allTechnologies: "Tất cả công nghệ",
  projectsCount: "{count} dự án",
  projectCount: "{count} dự án",
  noProjects: "Không có dự án phù hợp.",
  sourceCode: "Mã nguồn",
  liveProject: "Xem sản phẩm",
  contributions: "Đóng góp",
  downloadPdf: "Tải PDF",
  cvVersions: "Phiên bản CV",
  cvSummary: "Giới thiệu",
  cvSkills: "Kỹ năng chuyên môn",
  cvExperience: "Kinh nghiệm làm việc",
  cvProjects: "Dự án tiêu biểu",
  cvEducation: "Học vấn",
  cvLanguages: "Ngôn ngữ",
  emailLabel: "Email",
};
// Defaults preserve existing documents; each locale can override every public label.
export const uiSchema = z
  .object({
    cvLanguages: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.cvLanguages),
    closeDialog: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.closeDialog),
    navProjects: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.navProjects),
    navExperience: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.navExperience),
    navCv: z.string().trim().min(1).max(1000).default(englishUi.navCv),
    navLabel: z.string().trim().min(1).max(1000).default(englishUi.navLabel),
    languageLabel: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.languageLabel),
    letsTalk: z.string().trim().min(1).max(1000).default(englishUi.letsTalk),
    exploreWork: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.exploreWork),
    viewCv: z.string().trim().min(1).max(1000).default(englishUi.viewCv),
    selectedWork: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.selectedWork),
    workHeading: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.workHeading),
    allProjects: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.allProjects),
    experienceHeading: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.experienceHeading),
    toolkit: z.string().trim().min(1).max(1000).default(englishUi.toolkit),
    toolkitHeading: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.toolkitHeading),
    contactHeading: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.contactHeading),
    contactButton: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.contactButton),
    portfolio: z.string().trim().min(1).max(1000).default(englishUi.portfolio),
    projectsHeading: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.projectsHeading),
    projectsDescription: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.projectsDescription),
    searchProjects: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.searchProjects),
    searchPlaceholder: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.searchPlaceholder),
    technology: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.technology),
    allTechnologies: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.allTechnologies),
    projectsCount: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.projectsCount),
    projectCount: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.projectCount),
    noProjects: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.noProjects),
    sourceCode: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.sourceCode),
    liveProject: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.liveProject),
    contributions: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.contributions),
    downloadPdf: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.downloadPdf),
    cvVersions: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.cvVersions),
    cvSummary: z.string().trim().min(1).max(1000).default(englishUi.cvSummary),
    cvSkills: z.string().trim().min(1).max(1000).default(englishUi.cvSkills),
    cvExperience: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.cvExperience),
    cvProjects: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.cvProjects),
    cvEducation: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.cvEducation),
    emailLabel: z
      .string()
      .trim()
      .min(1)
      .max(1000)
      .default(englishUi.emailLabel),
  })
  .default(() => ({ ...englishUi }));
export function defaultUiForLocale(locale: string): UiLabels {
  return { ...(locale.startsWith("vi") ? vietnameseUi : englishUi) };
}
export function formatProjectCount(labels: UiLabels, count: number) {
  return (count === 1 ? labels.projectCount : labels.projectsCount).replaceAll(
    "{count}",
    String(count),
  );
}
