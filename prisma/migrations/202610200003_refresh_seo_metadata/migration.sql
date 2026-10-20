-- Refresh known starter metadata only; preserve custom SEO copy and other locales.
DO $migration$
DECLARE
 entry RECORD;
 replacement RECORD;
 next_draft JSONB;
 next_published JSONB;
BEGIN
 FOR entry IN SELECT * FROM "Content" WHERE "locale" = 'en' FOR UPDATE LOOP
  next_draft := entry."draft";
  next_published := entry."published";
  FOR replacement IN SELECT * FROM (VALUES
(ARRAY['settings','title']::text[], 'Dang Chi Son | Software Engineer', 'Dang Chi Son | Senior Software Engineer'),
(ARRAY['settings','description']::text[], 'Frontend architecture, technical leadership and open-source AI agent tooling by Dang Chi Son.', 'Senior Software Engineer in Da Nang, Vietnam, with 12 years of experience in frontend architecture, technical leadership, and practical AI agent tooling.'),
(ARRAY['ui','projectsDescription']::text[], 'Product engineering, frontend leadership and open-source developer tools.', 'Selected frontend, full-stack, and open-source projects by Dang Chi Son, covering interactive PDF editing, personal finance, and AI agent tooling.')
  ) AS changes(path, previous, revised) LOOP
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
