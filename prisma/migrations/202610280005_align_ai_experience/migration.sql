-- Explicit editorial request: align AI professional history to the current Senior CV.
-- Copy references, not facts; keep each snapshot independent and all other CV fields intact.
DO $migration$
DECLARE
 entry RECORD; snapshot TEXT; document JSONB; senior JSONB; ai_index INTEGER;
 next_draft JSONB; next_published JSONB;
BEGIN
 FOR entry IN SELECT * FROM "Content" WHERE "locale" IN ('en','vi') FOR UPDATE LOOP
  next_draft:=entry."draft";next_published:=entry."published";
  FOREACH snapshot IN ARRAY ARRAY['draft','published'] LOOP
   document:=CASE WHEN snapshot='draft' THEN next_draft ELSE next_published END;
   IF document IS NULL OR document='null'::JSONB THEN CONTINUE; END IF;
   SELECT value INTO senior FROM jsonb_array_elements(document->'cvs') WHERE value->>'id'='senior-software-engineer' LIMIT 1;
   SELECT (ordinality-1)::INTEGER INTO ai_index FROM jsonb_array_elements(document->'cvs') WITH ORDINALITY WHERE value->>'id'='ai-engineer' LIMIT 1;
   IF senior IS NULL OR ai_index IS NULL THEN CONTINUE; END IF;
   document:=jsonb_set(document,ARRAY['cvs',ai_index::TEXT,'experienceIds'],senior->'experienceIds',true);
   document:=jsonb_set(document,ARRAY['cvs',ai_index::TEXT,'experienceSelections'],COALESCE(senior->'experienceSelections','{}'::JSONB),true);
   IF snapshot='draft' THEN next_draft:=document; ELSE next_published:=document; END IF;
  END LOOP;
  IF next_draft IS DISTINCT FROM entry."draft" OR next_published IS DISTINCT FROM entry."published" THEN
   UPDATE "Content" SET "draft"=next_draft,"published"=next_published,"revision"="revision"+1,"updatedAt"=CURRENT_TIMESTAMP,
    "publishedAt"=CASE WHEN next_published IS DISTINCT FROM entry."published" THEN CURRENT_TIMESTAMP ELSE entry."publishedAt" END
    WHERE "locale"=entry."locale";
  END IF;
 END LOOP;
END $migration$;
