-- Add project/AI CV without replacing existing CMS edits or selections.
DO $migration$
DECLARE
 payload JSONB := $payload${"en": {"project": {"id": "localmem", "title": "localmem - Local Memory for AI Coding Agents", "role": "Creator / Maintainer", "category": "AI agent tooling", "summary": "Built a local-first memory layer for AI coding agents, with Python, SQLite, and a shared stdio MCP server.", "description": "Persistent, workspace-scoped memory shared by coding assistants through CLI and MCP tools. Retrieval combines SQLite FTS5/BM25 with entity-based ranking, without an LLM call on the recall path.\n\nImplemented deduplication, evidence links, import/export, and agent configuration support. Includes a bilingual retrieval evaluation suite; recall remains lexical rather than embedding-based.", "tech": ["Python", "SQLite", "FTS5 / BM25", "Model Context Protocol (MCP)", "Click", "pytest"], "highlights": ["Built CLI and stdio MCP tools for persistent, workspace-scoped memory shared by Claude Code, Codex, Antigravity, and Kiro.", "Combined FTS5/BM25 search with entity-based ranking and evidence links; kept retrieval local without LLM calls.", "Implemented deduplication, import/export, and bilingual retrieval evaluation with recall and ranking metrics."], "featured": true, "links": [{"id": "source", "type": "github", "url": "https://github.com/sdc-ren/localmem", "label": "", "showInCv": true}], "images": [], "coverImageId": ""}, "skills": [{"id": "ai-engineering", "name": "AI Agent Engineering", "items": ["MCP servers and tools", "agent hooks", "workflow automation", "tool schemas", "scoped document retrieval", "context optimization"]}, {"id": "ai-programming", "name": "Programming & Data", "items": ["Python", "TypeScript", "JavaScript", "Node.js", "SQLite / FTS5", "PostgreSQL", "Supabase", "REST APIs"]}, {"id": "ai-reliability", "name": "Reliability & Evaluation", "items": ["Retrieval evaluation", "deduplication", "retry handling", "authorization checks", "timeouts", "pytest", "Playwright", "Vitest"]}, {"id": "ai-development-tools", "name": "AI Development Tools", "items": ["Claude Code", "Codex", "Google Antigravity", "Prompt engineering research", "Multi-agent workflow research"]}], "cv": {"id": "ai-engineer", "title": "AI ENGINEER", "summary": "Software Engineer with 12 years of web development experience, including around six years of frontend technical leadership, focused on AI agent tooling and workflow automation. Built local-first memory retrieval, Google Workspace CLI/MCP tools, and coding-assistant hooks for Telegram notifications and approvals. Combines Python/TypeScript, API integration, and automated testing with ongoing research into prompt engineering and multi-agent workflows.", "specialties": "AI Agent Tooling · MCP · Memory Retrieval · Python / TypeScript · Workflow Automation", "projectIds": ["localmem", "gdrive-cli", "cc-notify-telegram", "altfins"], "skillIds": ["ai-engineering", "ai-programming", "ai-reliability", "ai-development-tools", "architecture", "devops-delivery"], "experienceIds": ["experience-1", "experience-2", "experience-3", "experience-4"]}}, "vi": {"project": {"id": "localmem", "title": "localmem - Local Memory for AI Coding Agents", "role": "Creator / Maintainer", "category": "AI agent tooling", "summary": "Xây dựng bộ nhớ cục bộ cho AI coding agents bằng Python, SQLite và MCP server dùng chung.", "description": "Bộ nhớ lâu dài theo workspace, truy cập qua CLI và MCP. Kết hợp SQLite FTS5/BM25 với xếp hạng theo thực thể, không gọi LLM trong luồng truy hồi.\n\nCó khử trùng lặp, liên kết bằng chứng, import/export và bộ đánh giá truy hồi song ngữ; phương pháp truy hồi dựa trên từ khóa, không dùng embeddings.", "tech": ["Python", "SQLite", "FTS5 / BM25", "Model Context Protocol (MCP)", "Click", "pytest"], "highlights": ["Xây dựng CLI và MCP stdio cho bộ nhớ theo workspace, dùng chung giữa Claude Code, Codex, Antigravity và Kiro.", "Kết hợp FTS5/BM25 với xếp hạng theo thực thể và liên kết bằng chứng; truy hồi cục bộ không gọi LLM.", "Triển khai khử trùng lặp, import/export và đánh giá truy hồi song ngữ bằng các chỉ số recall và ranking."], "featured": true, "links": [{"id": "source", "type": "github", "url": "https://github.com/sdc-ren/localmem", "label": "", "showInCv": true}], "images": [], "coverImageId": ""}, "skills": [{"id": "ai-engineering", "name": "AI Agent Engineering", "items": ["MCP servers and tools", "agent hooks", "workflow automation", "tool schemas", "scoped document retrieval", "context optimization"]}, {"id": "ai-programming", "name": "Programming & Data", "items": ["Python", "TypeScript", "JavaScript", "Node.js", "SQLite / FTS5", "PostgreSQL", "Supabase", "REST APIs"]}, {"id": "ai-reliability", "name": "Reliability & Evaluation", "items": ["Retrieval evaluation", "deduplication", "retry handling", "authorization checks", "timeouts", "pytest", "Playwright", "Vitest"]}, {"id": "ai-development-tools", "name": "AI Development Tools", "items": ["Claude Code", "Codex", "Google Antigravity", "Prompt engineering research", "Multi-agent workflow research"]}], "cv": {"id": "ai-engineer", "title": "AI ENGINEER", "summary": "Kỹ sư phần mềm với 12 năm phát triển web, trong đó khoảng 6 năm dẫn dắt kỹ thuật frontend, tập trung vào AI agent tooling và tự động hóa workflow. Xây dựng bộ nhớ truy hồi cục bộ, công cụ CLI/MCP cho Google Workspace và hooks gửi thông báo, yêu cầu phê duyệt qua Telegram. Kết hợp Python/TypeScript, tích hợp API và kiểm thử tự động với nghiên cứu prompt engineering và workflow đa agent.", "specialties": "AI Agent Tooling · MCP · Memory Retrieval · Python / TypeScript · Workflow Automation", "projectIds": ["localmem", "gdrive-cli", "cc-notify-telegram", "altfins"], "skillIds": ["ai-engineering", "ai-programming", "ai-reliability", "ai-development-tools", "architecture", "devops-delivery"], "experienceIds": ["experience-1", "experience-2", "experience-3", "experience-4"]}}}$payload$::jsonb;
 entry RECORD; snapshot TEXT; document JSONB; additions JSONB; item JSONB;
 collection TEXT; selected JSONB; cv JSONB; field TEXT; source TEXT;
 next_draft JSONB; next_published JSONB;
