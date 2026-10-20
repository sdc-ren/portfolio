-- Replace only known starter copy. Preserve all customized values and CV summaries.
-- Lock each locale while changing it so admin edits cannot race the migration.
DO $migration$
DECLARE
 entry RECORD;
 replacement RECORD;
 next_draft JSONB;
 next_published JSONB;
BEGIN
 FOR entry IN SELECT * FROM "Content" WHERE "locale" IN ('en','vi') FOR UPDATE LOOP
  next_draft := entry."draft";
  next_published := entry."published";
  FOR replacement IN SELECT * FROM (VALUES
('en', ARRAY['profile','tagline']::text[], 'Frontend architecture. Practical AI tooling.', 'Frontend engineering and developer tools'),
('en', ARRAY['profile','summary']::text[], 'Senior Software Engineer with approximately 12 years of experience, specializing in frontend engineering with Vue.js, React, Angular, and TypeScript. Spent nearly 10 years at NeoLab and DGWAsian following its acquisition in 2023, including around six years leading frontend teams of 6–10 engineers. Experienced in frontend architecture, performance optimization, engineering standards, and delivery of complex web applications. Also builds Node.js backend services, a full-stack personal finance product, and open-source tools integrating AI coding agents through MCP, event hooks, and secure remote workflows. Focused on expanding practical expertise in AI agent engineering.', 'I''m Dang Chi Son, a software engineer based in Da Nang. I work on frontend architecture, complex web applications, and technical leadership with TypeScript, Vue, React, and Angular. I also build full-stack applications and open-source tools that connect coding agents with Google Workspace and Telegram.'),
('en', ARRAY['settings','footer']::text[], 'Built with care. Maintained with purpose.', 'Software engineering portfolio'),
('en', ARRAY['ui','workHeading']::text[], 'Things I’ve helped build.', 'Selected projects'),
('en', ARRAY['ui','experienceHeading']::text[], 'Engineering. Ownership. Delivery.', 'Professional experience'),
('en', ARRAY['ui','toolkitHeading']::text[], 'Tools that serve the work.', 'Technical skills'),
('en', ARRAY['ui','contactHeading']::text[], 'Have something in mind?', 'Get in touch'),
('vi', ARRAY['ui','workHeading']::text[], 'Những sản phẩm tôi đã tham gia xây dựng.', 'Dự án tiêu biểu'),
('vi', ARRAY['ui','experienceHeading']::text[], 'Kỹ thuật. Trách nhiệm. Bàn giao.', 'Kinh nghiệm làm việc'),
('vi', ARRAY['ui','toolkitHeading']::text[], 'Công cụ phục vụ công việc.', 'Kỹ năng chuyên môn'),
('vi', ARRAY['ui','contactHeading']::text[], 'Bạn có ý tưởng muốn trao đổi?', 'Liên hệ')
  ) AS changes(locale, path, previous, revised) WHERE locale = entry."locale" LOOP
   IF next_draft #>> replacement.path = replacement.previous THEN
    next_draft := jsonb_set(next_draft, replacement.path, to_jsonb(replacement.revised), false);
   END IF;
   IF next_published #>> replacement.path = replacement.previous THEN
    next_published := jsonb_set(next_published, replacement.path, to_jsonb(replacement.revised), false);
   END IF;
  END LOOP;
  IF next_draft IS DISTINCT FROM entry."draft" OR next_published IS DISTINCT FROM entry."published" THEN
   UPDATE "Content" SET "draft" = next_draft, "published" = next_published,
    "revision" = "revision" + 1, "updatedAt" = CURRENT_TIMESTAMP,
    "publishedAt" = CASE WHEN next_published IS DISTINCT FROM entry."published" THEN CURRENT_TIMESTAMP ELSE entry."publishedAt" END
   WHERE "locale" = entry."locale";
  END IF;
 END LOOP;
END $migration$;
