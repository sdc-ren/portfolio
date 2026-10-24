import { getPublished } from "@/features/content/repository";
import { localeSchema } from "@/features/content/schema";
import { cvMarkdown } from "@/features/cv/markdown";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; variant: string }> },
) {
  const { locale, variant } = await params;
  if (
    !localeSchema.safeParse(locale).success ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(variant)
  )
    return new Response("CV not found", { status: 404 });
  try {
    const data = await getPublished(locale);
    if (!data || !data.cvs.some((cv) => cv.id === variant))
      return new Response("CV not found", { status: 404 });
    return new Response(cvMarkdown(data, variant), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="dang-chi-son-${variant}-${locale}.md"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "CV Markdown generation failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return Response.json(
      { error: "Unable to generate Markdown" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
