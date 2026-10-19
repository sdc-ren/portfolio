# Dang Chi Son — Portfolio CMS

Next.js App Router + TypeScript strict + Prisma 7 + Supabase PostgreSQL/Auth + shadcn-style Radix components + Tailwind 4 + SCSS Modules. Deploy on **Vercel using the native Next.js preset**. No Sites/Vinext runtime required.

## Local setup

Node 22.12+ and npm. `npm ci`, copy `.env.example` to `.env.local`, fill credentials, then:

```sh
npm run db:deploy
npm run db:seed
npm run dev
```

The seed imports the two supplied English CVs into shared project/experience/skill content and two independently ordered CV variants. It never overwrites an existing English document. No factual claims are generated beyond the supplied CVs. Review the English proficiency and experience statements before publishing.

For a DB-free preview, set `DEMO_MODE=true` in `.env.local`. This is explicit read-only seed content, not an automatic fallback after database errors. Disable it in production. Public routes read published content, never drafts.

## Supabase and admin setup

1. Enable email/password in Supabase Auth. Disable public signups for this single-owner CMS.
2. Create an administrator in Supabase Dashboard → Authentication → Users. Copy its UUID.
3. After migrations, grant the UUID from your trusted local terminal:

```sh
npm run admin:grant -- --user-id AUTH_USER_UUID
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

1. Import `sdc-ren/portfolio` into Vercel; framework Next.js, root directory repository root, Node.js 22.x, install `npm ci`, build `npm run build`.
2. Configure production env variables from `.env.example`. Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS domain and `DEMO_MODE=false`. Avoid sharing the production DB with preview deployments; use a separate Supabase project/branch for previews.
3. Apply `npm run db:deploy` and `npm run db:seed` from a trusted local terminal with the target environment configured **before the first deployment**. Database migrations intentionally do not run during Vercel builds, which can run concurrently.
4. Provision the Auth admin UUID as above.
5. Deploy. Verify `/en`, project details, both CV pages, PDF download, admin sign-in, draft isolation and publishing.
6. Set Supabase Auth Site URL to your production domain. Password sign-in here does not need an OAuth callback. If you later add magic links/OAuth, implement a code exchange route and allow only explicit redirect URLs. The initial version has no reset-password UI; recovery can be handled through the Supabase dashboard.

Build does not need a live DB: public pages are dynamically rendered. Runtime requests need working DB/Auth configuration. Updating env variables requires redeployment. Vercel deployment itself is not performed by this repository.

## Editing and publishing

`/admin`: edit profile, technology and role catalogs, skill groups, experience, projects, education, spoken languages, CV variants and site metadata. Add/remove/reorder records. Stable IDs drive project URLs and CV selections; the CV editor provides checkboxes and ordering controls. Referential validation rejects deleting an item still used by a CV. Markdown is rendered without raw HTML execution.

Save draft keeps public content unchanged; Preview draft shows a CV from current edits. Publish atomically saves and promotes the full locale document. Revision-based optimistic concurrency rejects stale tabs. Language creation copies a draft; translate it before publishing. Public navigation, buttons, page headings and CV/PDF section labels are editable in the `ui` section of each locale. New Vietnamese drafts receive Vietnamese UI labels; profile/project prose is copied and must be translated by the editor. Admin controls remain English. Default URL is `/en` and English is the initial seeded language. There is no automatic machine translation.

The shared document model is deliberate for a single-owner portfolio: all related content publishes atomically. If this grows into multi-user editing or a large content catalog, migrate collections to normalized tables and introduce editorial roles rather than extending the JSON document indefinitely.

## PDF

`/api/cv/[locale]/[variant]` generates an actual downloadable PDF from current published data using React PDF, in the Node.js runtime. Bundled DejaVu fonts support Vietnamese; Vercel output tracing includes them. No headless Chromium or external font request is required. Web CV has separate SCSS print styles. PDF and web share data and order, not identical pagination. PDF section labels use the locale’s managed `ui` content.

## Verification

```sh
npm run typecheck
npm test
npm run build
```

CI runs all three. The setup checker validates environment structure without printing credentials; use `npm run setup:check -- --database` for an explicit live connection/schema/admin check. Production database, Auth, RLS behavior and concurrent edits must also be exercised against a configured Supabase project before considering deployment verified. The initial implementation intentionally omits multi-user roles, a page builder, arbitrary HTML, media uploads and public contact forms. Add media storage only when real project screenshots are available.

## First deployment, step by step

On Vercel's New Project screen: repository `sdc-ren/portfolio`, branch `main`, preset **Next.js**, root `./`, project name `sondc-portfolio` (or your preferred name).

To preview the public design immediately, add only `DEMO_MODE=true` and deploy. The portfolio and dynamically generated CV PDFs will use the imported English content. This does not enable admin access or write to Supabase.

For the live CMS, add all environment variables from `.env.example`, switch `DEMO_MODE=false`, and from a local checkout with the same database configured run:

```sh
npm ci
npm run setup:check
npm run db:setup
npm run admin:grant -- --user-id AUTH_USER_UUID
npm run setup:check -- --database
```

Create the email/password account in Supabase Auth first, then use its UUID in the grant command. The grant command is idempotent. Never place the UUID of an untrusted account in the allowlist. Both CLI scripts only print configuration names or generic status, never passwords or database URLs.

Then redeploy Vercel. Every subsequent push to `main` uses Vercel's normal Git integration when enabled. No manual PR merge is required for subsequent direct commits. Preview databases and production databases should remain separate.
