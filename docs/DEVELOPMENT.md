# Development and deployment

Next.js App Router + TypeScript strict + Prisma 7 + Supabase PostgreSQL/Auth + shadcn-style Radix components + Tailwind 4 + SCSS Modules. Deploy on **Vercel using the native Next.js preset**.

## Local setup

Node 22.12+ and pnpm 10.34.7. Enable Corepack with `corepack enable`, then run `pnpm install --frozen-lockfile`, copy `.env.example` to `.env.local`, fill credentials, then:

```sh
pnpm db:deploy
pnpm db:seed
pnpm dev
```

The seed imports the two supplied English CVs into shared project/experience/skill content and two independently ordered CV variants. It never overwrites an existing English document. No factual claims are generated beyond the supplied CVs. Review the English proficiency and experience statements before publishing.

Public routes always read published content from PostgreSQL, never drafts or a bundled-data fallback. The imported CV content is used only by the seed command and tests.

## Supabase and admin setup

1. Enable email/password in Supabase Auth. Disable public signups for this single-owner CMS.
2. Create an administrator in Supabase Dashboard → Authentication → Users. Copy its UUID.
3. After migrations, grant the UUID from your trusted local terminal:

```sh
pnpm admin:grant --user-id AUTH_USER_UUID
```

This verifies that the user exists in Supabase Auth before granting access. Alternatively, run in the SQL editor, replacing the placeholder:

```sql
INSERT INTO "AdminUser" ("id") VALUES ('AUTH_USER_UUID');
```

4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (the browser-safe publishable key, not a service-role key).
5. Visit `/admin/login` with that account's email/password. There is no default password or public registration page.

Every admin page and mutation calls verified `auth.getUser()` and checks the UUID allowlist in Postgres. Supabase cookie sessions are refreshed by Next.js proxy. RLS is enabled and anon/authenticated API access to CMS tables is revoked. Prisma's trusted server connection can bypass RLS; authorization checks are therefore mandatory. Do not expose Prisma through an unguarded API or import it into client components.

## Database connections

`DATABASE_URL` uses the shared transaction pooler on port 6543. `DIRECT_URL` uses the session pooler on port 5432 for migrations and seed. URL-encode the password (`/` → `%2F`); use TLS per your Supabase connection guidance. Prisma 7 config points CLI operations at DIRECT_URL, while PrismaPg uses DATABASE_URL at runtime. The pg driver pool is capped at 3 connections per instance. Never use `NEXT_PUBLIC_` for database credentials; no Supabase service-role key is required.

## Deploy to Vercel

1. Import `sdc-ren/portfolio` into Vercel; framework Next.js, root directory repository root, Node.js 22.x, install `pnpm install --frozen-lockfile`, build `pnpm build`.
2. Configure production env variables from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS domain. Avoid sharing the production DB with preview deployments; use a separate Supabase project/branch for previews.
3. Apply `pnpm db:deploy` and `pnpm db:seed` from a trusted local terminal with the target environment configured **before the first deployment**. Database migrations intentionally do not run during Vercel builds, which can run concurrently.
4. Provision the Auth admin UUID as above.
5. Deploy. Verify `/`, project details, both CV pages, PDF download, admin sign-in, draft isolation and publishing.
6. Set Supabase Auth Site URL to your production domain. Password sign-in here does not need an OAuth callback. If you later add magic links/OAuth, implement a code exchange route and allow only explicit redirect URLs. The initial version has no reset-password UI; recovery can be handled through the Supabase dashboard.

Build does not need a live DB: public pages are dynamically rendered. Runtime requests need working DB/Auth configuration. Updating env variables requires redeployment. Vercel deployment itself is not performed by this repository.

## Public URLs and appearance

English uses clean URLs: `/`, `/projects`, `/projects/[slug]`, and `/cv/[variant]`. Old `/en` URLs permanently redirect to their clean equivalents. Other languages remain prefixed, such as `/vi/projects`. Default and localized routes reuse the same page implementations; links and the sitemap use the shared `publicPath` helper.

