-- Update only unchanged English hero and flagship case-study copy; preserve CMS edits.
DO $migration$
DECLARE
  patches JSONB := $patches$[{"path": ["profile", "tagline"], "before": "Frontend engineering and developer tools", "after": "Frontend engineer. Thoughtful interfaces. AI tools."}, {"path": ["profile", "summary"], "before": "I'm Dang Chi Son, a software engineer based in Da Nang with 12 years of web development experience, including around six years of frontend technical leadership. My main focus is Vue.js, Nuxt.js, TypeScript, and frontend architecture. I also build AI agent tools, hooks, and workflow automation around coding assistants.", "after": "I build maintainable web interfaces and complex PDF/canvas interactions. With 12 years in software engineering and around six years of frontend technical leadership, I’m extending that foundation into AI agent tools and model integration."}, {"collection": "projects", "id": "jinjer", "field": "description", "before": "Led six frontend engineers building PDF rendering, annotation, highlighting, and drawing features.\n\nWorked with PDF documents of 10-20 pages and 15-20 MB; built a PDF.js/Konva.js interaction layer and investigated rendering bottlenecks.", "after": "### Problem\nDocument management workflows needed PDF rendering and interactive annotation, highlighting, and drawing within a web interface. Typical documents contained 10-20 pages and were 15-20 MB.\n\n### My contribution\nLed six frontend engineers while developing complex PDF/canvas interactions hands-on with Vue 3 and TypeScript.\n\n### Technical decisions\nCombined PDF.js document rendering with Konva.js for an editable interaction layer. Built a PDF-processing core and investigated rendering bottlenecks around the document sizes used by the product.\n\n### Trade-offs\nThe custom interaction layer gave control over editing behavior while adding coordination work between PDF rendering and canvas overlays.\n\n### Outcome\nDelivered PDF rendering, annotation, highlighting, and drawing features for a document management product."}, {"collection": "projects", "id": "localmem", "field": "description", "before": "AI coding assistants lose project context across sessions, while large instruction files consume context even when their contents are irrelevant. localmem stores notes, traces, and lessons in a local SQLite database and exposes workspace-scoped memory through a Python CLI and a shared stdio MCP server.\n\nRetrieval combines FTS5/BM25 full-text search, agent-supplied keywords, entity-based ranking, and evidence links. Storage, indexing, deduplication, and retrieval run locally; no LLM or network call is required on the recall path. This is lexical information retrieval, not embedding-based semantic search.\n\nImplemented deduplication, import/export, and agent configuration support. A bilingual evaluation fixture measures recall@k, mean reciprocal rank (MRR), and off-corpus behavior to assess retrieval quality and fallback limitations.", "after": "### Problem\nCoding agents lose context between sessions. Large instruction files consume context even when most of their content is irrelevant to the current task.\n\n### My contribution\nBuilt a Python CLI and shared stdio MCP server for persistent, workspace-scoped notes, traces, and lessons across coding assistants.\n\n### Technical decisions\nCombined SQLite FTS5/BM25 full-text search, agent-supplied keywords, entity-based ranking, and evidence links. Implemented normalized-content deduplication, import/export, and agent configuration support. Storage and retrieval run locally, with no LLM or network call on the recall path.\n\n### Trade-offs\nRetrieval is lexical, not embedding-based semantic search. Keyword quality and fallback behavior affect results. A bilingual query fixture evaluates recall@k, mean reciprocal rank (MRR), and off-corpus behavior; these are fixture-based evaluations, not production adoption metrics.\n\n### Outcome\nDelivered one local memory interface shared by Claude Code, Codex, Antigravity, and Kiro, with inspectable retrieval behavior and documented limits."}, {"collection": "projects", "id": "ivr-studio", "field": "description", "before": "Built a local web application and CLI for producing Vietnamese interactive voice response (IVR) greetings and menus from text. Integrated edge-tts for standard voices and a pretrained F5-TTS model for reference-conditioned, zero-shot speech generation; no model training or fine-tuning is performed by this project.\n\nA Node.js server orchestrates Python inference and FFmpeg audio processing. A resident Python worker reuses the loaded F5-TTS checkpoint across requests and releases it after inactivity. The pipeline normalizes Vietnamese numbers, splits long text into model-safe chunks, controls timing, and assembles MP3/WAV output.\n\nOptional Whisper transcription checks generated speech against the script, triggering bounded retries and retaining the best-matching result. Users can preview and regenerate individual lines, review reference transcripts, and reopen saved jobs through the web interface.\n\nThis is a local prototype for model integration and audio workflow engineering. The selected Vietnamese F5-TTS checkpoint has non-commercial restrictions; reference voices require appropriate usage rights. It is not presented as a commercially cleared voice service.", "after": "### Problem\nProducing Vietnamese IVR greetings and menus requires script preparation, voice generation, timing controls, and review of missing or mispronounced words.\n\n### My contribution\nBuilt a local web application and CLI integrating edge-tts and a pretrained F5-TTS model for reference-conditioned, zero-shot speech generation. The project performs no model training or fine-tuning.\n\n### Technical decisions\nA Node.js server orchestrates Python inference and FFmpeg processing. A resident worker reuses the loaded F5-TTS checkpoint and releases it after inactivity. The pipeline normalizes Vietnamese numbers, chunks long text, and assembles MP3/WAV output.\n\n### Trade-offs\nSpeech generation remains variable. Optional Whisper transcription checks the output against the script, triggers bounded retries, and retains the best-matching result; users can review and regenerate individual lines. The selected checkpoint is restricted to non-commercial use and reference voices require appropriate rights.\n\n### Outcome\nDelivered a local prototype with per-line preview, regeneration, transcript review, saved jobs, and audio export, demonstrating model integration and audio-workflow engineering."}]$patches$::jsonb;
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

