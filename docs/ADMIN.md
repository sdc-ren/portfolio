# Portfolio administration

The authenticated `/admin` workspace adapts the official shadcn/ui `dashboard-01` layout: collapsible Sidebar, header, overview Cards and full-width content. It uses portfolio counts instead of the template's sample revenue charts and table. Projects, experience, skill groups, education, spoken languages and CVs share a card library and right-side Sheet editor.

## Editing and publishing

1. Choose a content language in the header. Each language keeps its own draft and published snapshot.
2. Open a card or add a record. Changes inside the Sheet are isolated from the workspace until **Apply changes**. Cancel/close asks before discarding edits; clicking the backdrop does not dismiss the editor.
3. Apply validates the record, collection limits and CV references. Existing IDs are locked to preserve public URLs and references. Deleting a referenced record is blocked until it is removed from the relevant CV selections. The last CV cannot be deleted.
4. **Save draft** stores all workspace changes without changing the public website. **Publish** stores and publishes the current language. Both use the existing authenticated server actions and optimistic revision check.
5. Preview CV renders the current workspace, including applied changes. It does not publish them.

Technologies, role catalogs, project technologies and skill items use searchable checkbox chips. Role fields use single-select chips. Existing values are preserved, suggestions can be selected without typing, and custom values can be added with the Add button or Enter. Project-specific custom technologies do not silently change the shared technology catalog.

Search and featured filters affect only the visible cards. Reorder buttons always move records in the complete collection; the displayed card order follows the website's data order. A new translation copies the saved source draft and starts unpublished. Save the workspace before creating one.

Sidebar state is stored using the standard shadcn sidebar cookie. The content area has no max-width; only the editing Sheet and document preview have their own presentation widths. On small screens, navigation uses the Sidebar's mobile Sheet.

## Component provenance

Imported from the official shadcn new-york-v4 registry and adapted to the repository's existing Radix packages, `cn`, tooltip-aware Button and Lucide icons:

- Dashboard reference: https://ui.shadcn.com/r/styles/new-york-v4/dashboard-01.json
- Sidebar: https://ui.shadcn.com/r/styles/new-york-v4/sidebar.json
- Sheet: https://ui.shadcn.com/r/styles/new-york-v4/sheet.json
- Card, Badge, Separator, Skeleton and use-mobile: corresponding items in the same registry.

The dashboard's demo data, charts, table and drag-and-drop dependencies are intentionally not installed. Administration styling is in `src/features/admin/studio.module.scss`; shared component tokens are mapped in `globals.css`. Public content, the database schema and authorization rules are unchanged. No database migration is required.
