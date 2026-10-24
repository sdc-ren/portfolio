-- Update original English copy; retain custom fields, IDs, selections and other locales.
DO $migration$
DECLARE
  patches JSONB := $patches$[{"collection":"cvs","id":"senior-software-engineer","field":"summary","before":"Software engineer with 12 years of web development experience, including around six years of frontend technical leadership. Focused on Vue.js, Nuxt.js, TypeScript, frontend architecture, and interactive PDF editing. Recent independent work includes AI agent tools, hooks, and workflow automation.","after":"Senior Software Engineer with 12 years of web development experience, including around six years of frontend technical leadership. Focused on Vue.js, Nuxt.js, TypeScript, frontend architecture, and interactive PDF editing. Recent independent work includes AI agent tools, hooks, and workflow automation, alongside research into prompt engineering and multi-agent workflows."},{"collection":"experience","id":"experience-1","field":"period","before":"2020 – Sep 2026","after":"2020 - Sep 2026"},{"collection":"experience","id":"experience-2","field":"period","before":"2016 – 2020","after":"2016 - 2020"},{"collection":"experience","id":"experience-3","field":"period","before":"2015 – 2016","after":"2015 - 2016"},{"collection":"experience","id":"experience-4","field":"period","before":"2014 – 2015","after":"2014 - 2015"}]$patches$::jsonb;
  entry RECORD;
  snapshot TEXT;
  document JSONB;
  patch JSONB;
  target TEXT[];
  item_index INTEGER;
  next_draft JSONB;
  next_published JSONB;
BEGIN
  FOR entry IN SELECT * FROM "Content" WHERE "locale" = 'en' FOR UPDATE LOOP
    next_draft := entry."draft";
    next_published := entry."published";
    FOREACH snapshot IN ARRAY ARRAY['draft', 'published'] LOOP
      document := CASE WHEN snapshot = 'draft' THEN next_draft ELSE next_published END;
      IF document IS NULL OR document = 'null'::jsonb THEN CONTINUE; END IF;
      FOR patch IN SELECT value FROM jsonb_array_elements(patches) LOOP
        IF patch ? 'insert' THEN
          IF NOT EXISTS (
            SELECT 1 FROM jsonb_array_elements(COALESCE(document->(patch->>'collection'), '[]'::jsonb))
            WHERE value->>'id' = patch->'insert'->>'id'
          ) THEN
            document := jsonb_set(document, ARRAY[patch->>'collection'],
              COALESCE(document->(patch->>'collection'), '[]'::jsonb) || jsonb_build_array(patch->'insert'), false);
          END IF;
          CONTINUE;
        END IF;
        IF patch ? 'path' THEN
          SELECT array_agg(value ORDER BY ordinality) INTO target
          FROM jsonb_array_elements_text(patch->'path') WITH ORDINALITY;
        ELSE
          item_index := NULL;
          SELECT (ordinality - 1)::integer INTO item_index
          FROM jsonb_array_elements(COALESCE(document->(patch->>'collection'), '[]'::jsonb)) WITH ORDINALITY
          WHERE value->>'id' = patch->>'id' LIMIT 1;
          IF item_index IS NULL THEN CONTINUE; END IF;
          target := ARRAY[patch->>'collection', item_index::text, patch->>'field'];
        END IF;
        IF document #> target = patch->'before' THEN
          document := jsonb_set(document, target, patch->'after', false);
        END IF;
      END LOOP;
      IF snapshot = 'draft' THEN next_draft := document; ELSE next_published := document; END IF;
    END LOOP;
    IF next_draft IS DISTINCT FROM entry."draft" OR next_published IS DISTINCT FROM entry."published" THEN
      UPDATE "Content" SET "draft" = next_draft, "published" = next_published,
        "revision" = "revision" + 1, "updatedAt" = CURRENT_TIMESTAMP,
        "publishedAt" = CASE WHEN next_published IS DISTINCT FROM entry."published" THEN CURRENT_TIMESTAMP ELSE "publishedAt" END
      WHERE "locale" = entry."locale";
    END IF;
  END LOOP;
END $migration$;

