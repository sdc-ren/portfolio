CREATE TABLE "AdminUser" ("id" UUID PRIMARY KEY, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "Content" (
 "locale" TEXT PRIMARY KEY, "draft" JSONB NOT NULL, "published" JSONB,
 "revision" INTEGER NOT NULL DEFAULT 0, "publishedAt" TIMESTAMP(3), "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Prisma connects from the trusted server. Supabase Data API gets no direct access.
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Content" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON "AdminUser", "Content" FROM anon, authenticated;
