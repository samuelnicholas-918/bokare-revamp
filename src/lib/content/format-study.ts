import * as cheerio from "cheerio";
import { processLatexFigures } from "./render-latex-figures";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+(?:\s|$)/g)?.map((s) => s.trim()).filter(Boolean) || [text];
}

function groupSections($: cheerio.CheerioAPI) {
  const root = $(".study-doc");
  root.children("h3").each((_, h3) => {
    const $h3 = $(h3);
    if ($h3.parent().hasClass("study-section")) return;

    const $section = $('<section class="study-section"></section>');
    $h3.before($section);
    $section.append($h3);

    let $next = $section.next();
    while ($next.length && !$next.is("h2, h3")) {
      const $current = $next;
      $next = $current.next();
      $section.append($current);
    }
  });
}

function formatParagraphs($: cheerio.CheerioAPI) {
  $(".study-section > p, .study-doc > p").each((_, el) => {
    const $p = $(el);
    if ($p.hasClass("study-callout") || $p.hasClass("study-attribution")) return;

    const text = $p.text().replace(/\s+/g, " ").trim();
    const html = $p.html()?.trim() || "";
    if (!text) {
      $p.remove();
      return;
    }

    const attribution = text.match(/^(.+?)\s*\(-\s*([^)]+)\)\s*$/);
    if (attribution) {
      $p.replaceWith(`<figure class="study-attribution">
        <blockquote><p>${escapeHtml(attribution[1].trim())}</p></blockquote>
        <figcaption>— ${escapeHtml(attribution[2].trim())}</figcaption>
      </figure>`);
      return;
    }

    if (
      /^["'""«]/i.test(text) ||
      (/^<i|^<em/i.test(html) && text.length < 320 && !text.includes("(-"))
    ) {
      $p.replaceWith(`<figure class="study-pull-quote"><blockquote>${html}</blockquote></figure>`);
      return;
    }

    if ($p.find("i, em").length >= 3 && text.length < 260) {
      $p.addClass("study-definition-types");
    }

    const isSimple =
      !$p.find("p, div, ol, ul, table, math, svg").length &&
      $p.children().toArray().every((node) => {
        const n = node as { type?: string; tagName?: string };
        if (n.type === "text") return true;
        if (n.type === "tag" && n.tagName) {
          return ["i", "em", "strong", "b", "a", "span", "sub", "sup"].includes(
            n.tagName.toLowerCase()
          );
        }
        return false;
      });

    if (isSimple && text.length > 360) {
      const sentences = splitSentences(text);
      if (sentences.length >= 3) {
        const $group = $('<div class="study-paragraph-group"></div>');
        for (let i = 0; i < sentences.length; i += 2) {
          const chunk = sentences.slice(i, i + 2).join(" ");
          const isLead = i === 0;
          $group.append(
            `<p class="study-paragraph${isLead ? " study-lead" : ""}">${escapeHtml(chunk)}</p>`
          );
        }
        $p.replaceWith($group);
        return;
      }
    }

    $p.addClass("study-paragraph");
    if (text.length > 320) {
      $p.addClass("study-paragraph-long");
    }
  });

  $(".study-section").each((_, section) => {
    const $section = $(section);
    const $first = $section.children("p.study-paragraph").first();
    if ($first.length && !$first.hasClass("study-lead")) {
      $first.addClass("study-lead");
    }
  });

  $(".study-key-point > p, .study-key-point p").each((_, el) => {
    $(el).addClass("study-paragraph study-paragraph-nested");
  });
}

