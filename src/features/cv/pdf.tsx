import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PortfolioContent } from "@/features/content/schema";
import { cvMarkup, escapeHtml } from "./markup";

chromium.setGraphicsMode = false;

let printStyles: Promise<string> | undefined;
function embeddedStyles() {
  return (printStyles ??= (async () => {
    let css = await readFile(
      path.join(process.cwd(), "public/cv-template.css"),
      "utf8",
    );
    const files = [...css.matchAll(/url\(["']?\/fonts\/([^"')]+)["']?\)/g)];
    for (const match of files) {
      const bytes = await readFile(
        path.join(process.cwd(), "public/fonts", match[1]),
      );
      const mime = match[1].endsWith(".otf") ? "font/otf" : "font/ttf";
      css = css.replace(
        match[0],
        `url(data:${mime};base64,${bytes.toString("base64")})`,
      );
    }
    return css;
  })());
}

export async function createCvPdf(
  data: PortfolioContent,
  variant: string,
  locale: string,
) {
  const cv = data.cvs.find((item) => item.id === variant);
  if (!cv) throw new Error("CV not found");
  const html = `<!doctype html><html lang="${escapeHtml(locale)}"><head><meta charset="utf-8"><title>${escapeHtml(data.profile.name)} | ${escapeHtml(cv.title)}</title><style>${await embeddedStyles()} body{margin:0;background:#fff}</style></head><body><main class="cv-sheet">${cvMarkup(data, variant)}</main></body></html>`;
  const browser = await puppeteer.launch({
    args: await puppeteer.defaultArgs({
      args: chromium.args,
      headless: "shell",
    }),
    executablePath:
      process.env.CHROMIUM_EXECUTABLE_PATH || (await chromium.executablePath()),
    headless: "shell",
    pipe: true,
    timeout: 20000,
  });
  try {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.url().startsWith("data:")) void request.continue();
      else void request.abort();
    });
    await page.setViewport({ width: 1280, height: 960 });
    await page.setContent(html, { waitUntil: "load", timeout: 15000 });
    await page.emulateMediaType("print");
    const bytes = await page.pdf({
      format: "A4",
      preferCSSPageSize: true,
      printBackground: true,
      displayHeaderFooter: false,
      timeout: 20000,
    });
    return Buffer.from(bytes);
  } finally {
    await browser.close();
  }
}
