import * as cheerio from "cheerio";
import { formatSyllabusHtml, isSyllabusContent } from "./format-syllabus";
import { formatStudyHtml } from "./format-study";

const TYPO_FIXES: Record<string, string> = {
  Theort: "Theory",
  Peoduction: "Production",
  "Business Cucle": "Business Cycle",
  Manegerial: "Managerial",
  Manaagerial: "Managerial",
  Approaach: "Approach",
  Elaticity: "Elasticity",
  difinitions: "definitions",
  "Introduction Business Economics": "Introduction to Business Economics",
  " can ve ": " can be ",
  "decision-makin.": "decision-making.",
  "decision-makin": "decision-making",
  "credit creation its process": "credit creation and its process",
  "demographic features and dividend": "demographic features and demographic dividend",
  "industrial pattern small scale enterprises": "industrial pattern of small scale enterprises",
  "use of the same in decision making": "use the same in decision-making",
  "use the same in decision-makin": "use the same in decision-making",
  "Indian agriculture and  major issues": "Indian agriculture and major issues",
  "public sector in Indian economy,  Indian agriculture": "public sector in Indian economy, Indian agriculture",
  "drawees acknowledgement": "drawee's acknowledgement",
  cardina: "cardinal",
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

export function cleanHtml(
  rawHtml: string,
  options?: { formatAsSyllabus?: boolean; semester?: number }
): string {
  const $ = cheerio.load(rawHtml);

  $("script, style, link, meta, head, button, noscript, iframe").remove();

  $("button").each((_, el) => {
    const text = $(el).text().trim();
    if (text) {
      $(el).replaceWith(`<div class="content-callout content-callout-tip"><strong>${text}</strong></div>`);
    } else {
      $(el).remove();
    }
  });

  $("h1").each((_, el) => {
    const $el = $(el);
    $el.replaceWith(`<h2>${fixTypos($el.text())}</h2>`);
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
        if (
          $el.children().length === 0 ||
          ["p", "li", "td", "th", "h2", "h3", "h4"].includes(el.tagName.toLowerCase())
        ) {
          $el.html(fixed);
        }
      }
    }
  );

  $("table").each((_, el) => {
    const $table = $(el);
    $table.addClass("content-table");
    $table.wrap('<div class="content-table-wrapper"></div>');
  });

  $("blockquote").each((_, el) => {
    $(el).addClass("content-callout content-callout-note");
  });

  let body = $("body").html() || $.root().html() || "";

  if (!body || body.length < 50) {
    body = $.html();
    body = body.replace(/<\/?html[^>]*>/gi, "").replace(/<\/?body[^>]*>/gi, "");
  }

  body = body.replace(/<p>\s*<\/p>/gi, "");

  if (options?.formatAsSyllabus || isSyllabusContent(body)) {
    body = formatSyllabusHtml(body, { semester: options?.semester });
  } else {
    body = formatStudyHtml(body);
  }

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
  const $ = cheerio.load(html, null, false);
  $("h2, h3, h4").each((_, el) => {
    const text = $(el).text().trim();
    if (text) $(el).attr("id", slugify(text));
  });
  return $.root().html()?.trim() || html;
}

export function getWordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}
