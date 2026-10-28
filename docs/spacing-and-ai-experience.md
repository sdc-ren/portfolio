# Dialog/section spacing and AI Experience alignment

Project focus badges use fit-content width and flex-start alignment to prevent a column flex header stretching them across the dialog. The project dialog header uses a real 5px gap and resets child margins. Projects, Experience and Technical Skills share a SectionHeading component with a 5px subtitle/title gap, avoiding the global paragraph margin reset overriding Tailwind margin utilities.

The AI CV now starts with the same professional experience references as the Senior CV; it retains its own summary, skills, projects and projects-first order. The new migration performs a one-time copy of Senior experienceIds/experienceSelections into the AI CV for each English/Vietnamese snapshot independently. It copies references only, does not rewrite career facts, leaves other CV fields untouched and is idempotent. Admins can still adjust each view later.

Run `pnpm db:deploy` after merge to apply the Experience correction to existing CMS snapshots. Fresh seed selections are aligned as well.

Validation: 58 tests and TypeScript pass. Chromium layout measurements confirm badge width ~125px in a 712px header, a 5px badge/category gap and a 5px section subtitle/title gap. AI PDF remains two A4 pages with full Senior-equivalent Experience, visually inspected on both pages. Migration executed locally with prior migrations and custom snapshots; seed equivalence and preservation checks pass. Production CMS data was not modified.
