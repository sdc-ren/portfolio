# AI project copy

English card summaries, project details, and CV highlights now explain the problem, implementation and actual usage. Technical terms are placed in context: Model Context Protocol (MCP), FTS5/BM25, information retrieval, context management, retrieval evaluation, human-in-the-loop workflows, session-aware routing and API integration. localmem remains lexical retrieval rather than embedding-based semantic search; no model-training, RAG framework or numerical outcome is added. altfins is supporting automation/data-pipeline experience.

Sources: localmem README and MCP/retrieval implementation; gdrive-cli README (service-account scope, query filtering, structured responses, timeout/retry rules); cc-notify-telegram README (hook integration, session tags, allowlisting and local fallback); existing confirmed project usage and altfins implementation details.

Fresh seed content applies the shared project copy after loading the original baseline. After merge, run `pnpm db:deploy` to update existing English project fields and AI CV summary/skills, plus the original English/Vietnamese localmem fields. Each field is changed only if it still matches the previous default. Custom fields are preserved independently, so review any intentionally customized content in the admin if it still uses older wording.

Validation: AI PDF sample remains two pages, visually inspected after rendering; full tests cover both PDF variants, Markdown, active CV navigation, source references and the new keyword/context assertions. Migration executed in local PGlite/PostgreSQL: result matches fresh seed content, custom fields and missing projects remain intact, null publications and unrelated locales are untouched, repeat execution does not update revisions.
