import { z } from "zod";
export const englishUi = {
  navProjects: "Projects",
  navExperience: "Experience",
  navCv: "CV",
  navLabel: "Main navigation",
  languageLabel: "Language",
  letsTalk: "Let’s talk",
  exploreWork: "Explore my work",
  viewCv: "View CV",
  selectedWork: "Selected work",
  workHeading: "Things I’ve helped build.",
  allProjects: "All projects",
  experienceHeading: "Engineering. Ownership. Delivery.",
  toolkit: "Toolkit",
  toolkitHeading: "Tools that serve the work.",
  contactHeading: "Have something in mind?",
  contactButton: "Get in touch",
  portfolio: "Portfolio",
  projectsHeading: "Selected projects.",
  projectsDescription:
    "Product engineering, frontend leadership and open-source developer tools.",
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
  cvEducation: "Education & Languages",
  emailLabel: "Email",
} as const;
export type UiLabels = { [K in keyof typeof englishUi]: string };
export const vietnameseUi: UiLabels = {
  navProjects: "Dự án",
  navExperience: "Kinh nghiệm",
  navCv: "CV",
  navLabel: "Điều hướng chính",
  languageLabel: "Ngôn ngữ",
  letsTalk: "Liên hệ",
  exploreWork: "Khám phá dự án",
  viewCv: "Xem CV",
  selectedWork: "Dự án nổi bật",
  workHeading: "Những sản phẩm tôi đã tham gia xây dựng.",
  allProjects: "Tất cả dự án",
  experienceHeading: "Kỹ thuật. Trách nhiệm. Bàn giao.",
  toolkit: "Công nghệ",
  toolkitHeading: "Công cụ phục vụ công việc.",
  contactHeading: "Bạn có ý tưởng muốn trao đổi?",
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
  cvEducation: "Học vấn & Ngôn ngữ",
  emailLabel: "Email",
};
// Defaults preserve existing documents; each locale can override every public label.
export const uiSchema = z
  .object({
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
