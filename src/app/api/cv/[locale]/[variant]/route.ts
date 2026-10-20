import { getPublished } from "@/features/content/repository";
import { createCvPdf } from "@/features/cv/pdf";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; variant: string }> },
) {
  const { locale, variant } = await params;
  try {
    const data = await getPublished(locale);
    if (!data || !data.cvs.some((c) => c.id === variant))
      return new Response("CV not found", { status: 404 });
    const pdf = await createCvPdf(data, variant, locale);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="dang-chi-son-${variant}-${locale}.pdf"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "CV PDF generation failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return Response.json(
      { error: "Unable to generate PDF" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