BEGIN
 FOR entry IN SELECT * FROM "Content" WHERE "locale" IN ('en','vi') FOR UPDATE LOOP
  next_draft := entry."draft"; next_published := entry."published";
  additions := payload->entry."locale";
  FOREACH snapshot IN ARRAY ARRAY['draft','published'] LOOP
   document := CASE WHEN snapshot='draft' THEN next_draft ELSE next_published END;
   IF document IS NULL OR document='null'::jsonb THEN CONTINUE; END IF;
   FOREACH collection IN ARRAY ARRAY['projects','skills'] LOOP
    FOR item IN SELECT value FROM jsonb_array_elements(
     CASE WHEN collection='projects' THEN jsonb_build_array(additions->'project') ELSE additions->'skills' END
    ) LOOP
     IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(document->collection,'[]'::jsonb)) e WHERE e->>'id'=item->>'id') THEN
      document := jsonb_set(document,ARRAY[collection],COALESCE(document->collection,'[]'::jsonb)||jsonb_build_array(item),true);
     END IF;
    END LOOP;
   END LOOP;
   FOR item IN SELECT value FROM jsonb_array_elements(additions->'project'->'tech') LOOP
    IF NOT COALESCE(document->'technologies','[]'::jsonb) @> jsonb_build_array(item) THEN
     document := jsonb_set(document,'{technologies}',COALESCE(document->'technologies','[]'::jsonb)||jsonb_build_array(item),true);
    END IF;
   END LOOP;
   IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(document->'cvs','[]'::jsonb)) e WHERE e->>'id'='ai-engineer') THEN
    cv := additions->'cv';
    -- Resolve only records present in each snapshot; preserve configured ordering.
    FOREACH field IN ARRAY ARRAY['projectIds','skillIds','experienceIds'] LOOP
     source := CASE field WHEN 'projectIds' THEN 'projects' WHEN 'skillIds' THEN 'skills' ELSE 'experience' END;
     SELECT COALESCE(jsonb_agg(w.value ORDER BY w.ordinality),'[]'::jsonb) INTO selected
      FROM jsonb_array_elements(cv->field) WITH ORDINALITY w
      WHERE EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(document->source,'[]'::jsonb)) e WHERE e->'id'=w.value);
     cv := jsonb_set(cv,ARRAY[field],selected);
    END LOOP;
    document := jsonb_set(document,'{cvs}',COALESCE(document->'cvs','[]'::jsonb)||jsonb_build_array(cv),true);
   END IF;
   IF snapshot='draft' THEN next_draft:=document; ELSE next_published:=document; END IF;
  END LOOP;
  IF next_draft IS DISTINCT FROM entry."draft" OR next_published IS DISTINCT FROM entry."published" THEN
   UPDATE "Content" SET "draft"=next_draft,"published"=next_published,"revision"="revision"+1,"updatedAt"=CURRENT_TIMESTAMP,
    "publishedAt"=CASE WHEN next_published IS DISTINCT FROM entry."published" THEN CURRENT_TIMESTAMP ELSE entry."publishedAt" END
    WHERE "locale"=entry."locale";
  END IF;
 END LOOP;
END $migration$;
