-- Add the requested project without replacing curated records or CV selections.
DO $migration$
DECLARE
 entry RECORD;
 snapshot TEXT;
 document JSONB;
 next_draft JSONB;
 next_published JSONB;
 project JSONB;
 technologies JSONB;
 technology JSONB;
 payload JSONB := $project$
{
  "en": {
    "id": "altfins",
    "title": "altfins: Crypto Monitoring & Telegram Alerts",
    "role": "Creator / Maintainer",
    "category": "Automation & data pipelines",
    "summary": "Runs 24/7 to collect cryptocurrency analysis from altFINS, store structured data in Supabase, and deliver updates through Telegram.",
    "description": "A Python automation service for monitoring cryptocurrency analysis without manually revisiting multiple altFINS pages. The service operates around the clock and sends source-specific updates to Telegram. Its pipeline separates browser automation, typed data models, persistence, and notification delivery so each part can be maintained independently.",
    "tech": [
      "Python",
      "Playwright",
      "Pydantic",
      "Supabase",
      "PostgreSQL",
      "Telegram Bot API",
      "GitHub Actions"
    ],
    "highlights": [
      "Built a Playwright pipeline for Technical Analysis, Chart Patterns, and Market Highlights, with Pydantic models to normalize extracted records.",
      "Persisted market indicators in Supabase and synchronized browser session state to reuse authenticated sessions across automated runs.",
      "Added same-source and cross-source deduplication, database retries, and source-specific Telegram notifications.",
      "Automated execution through GitHub Actions and an external scheduler; operated the service 24/7 for ongoing cryptocurrency updates."
    ],
    "repository": "https://github.com/sdc-ren/altfins",
    "demo": "",
    "featured": true
  },
  "vi": {
    "id": "altfins",
    "title": "altfins: Theo dõi coin và cập nhật qua Telegram",
    "role": "Tác giả / Người duy trì",
    "category": "Tự động hóa & xử lý dữ liệu",
    "summary": "Hoạt động 24/24 để thu thập phân tích tiền điện tử từ altFINS, lưu dữ liệu có cấu trúc vào Supabase và gửi cập nhật qua Telegram.",
    "description": "Dịch vụ tự động hóa bằng Python giúp theo dõi phân tích tiền điện tử mà không cần mở thủ công nhiều trang altFINS. Hệ thống hoạt động xuyên suốt và gửi cập nhật qua Telegram theo từng nguồn dữ liệu. Pipeline tách riêng phần điều khiển trình duyệt, mô hình dữ liệu, lưu trữ và gửi thông báo để dễ bảo trì.",
    "tech": [
      "Python",
      "Playwright",
      "Pydantic",
      "Supabase",
      "PostgreSQL",
      "Telegram Bot API",
      "GitHub Actions"
    ],
    "highlights": [
      "Xây dựng pipeline Playwright thu thập Technical Analysis, Chart Patterns và Market Highlights; chuẩn hóa dữ liệu bằng mô hình Pydantic.",
      "Lưu các chỉ báo thị trường vào Supabase và đồng bộ trạng thái phiên trình duyệt để tái sử dụng đăng nhập giữa các lượt chạy.",
      "Bổ sung kiểm tra trùng dữ liệu trong cùng nguồn và giữa các nguồn, retry khi truy cập DB và gửi thông báo Telegram theo nguồn dữ liệu.",
      "Tự động chạy qua GitHub Actions kết hợp bộ lập lịch bên ngoài; vận hành 24/24 để cung cấp cập nhật về coin."
    ],
    "repository": "https://github.com/sdc-ren/altfins",
    "demo": "",
    "featured": true
  }
}
$project$::jsonb;
BEGIN
 FOR entry IN SELECT * FROM "Content" WHERE "locale" IN ('en','vi') FOR UPDATE LOOP
  next_draft := entry."draft";
  next_published := entry."published";
  project := payload->entry."locale";
  FOREACH snapshot IN ARRAY ARRAY['draft','published'] LOOP
   document := CASE WHEN snapshot='draft' THEN next_draft ELSE next_published END;
   IF document IS NULL OR document='null'::jsonb THEN CONTINUE; END IF;
   -- Existing project data wins, including any edits made before migration.
   IF EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(document->'projects','[]'::jsonb)) item WHERE item->>'id'='altfins' OR item->>'repository'='https://github.com/sdc-ren/altfins') THEN CONTINUE; END IF;
   document := jsonb_set(document,'{projects}',COALESCE(document->'projects','[]'::jsonb) || jsonb_build_array(project),true);
   technologies := COALESCE(document->'technologies','[]'::jsonb);
   FOR technology IN SELECT value FROM jsonb_array_elements(project->'tech') LOOP
    IF NOT technologies @> jsonb_build_array(technology) THEN
     technologies := technologies || jsonb_build_array(technology);
    END IF;
   END LOOP;
   document := jsonb_set(document,'{technologies}',technologies,true);
   IF snapshot='draft' THEN next_draft:=document; ELSE next_published:=document; END IF;
  END LOOP;
  IF next_draft IS DISTINCT FROM entry."draft" OR next_published IS DISTINCT FROM entry."published" THEN
   UPDATE "Content" SET "draft"=next_draft,"published"=next_published,
    "revision"="revision"+1,"updatedAt"=CURRENT_TIMESTAMP,
    "publishedAt"=CASE WHEN next_published IS DISTINCT FROM entry."published" THEN CURRENT_TIMESTAMP ELSE entry."publishedAt" END
   WHERE "locale"=entry."locale";
  END IF;
 END LOOP;
END $migration$;
