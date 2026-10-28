# AI CV and localmem

The CV page lists the CMS CV documents as navigation links. Each link has its own public route, metadata, preview and PDF/Markdown downloads. The existing Software Engineer route remains the default; the new AI CV is `/cv/ai-engineer` (Vietnamese: `/vi/cv/ai-engineer`). The switch is hidden when printing.

The AI CV focuses on agent tooling and workflow automation, with localmem, gdrive-cli, cc-notify-telegram and altfins selected in that order. It does not claim ML training or employment as an AI Engineer. localmem's description is based on the repository README and Python implementation: local SQLite/FTS5 retrieval, entity-based ranking, CLI/stdio MCP, deduplication and retrieval evaluation. No claim of zero total token usage or embedding-based semantic retrieval is made.

After merge/deployment, run `pnpm db:deploy`. The additive migration inserts localmem, AI skill groups and the AI CV in existing English and Vietnamese draft/published snapshots. Existing records with matching IDs, customized Software Engineer content, CV ordering and unpublished snapshots are preserved. CV references are filtered against each snapshot's available records. Other locales are unchanged. Review/publish translated content in the admin as usual.

New English installations receive the same additions through `initialContent()` in the seed script. The original baseline JSON is kept intact; existing databases are updated by migration rather than reseeding. Shared contact information, education and experience continue to come from the CMS.

Validation includes seed/schema references, server rendering of variant navigation and downloads in English/Vietnamese, real PDF generation for both variants, Markdown endpoint output, and migration execution in local PGlite/PostgreSQL. Migration scenarios cover custom content, missing references, null publication, unrelated locales and repeat execution.