function formatListItems($: cheerio.CheerioAPI) {
  $("li").each((_, li) => {
    const $li = $(li);
    if ($li.children("ol, ul, figure, svg").length) return;

    const $bold = $li.children("b, strong").first();
    if (!$bold.length) return;

    const title = $bold.text().trim().replace(/:$/, "");
    $bold.remove();

    let bodyHtml = $li.html()?.trim() || "";
    bodyHtml = bodyHtml.replace(/^:\s*/, "").replace(/^\s*<br\s*\/?>\s*/i, "").trim();

    const isEmpty = !bodyHtml || bodyHtml === "<br>" || bodyHtml === "&nbsp;";

    if (isEmpty && /credit creation/i.test(title)) {
      $li.html(
        `<strong>${escapeHtml(title)}</strong>` +
          `<p class="study-paragraph study-paragraph-nested">Commercial banks create credit by advancing loans from deposits — lending increases deposit money in the system rather than paying out cash. Read the full explanation in the <a href="#credit-creation" class="study-inline-link">Credit Creation</a> section below.</p>`
      );
      $li.addClass("study-key-point");
      return;
    }

    if (isEmpty) {
      $li.remove();
      return;
    }

    $li.html(
      `<strong>${escapeHtml(title)}</strong><p class="study-paragraph study-paragraph-nested">${bodyHtml}</p>`
    );
    $li.addClass("study-key-point");
  });
}

function addSectionAnchors($: cheerio.CheerioAPI) {
  $("h3.study-section-title").each((_, el) => {
    const $h = $(el);
    const text = $h.text().trim().toLowerCase();
    if (text === "credit creation" && !$h.attr("id")) {
      $h.attr("id", "credit-creation");
    }
  });
}

export function formatStudyHtml(html: string): string {
  if (html.includes("syllabus-doc")) return html;

  html = processLatexFigures(html);

  const $ = cheerio.load(`<div class="study-doc">${html}</div>`, null, false);
  const root = $(".study-doc");

  root.find("h2").first().addClass("study-chapter-title");
  root.find("h3").each((_, el) => {
    $(el).addClass("study-section-title");
  });
  root.find("h4").each((_, el) => {
    $(el).addClass("study-subsection-title");
  });

  root.find("math").each((_, el) => {
    const $math = $(el);
    if ($math.closest(".study-formula").length) return;

    const display = $math.attr("display") === "block";
    const inParagraph = $math.parent("p").length > 0;
    const isComplex = $math.find("mfrac, msub, msup, mrow, msqrt").length > 0;

    if (display || (!inParagraph && isComplex) || ($math.parent().is("div") && isComplex)) {
      $math.wrap('<div class="study-formula" role="math"></div>');
    }
  });

  root.find("div").each((_, el) => {
    const $div = $(el);
    if ($div.hasClass("study-doc") || $div.hasClass("study-section")) return;

    const text = $div.text().replace(/\s+/g, " ").trim().toLowerCase();
    if (/^where[,:]?/.test(text) || (text.startsWith("where") && text.includes("-"))) {
      $div.addClass("study-definitions");
    }
  });

  root.find("svg").each((_, el) => {
    const $svg = $(el);
    if ($svg.closest(".study-figure").length) return;
    $svg.wrap('<figure class="study-figure"></figure>');
  });

  root.find(".fig").each((_, el) => {
    $(el).addClass("study-figure-wrap");
  });

  root.find("blockquote").each((_, el) => {
    $(el).addClass("study-quote");
  });

  root.find("ol").each((_, el) => {
    const $ol = $(el);
    if ($ol.hasClass("syllabus-objectives")) return;
    $ol.addClass("study-numbered-list");
  });

  formatListItems($);
  addSectionAnchors($);

  root.find("ul").each((_, el) => {
    $(el).addClass("study-bullet-list");
  });

  root.find("p").each((_, el) => {
    const $p = $(el);
    const text = $p.text().trim();
    if (/^(note|important|remember|key point)/i.test(text)) {
      $p.addClass("study-callout study-callout-tip");
    } else if (
      /states,|defined as|refers to|is called|means that|law of|why is economics important/i.test(
        text
      )
    ) {
      $p.addClass("study-callout study-callout-definition");
    }
  });

  root.find("table").each((_, el) => {
    $(el).closest(".content-table-wrapper").addClass("study-table-wrap");
  });

  groupSections($);
  formatParagraphs($);

  return $.root().html()?.trim() || html;
}
