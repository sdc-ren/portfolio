-- Upgrade every locale and both snapshots without overwriting configured links/images.
-- Keep legacy reads supported in application code while this migration is rolling out.
DO $migration$
DECLARE
 entry RECORD;
 snapshot TEXT;
 document JSONB;
 project JSONB;
 projects JSONB;
 links JSONB;
 next_draft JSONB;
 next_published JSONB;
 defaults JSONB;
BEGIN
 FOR entry IN SELECT * FROM "Content" FOR UPDATE LOOP
  next_draft := entry."draft";
  next_published := entry."published";
  defaults := CASE WHEN entry."locale" LIKE 'vi%' THEN
   '{"visitWebsite":"Xem website","installExtension":"Cài tiện ích","downloadAppStore":"Tải trên App Store","downloadGooglePlay":"Tải trên Google Play","joinBeta":"Tham gia thử nghiệm","projectGallery":"Hình ảnh dự án","viewImage":"Xem ảnh","previousImage":"Ảnh trước","nextImage":"Ảnh tiếp theo","imageUnavailable":"Không tải được ảnh"}'::jsonb
   ELSE '{"visitWebsite":"Visit website","installExtension":"Install extension","downloadAppStore":"Download on App Store","downloadGooglePlay":"Get it on Google Play","joinBeta":"Join beta","projectGallery":"Project screenshots","viewImage":"View image","previousImage":"Previous image","nextImage":"Next image","imageUnavailable":"Image unavailable"}'::jsonb END;
  FOREACH snapshot IN ARRAY ARRAY['draft', 'published'] LOOP
   document := CASE WHEN snapshot = 'draft' THEN next_draft ELSE next_published END;
   IF document IS NULL OR document = 'null'::jsonb THEN CONTINUE; END IF;
   projects := '[]'::jsonb;
   FOR project IN SELECT value FROM jsonb_array_elements(document->'projects') LOOP
    IF NOT (project ? 'links') THEN
     links := '[]'::jsonb;
     IF COALESCE(project->>'repository','') <> '' THEN
      links := links || jsonb_build_array(jsonb_build_object('id','source','type','github','url',project->>'repository','label','','showInCv',true));
     END IF;
     IF COALESCE(project->>'demo','') <> '' THEN
      links := links || jsonb_build_array(jsonb_build_object('id','website','type','website','url',project->>'demo','label','','showInCv',false));
     ELSIF project->>'id' = 'personal-finance-management' THEN
      links := links || '[{"id":"website","type":"website","url":"https://personal-finance-dusky-five.vercel.app/","label":"","showInCv":false}]'::jsonb;
     END IF;
     project := project || jsonb_build_object('links',links);
    END IF;
    -- Keep legacy keys during rollout so the previous deployment can still read
    -- migrated snapshots. The new schema returns only canonical links on save.
    IF NOT (project ? 'images') THEN project := project || '{"images":[]}'::jsonb; END IF;
    IF NOT (project ? 'coverImageId') THEN project := project || '{"coverImageId":""}'::jsonb; END IF;
    projects := projects || jsonb_build_array(project);
   END LOOP;
   document := jsonb_set(document, '{projects}', projects);
   document := jsonb_set(document, '{ui}', defaults || COALESCE(document->'ui','{}'::jsonb));
   IF snapshot = 'draft' THEN next_draft := document; ELSE next_published := document; END IF;
  END LOOP;
  IF next_draft IS DISTINCT FROM entry."draft" OR next_published IS DISTINCT FROM entry."published" THEN
   UPDATE "Content" SET "draft"=next_draft, "published"=next_published,
    "revision"="revision"+1, "updatedAt"=CURRENT_TIMESTAMP,
    "publishedAt"=CASE WHEN next_published IS DISTINCT FROM entry."published" THEN CURRENT_TIMESTAMP ELSE "publishedAt" END
   WHERE "locale"=entry."locale";
  END IF;
 END LOOP;
END $migration$;
