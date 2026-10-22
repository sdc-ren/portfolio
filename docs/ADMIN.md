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

The dashboard's demo data, charts, table and drag-and-drop dependencies are intentionally not installed. Administration styling is in `src/features/admin/studio.module.scss`; shared component tokens are mapped in `globals.css`. The dashboard layout itself does not change database records. Project links and galleries require the migrations described below.

## Project links and screenshots

Each project has an ordered **Project links** list. Choose Website, Source code, Chrome Web Store, App Store, Google Play, TestFlight or Custom; set its URL and optionally override the button label. Custom links require a label. Toggle **Include in CV** for each link that should appear in the web CV and downloaded PDF. Links open in a new tab on project detail views. Existing repository URLs are imported with Include in CV enabled; existing demo URLs are imported with it disabled. Explicitly empty link lists stay empty.

The **Project gallery** accepts up to 20 JPEG, PNG, WebP or AVIF screenshots, each up to 3 MB and 40 megapixels. Prefer compressed WebP/AVIF screenshots to reduce downloads. Upload multiple files, review their required image descriptions, add optional captions, choose the opening image (Cover) and reorder images.

Public project cards stay text-only. An icon with a tooltip appears only when a project has images. Clicking it opens a full-viewport dark gallery with the selected cover image centered without cropping, previous/next buttons at the two side edges, and a fixed bottom thumbnail filmstrip. The header shows the project title, image count and close control. Captions stay above the filmstrip; arrow-key navigation keeps the selected thumbnail visible. The viewer uses dynamic viewport height and safe-area spacing on mobile. Clicking the card's main area opens the project description separately. The direct detail page and detail dialog show one horizontal row of 60×60 thumbnails instead of the gallery icon. The row scrolls horizontally without wrapping; clicking a thumbnail opens that specific image in the full-size viewer and closing it returns focus to the clicked thumbnail. Projects without images render neither a gallery icon nor a thumbnail row or reserved space. Card photos stay deferred until opening the gallery; detail thumbnails load lazily. Clicking the backdrop does not close the gallery; Escape or the close button does. Galleries do not autoplay. Titles and summaries are clamped in cards, while full content stays available in the detail dialog.

Screenshots are excluded from the CV markup and PDF renderer. Changing gallery content cannot alter PDF layout or introduce image downloads during PDF generation. Link labels and gallery control labels can be translated under UI labels.

### Deployment

Deploy the new application and run `pnpm db:deploy` against the same Supabase project. This applies:

- `202610220001_project_links_gallery`: upgrades draft/published snapshots in all languages, preserves existing selections and custom links/images, imports legacy URLs, and supplies the Personal Finance website if no links or demo were configured. It is safe to rerun the SQL; unchanged snapshots do not advance revisions.
- `202610220002_project_image_storage`: creates the public `project-images` bucket with a 3 MB file limit and a raster MIME allowlist. Adds an INSERT policy limited to authenticated `AdminUser` members uploading under their own UUID prefix. The private SQL helper checks the current JWT and does not expose admin table rows.

No extra environment variables or service-role key are required. The existing Supabase URL and publishable key are used. `createImageUpload` checks admin access before generating a signed upload token; the browser sends file bytes directly to Storage, avoiding Vercel request-body limits. Signing never permits upsert. The public bucket contains only shareable portfolio screenshots, including files referenced by drafts; draft/publish controls website visibility, not file secrecy.

Upload changes are isolated in the editing drawer until Apply. The drawer blocks closing/applying while an upload is in progress. A batch keeps successful uploads if a later file fails. Save draft or Publish persists the references through the existing revision check. A schema error (for example, an empty image description or invalid link) prevents applying the record.

Removing a screenshot detaches its reference; it does not delete the object. This avoids breaking the current published snapshot, copied languages or an open editor. Canceling a drawer may leave unused uploads. For storage cleanup, remove only objects unreferenced by **both draft and published snapshots across every locale**, after allowing open editing sessions to finish. This release does not automatically delete files or grant client DELETE/UPDATE policies.

Legacy fields remain in migration-updated snapshots during rollout; the new application reads them only when `links` is absent and writes canonical links on save. After publishing with the new schema, rolling back to an older application requires restoring compatible content snapshots as well. Keep normal database backups before production migration.

Storage references: [access control](https://supabase.com/docs/guides/storage/security/access-control), [signed upload URLs](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl), [upload to a signed URL](https://supabase.com/docs/reference/javascript/storage-from-uploadtosignedurl).
