# Experience and AI tooling copy update

Updates the original English experience bullets, profile/CV summaries, and gdrive-cli / cc-notify-telegram descriptions. Existing experience IDs, role dates, CV selections, project links and images remain unchanged.

Run `pnpm db:deploy` with the existing migration connection before checking the published CV. The data migration updates both draft and published English snapshots only where each field exactly matches the previous seed copy. Custom edits and other languages are retained. If an edited field is skipped, review and copy the new wording from `src/data/initial-content.json` through the admin, then save and publish.

AI hooks and workflow automation are described as recent independent work, not employment at DGWAsian. No numerical outcomes or multi-agent architecture claims are added.

Validation: seed JSON and reference integrity checked; migration update logic checked against old/custom/reordered/missing records in memory. Database execution and CV pagination require verification in an environment with the configured Supabase database. The expanded experience may increase CV page count.
