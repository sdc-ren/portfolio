-- Public portfolio screenshots. Storage enforces the same file limits as the UI.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('project-images', 'project-images', true, 3145728, ARRAY['image/jpeg','image/png','image/webp','image/avif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = EXCLUDED.file_size_limit,
 allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Do not expose the AdminUser table to the Data API. The helper only returns
-- whether the requesting JWT belongs to an admin; it accepts no user-supplied ID.
CREATE SCHEMA IF NOT EXISTS portfolio_private;
REVOKE ALL ON SCHEMA portfolio_private FROM PUBLIC;
GRANT USAGE ON SCHEMA portfolio_private TO authenticated;
CREATE OR REPLACE FUNCTION portfolio_private.can_upload_project_images()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
 SELECT EXISTS (SELECT 1 FROM public."AdminUser" WHERE id = (SELECT auth.uid()));
$function$;
REVOKE ALL ON FUNCTION portfolio_private.can_upload_project_images() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION portfolio_private.can_upload_project_images() TO authenticated;

DROP POLICY IF EXISTS "portfolio_admin_insert_project_images" ON storage.objects;
CREATE POLICY "portfolio_admin_insert_project_images" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
 bucket_id = 'project-images'
 AND (SELECT portfolio_private.can_upload_project_images())
 AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);
-- No update/delete policy: immutable object names preserve published snapshots.
-- Public bucket URLs can be read without granting object listing or DB access.