The default theme is light with a gray page background, white cards, and a 1440px maximum page container. The CV retains its separate document layout for printing. The SVG favicon is a font-independent SDC code monogram at `src/app/icon.svg`.

After updating an existing database, run `pnpm db:deploy` to apply the copy refinement migration. It updates only exact starter strings, preserves custom content and CV-specific summaries, and increments changed rows' revisions to invalidate stale editor sessions.

## Editing and publishing

`/admin`: edit profile, technology and role catalogs, skill groups, experience, projects, education, spoken languages, CV variants and site metadata. Add/remove/reorder records. Stable IDs drive project URLs and CV selections; the CV editor provides checkboxes and ordering controls. Referential validation rejects deleting an item still used by a CV. Markdown is rendered without raw HTML execution.

Save draft keeps public content unchanged; Preview draft shows a CV from current edits. Publish atomically saves and promotes the full locale document. Revision-based optimistic concurrency rejects stale tabs. Language creation copies a draft; translate it before publishing. Public navigation, buttons, page headings and CV/PDF section labels are editable in the `ui` section of each locale. New Vietnamese drafts receive Vietnamese UI labels; profile/project prose is copied and must be translated by the editor. Admin controls remain English. The default English URL is `/`; other languages retain their locale prefix and English is the initial seeded language. There is no automatic machine translation.

The shared document model is deliberate for a single-owner portfolio: all related content publishes atomically. If this grows into multi-user editing or a large content catalog, migrate collections to normalized tables and introduce editorial roles rather than extending the JSON document indefinitely.

## PDF

`/api/cv/[locale]/[variant]` generates an actual downloadable PDF from current published data using React PDF, in the Node.js runtime. Bundled DejaVu fonts support Vietnamese; Vercel output tracing includes them. No headless Chromium or external font request is required. Web CV has separate SCSS print styles. PDF and web share data and order, not identical pagination. PDF section labels use the locale’s managed `ui` content.

## Verification

```sh
pnpm typecheck
pnpm test
pnpm build
```

CI runs all three. The setup checker validates environment structure without printing credentials; use `pnpm setup:check --database` for an explicit live connection/schema/admin check. Production database, Auth, RLS behavior and concurrent edits must also be exercised against a configured Supabase project before considering deployment verified. The initial implementation intentionally omits multi-user roles, a page builder, arbitrary HTML, media uploads and public contact forms. Add media storage only when real project screenshots are available.

## First deployment, step by step

On Vercel's New Project screen: repository `sdc-ren/portfolio`, branch `main`, preset **Next.js**, root `./`, project name `sondc-portfolio` (or your preferred name).

Add all environment variables from `.env.example`, and from a local checkout with the same database configured run:

```sh
pnpm install --frozen-lockfile
pnpm setup:check
pnpm db:setup
pnpm admin:grant --user-id AUTH_USER_UUID
pnpm setup:check --database
```

Create the email/password account in Supabase Auth first, then use its UUID in the grant command. The grant command is idempotent. Never place the UUID of an untrusted account in the allowlist. Both CLI scripts only print configuration names or generic status, never passwords or database URLs.

Then redeploy Vercel. Every subsequent push to `main` uses Vercel's normal Git integration when enabled. No manual PR merge is required for subsequent direct commits. Preview databases and production databases should remain separate.

## Package manager

The project uses pnpm, pinned via `packageManager` in `package.json`. Commit `pnpm-lock.yaml`; do not generate npm or Yarn lockfiles. `pnpm-workspace.yaml` explicitly permits install scripts for Prisma engines, esbuild, sharp and the Sass watcher. The root postinstall generates Prisma Client and prepares the PDF fonts.

For an existing checkout that previously used npm, remove the old `node_modules` directory once, then run:

```sh
corepack enable
pnpm install --frozen-lockfile
```

On Vercel, clear any old Install Command override containing `npm ci`. Use automatic package-manager detection from `pnpm-lock.yaml`; set Build Command to `pnpm build` (or leave automatic). To use the exact pinned pnpm patch, enable Corepack in Vercel with `ENABLE_EXPERIMENTAL_COREPACK=1`. Then redeploy.
