-- Upgrade known starter labels while preserving custom copy and education records.
DO $migration$
DECLARE
 entry RECORD;
 replacement RECORD;
 next_draft JSONB;
 next_published JSONB;
 document JSONB;
 snapshot TEXT;
 school JSONB;
 schools JSONB;
BEGIN
 FOR entry IN SELECT * FROM "Content" WHERE "locale" IN ('en','vi') FOR UPDATE LOOP
  next_draft := entry."draft";
  next_published := entry."published";
  FOR replacement IN SELECT * FROM (VALUES
   ('en', ARRAY['ui','navCv']::text[], 'CV', 'Curriculum Vitae (CV)'),
   ('vi', ARRAY['ui','navCv']::text[], 'CV', 'Hồ sơ năng lực (CV)'),
   ('en', ARRAY['ui','cvEducation']::text[], 'Education & Languages', 'Education'),
   ('vi', ARRAY['ui','cvEducation']::text[], 'Học vấn & Ngôn ngữ', 'Học vấn')
  ) AS changes(locale,path,previous,revised) WHERE locale=entry."locale" LOOP
   IF next_draft #>> replacement.path = replacement.previous THEN
    next_draft := jsonb_set(next_draft,replacement.path,to_jsonb(replacement.revised),false);
   END IF;
   IF next_published #>> replacement.path = replacement.previous THEN
    next_published := jsonb_set(next_published,replacement.path,to_jsonb(replacement.revised),false);
   END IF;
  END LOOP;
  IF NOT (COALESCE(next_draft->'ui','{}'::jsonb) ? 'cvLanguages') THEN
   next_draft := jsonb_set(next_draft,'{ui}',COALESCE(next_draft->'ui','{}'::jsonb) || jsonb_build_object('cvLanguages',CASE WHEN entry."locale"='vi' THEN 'Ngôn ngữ' ELSE 'Languages' END),true);
  END IF;
  IF next_published IS NOT NULL AND next_published <> 'null'::jsonb AND NOT (COALESCE(next_published->'ui','{}'::jsonb) ? 'cvLanguages') THEN
   next_published := jsonb_set(next_published,'{ui}',COALESCE(next_published->'ui','{}'::jsonb) || jsonb_build_object('cvLanguages',CASE WHEN entry."locale"='vi' THEN 'Ngôn ngữ' ELSE 'Languages' END),true);
  END IF;
  IF entry."locale"='en' THEN
   FOREACH snapshot IN ARRAY ARRAY['draft','published'] LOOP
    document := CASE WHEN snapshot='draft' THEN next_draft ELSE next_published END;
    IF document IS NULL OR document='null'::jsonb THEN CONTINUE; END IF;
    schools := '[]'::jsonb;
    FOR school IN SELECT value FROM jsonb_array_elements(COALESCE(document->'education','[]'::jsonb)) LOOP
     IF ((school->>'id'='duy-tan' AND school->>'institution'='Duy Tan University') OR (school->>'id'='it-college' AND school->>'institution'='College of Information Technology')) AND COALESCE(school->>'location','')='' THEN
      school := school || '{"location":"Da Nang"}'::jsonb;
     END IF;
     schools := schools || jsonb_build_array(school);
    END LOOP;
    document := jsonb_set(document,'{education}',schools,false);
    IF snapshot='draft' THEN next_draft:=document; ELSE next_published:=document; END IF;
   END LOOP;
  END IF;
  IF next_draft IS DISTINCT FROM entry."draft" OR next_published IS DISTINCT FROM entry."published" THEN
   UPDATE "Content" SET "draft"=next_draft,"published"=next_published,
    "revision"="revision"+1,"updatedAt"=CURRENT_TIMESTAMP,
    "publishedAt"=CASE WHEN next_published IS DISTINCT FROM entry."published" THEN CURRENT_TIMESTAMP ELSE entry."publishedAt" END
   WHERE "locale"=entry."locale";
  END IF;
 END LOOP;
END $migration$;
