-- Add editable contact copy; preserve custom labels and unpublished locales.
DO $migration$
DECLARE
 entry RECORD;
 snapshot TEXT;
 document JSONB;
 labels JSONB;
 next_draft JSONB;
 next_published JSONB;
 is_vi BOOLEAN;
BEGIN
 FOR entry IN SELECT * FROM "Content" FOR UPDATE LOOP
  next_draft := entry."draft";
  next_published := entry."published";
  is_vi := entry."locale" LIKE 'vi%';
  FOREACH snapshot IN ARRAY ARRAY['draft','published'] LOOP
   document := CASE WHEN snapshot='draft' THEN next_draft ELSE next_published END;
   IF document IS NULL OR document='null'::jsonb THEN CONTINUE; END IF;
   labels := COALESCE(NULLIF(document->'ui','null'::jsonb),'{}'::jsonb);
   IF NOT (labels ? 'contactDescription') THEN
    labels := labels || jsonb_build_object('contactDescription', CASE WHEN is_vi
     THEN 'Bạn muốn trao đổi về cơ hội công việc hoặc một dự án? Hãy gửi email hoặc kết nối với tôi qua LinkedIn.'
     ELSE 'Have an engineering opportunity or a project to discuss? Send me an email or connect with me on LinkedIn.' END);
   END IF;
   IF (entry."locale"='en' AND labels->>'contactHeading'='Get in touch') OR (entry."locale"='vi' AND labels->>'contactHeading'='Liên hệ') THEN
    labels := labels || jsonb_build_object('contactHeading',CASE WHEN is_vi THEN 'Cùng trao đổi' ELSE 'Let’s connect' END);
   END IF;
   IF (entry."locale"='en' AND labels->>'contactButton'='Get in touch') OR (entry."locale"='vi' AND labels->>'contactButton'='Liên hệ với tôi') THEN
    labels := labels || jsonb_build_object('contactButton',CASE WHEN is_vi THEN 'Gửi email' ELSE 'Send an email' END);
   END IF;
   document := jsonb_set(document,'{ui}',labels,true);
   IF snapshot='draft' THEN next_draft:=document; ELSE next_published:=document; END IF;
  END LOOP;
  IF next_draft IS DISTINCT FROM entry."draft" OR next_published IS DISTINCT FROM entry."published" THEN
   UPDATE "Content" SET "draft"=next_draft,"published"=next_published,
    "revision"="revision"+1,"updatedAt"=CURRENT_TIMESTAMP,
    "publishedAt"=CASE WHEN next_published IS DISTINCT FROM entry."published" THEN CURRENT_TIMESTAMP ELSE entry."publishedAt" END
   WHERE "locale"=entry."locale";
  END IF;
 END LOOP;
END $migration$;
