# Project focus labels and speech AI

Projects may have one explicit `focus` classification. The schema defaults legacy records to no badge; names and technology lists never imply an AI classification. Admins can choose or clear the badge in the project editor. Cards, dialogs and direct detail pages share the badge component. Badges use icons plus readable text and wrap on small screens.

Default classifications:

- localmem: AI Agent Memory
- gdrive-cli: AI Agent Tooling
- cc-notify-telegram: AI Workflow
- altfins: Workflow Automation (not presented as an AI model product)
- ivr-studio: Speech AI

ivr-studio content is grounded in its README, `server/engines/clone.mjs` and `server/worker.mjs`. It describes pretrained F5-TTS/edge-tts integration, a resident Python inference worker, text preparation, FFmpeg audio processing and optional Whisper verification with bounded retries. No training/fine-tuning, commercial deployment, production scale or guaranteed speech accuracy is claimed. Project details identify it as a local prototype and record the selected checkpoint's non-commercial restriction and reference-voice rights requirement. Reference recordings are not copied into the portfolio.

The default AI CV replaces altfins with ivr-studio and adds speech/model-integration skills. It retains four selected projects and two-page sample pagination. The Software Engineer CV selection is untouched. Card summaries explain purpose; detail descriptions explain implementation/limits; CV bullets emphasize demonstrated engineering work.

After merging, run `pnpm db:deploy`. Migrations apply in order: AI CV additions, guarded project-copy revision, then project labels/speech AI. Existing project labels (including deliberately blank labels), customized descriptions and customized AI CV selections are preserved. ivr-studio and its skill group are inserted only if their IDs are absent. English/Vietnamese draft and published snapshots are handled independently; null publication and other locales remain unchanged. Newly seeded English content matches the migrated default.

Validation: schema/default/classification tests; rendered card labels and omission for ordinary projects; both CV PDF exports and Markdown; AI sample PDF rendered and visually inspected on both pages. Card previews inspected at desktop and 375px in light/dark, with no horizontal mobile overflow. This preview uses real rendered card components and module styles, not a signed-in production session. Production build/TypeScript pass. Local PGlite/PostgreSQL migration tests cover seed equivalence, custom labels/copy/CV selections, null publication, unrelated locales and repeat execution.
