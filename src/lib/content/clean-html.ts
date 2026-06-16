import * as cheerio from "cheerio";

const TYPO_FIXES: Record<string, string> = {
  Theort: "Theory",
  Peoduction: "Production",
  "Business Cucle": "Business Cycle",
  Manegerial: "Managerial",
  Elaticity: "Elasticity",
  difinitions: "definitions",
  "Introduction Business Economics": "Introduction to Business Economics",
  "Init IV": "Unit IV",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

export function fixTypos(text: string): string {
  let result = text;
  for (const [wrong, right] of Object.entries(TYPO_FIXES)) {
    result = result.replace(new RegExp(wrong, "gi"), right);
  }
  return result;
}

export function extractTitle(html: string, fallback: string): string {
  const $ = cheerio.load(html);
  const h1 = $("h1").first().text().trim();
  const h2 = $("h2").first().text().trim();
  const title = h1 || h2 || fallback;
  return fixTypos(title.replace(/\.$/, ""));
}

export function cleanHtml(rawHtml: string): string {
  const $ = cheerio.load(rawHtml);

  $("script, style, link, meta, head, button, noscript, iframe").remove();

  // Unwrap onclick buttons — keep their label as a note
  $("button").each((_, el) => {
    const text = $(el).text().trim();
    if (text) {
      $(el).replaceWith(`<div class="content-callout content-callout-tip"><strong>${text}</strong></div>`);
    } else {
      $(el).remove();
    }
  });

  // Normalize headings — demote h2 to h3 if it's the only top heading (page title handled separately)
  $("h1").each((_, el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "h1") {
      const $el = $(el);
      $el.replaceWith(`<h2>${fixTypos($el.text())}</h2>`);
    }
  });

  $("h2, h3, h4, h5, h6, p, li, td, th, span, div, ol, ul, table, blockquote, em, strong, i, b").each(
    (_, el) => {
      const $el = $(el);
      $el.removeAttr("style");
      $el.removeAttr("class");
      $el.removeAttr("id");
      $el.removeAttr("onclick");
      if ($el.text()) {
        const fixed = fixTypos($el.html() || "");
        if ($el.children().length === 0 || ["p", "li", "td", "th", "h2", "h3", "h4"].includes(el.tagName.toLowerCase())) {
          $el.html(fixed);
        }
      }
    }
  );

  // Wrap tables for responsive scroll
  $("table").each((_, el) => {
    const $table = $(el);
    $table.addClass("content-table");
    $table.wrap('<div class="content-table-wrapper"></div>');
  });

  // Style blockquotes as callouts
  $("blockquote").each((_, el) => {
    const $el = $(el);
    $el.addClass("content-callout content-callout-note");
  });

  let body = $("body").html() || $.root().html() || "";

  // If no body tag, use full content minus doctype
  if (!body || body.length < 50) {
    body = $.html();
    body = body.replace(/<\/?html[^>]*>/gi, "").replace(/<\/?body[^>]*>/gi, "");
  }

  // Remove empty paragraphs
  body = body.replace(/<p>\s*<\/p>/gi, "");

  return body.trim();
}

export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  const $ = cheerio.load(html);
  const headings: { id: string; text: string; level: number }[] = [];

  $("h2, h3, h4").each((_, el) => {
    const text = $(el).text().trim();
    if (!text) return;
    const level = parseInt(el.tagName.charAt(1), 10);
    const id = slugify(text);
    $(el).attr("id", id);
    headings.push({ id, text: fixTypos(text), level });
  });

  return headings;
}

export function addHeadingIds(html: string): string {
  const $ = cheerio.load(html);
  $("h2, h3, h4").each((_, el) => {
    const text = $(el).text().trim();
    if (text) $(el).attr("id", slugify(text));
  });
  return $.html();
}

export function getWordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}
