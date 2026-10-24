# CV readability and PDF checks

The print stylesheet disables standard/contextual ligatures, removes the forced page break before Selected Projects and lets long entries flow between pages. Entry titles, metadata and individual bullets are kept together where possible. Body print size remains 12px; no content is clipped to force a page count.

The revised original English content produces two A4 pages with the bundled Nimbus/DejaVu fonts. Custom CMS content and additional selections can require more pages. Project dates and education qualifications remain unchanged pending confirmation.

Content changes:

- Three-sentence summaries and Vue/Nuxt/TypeScript shown as Core Frontend.
- React/Next.js/Angular retained as Additional Frontend, without downgrading claimed proficiency.
- Shorter experience and project bullets; candidate interviews stay with team leadership, Firebase/Analytics move to skills.
- English proficiency describes technical reading and basic conversation.
- No invented metrics, dates, degrees or language skills.

Apply `pnpm db:deploy` after pulling the change. The migration updates matching original fields in both English draft/published snapshots, preserving edited fields and other locales. It adds the additional frontend skill by stable ID and updates only unchanged CV skill selections. Review customized/skipped fields through the admin if the published CV still differs from the seed.

Verification:

- Generated PDFs with the existing production renderer and exact bundled font bytes; baseline seed produced three pages, revised seed two.
- Visually inspected both revised pages after PNG rendering.
- Poppler extraction includes workflow, finance, verification and notifications, with no U+FB00-U+FB06 presentation ligatures.
- `tests/cv-pagination.test.ts` checks these properties when Poppler is installed, and skips explicitly otherwise.
- Migration executed in local PGlite/PostgreSQL with original, customized, reordered/missing records, null published data and other locales; second execution did not change revisions.
- Supabase production data was not modified.
