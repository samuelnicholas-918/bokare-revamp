import * as cheerio from "cheerio";
import { fixTypos } from "./clean-html";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function splitTopicItems(text: string): { label: string; items: string[] } {
  const normalized = fixTypos(text.replace(/\s+/g, " ").trim());
  const colonIdx = normalized.indexOf(":");
  let label = "";
  let body = normalized;

  if (colonIdx > 0 && colonIdx < 60) {
    label = normalized.slice(0, colonIdx).trim();
    body = normalized.slice(colonIdx + 1).trim();
  }

  const items = body
    .split(/,\s+(?=[A-Za-z(])/)
    .map((item) => item.trim())
    .filter(Boolean);

  return { label, items: items.length > 1 ? items : [body || normalized] };
}

export function isSyllabusContent(html: string): boolean {
  const text = html.toLowerCase();
  return text.includes("course objectives") && text.includes("course outcome");
}

export function formatSyllabusHtml(html: string): string {
  const $ = cheerio.load(`<div id="syllabus-root">${html}</div>`);
  const root = $("#syllabus-root");

  let semester = "";
  let courseCode = "";
  let courseTitle = "";
  let credits = "";

  root.find("div").each((_, el) => {
    const parts = $(el)
      .html()
      ?.split(/<br\s*\/?>/i)
      .map((line) => cheerio.load(line).text().replace(/\s+/g, " ").trim())
      .filter(Boolean);

    if (parts && parts.length >= 2 && /semester|b com|fy|sy/i.test(parts[0])) {
      semester = fixTypos(parts[0]);
      const codeLine = parts.find((p) => /course code/i.test(p));
      if (codeLine) courseCode = codeLine.replace(/course code\s*:?\s*/i, "").trim();
      courseTitle = fixTypos(parts[parts.length - 1]);
      return false;
    }
  });

  root.find("p, b, strong").each((_, el) => {
    const text = $(el).text().trim();
    if (/number of credits/i.test(text)) {
      credits = text.replace(/number of credits\s*:?\s*/i, "").trim();
    }
  });

  const objectives: string[] = [];
  root.find("b, strong").each((_, el) => {
    if (/course objectives/i.test($(el).text())) {
      const ol = $(el).parent().next("ol");
      const target = ol.length ? ol : $(el).nextAll("ol").first();
      target.find("li").each((__, li) => {
        const item = fixTypos($(li).text().trim());
        if (item) objectives.push(item);
      });
    }
  });

  if (objectives.length === 0) {
    root.find("ol").first().find("li").each((_, li) => {
      const item = fixTypos($(li).text().trim());
      if (item && item.length > 20) objectives.push(item);
    });
  }

  let outcomeIntro = "";
  const outcomes: { code: string; text: string }[] = [];
  root.find("table").first().find("tr").each((index, row) => {
    const cells = $(row).find("td");
    if (cells.length < 2) return;
    const text = fixTypos($(cells[1]).text().trim());
    if (!text) return;
    outcomes.push({ code: `CO${index + 1}`, text });
  });

  root.find("p").each((_, el) => {
    const text = $(el).text().trim();
    if (/on completing the course/i.test(text)) outcomeIntro = text;
  });

  const units: { title: string; hours: string; label: string; items: string[] }[] = [];
  const divs = root.find("div").toArray();
  for (let i = 0; i < divs.length; i++) {
    const text = $(divs[i]).text().replace(/\s+/g, " ").trim();
    const unitMatch = text.match(/Unit\s+(I{1,3}|IV|V|VI|\d+)/i);
    const hoursMatch = text.match(/(\d+)\s*Hours/i);

    if (unitMatch && hoursMatch) {
      const next = divs[i + 1];
      const topicHtml = next ? $(next).find("span").last().html() || $(next).text() : "";
      const topicText = cheerio.load(topicHtml).root().text().replace(/\s+/g, " ").trim();
      const parsed = splitTopicItems(topicText);

      units.push({
        title: `Unit ${unitMatch[1].toUpperCase()}`,
        hours: `${hoursMatch[1]} Hours`,
        label: parsed.label,
        items: parsed.items,
      });
      i++;
    }
  }

  const books: string[] = [];
  root.find("b, strong, p").each((_, el) => {
    if (/prescribed books/i.test($(el).text())) {
      const ol = $(el).nextAll("ol").first();
      ol.find("li").each((__, li) => {
        const item = fixTypos($(li).text().trim());
        if (item) books.push(item);
      });
    }
  });

  const evaluationBlocks: string[] = [];
  root.find("p").each((_, el) => {
    const text = fixTypos($(el).text().trim());
    if (
      /evaluation|formative assessment|summative assessment|end semester|distribution of marks|cia/i.test(
        text
      )
    ) {
      evaluationBlocks.push(text);
    }
  });

  const marksTable = root.find("table").last();
  let marksTableHtml = "";
  if (marksTable.length > 0 && root.find("table").length > 1) {
    marksTableHtml = `<div class="content-table-wrapper"><table class="content-table">${marksTable.html()}</table></div>`;
  } else if (marksTable.length > 0 && evaluationBlocks.length > 0) {
    marksTableHtml = `<div class="content-table-wrapper"><table class="content-table">${marksTable.html()}</table></div>`;
  }

  const parts: string[] = ['<div class="syllabus-doc">'];

  parts.push('<header class="syllabus-header">');
  if (semester) parts.push(`<p class="syllabus-meta">${escapeHtml(semester)}</p>`);
  if (courseCode) {
    parts.push(
      `<p class="syllabus-code"><span>Course Code</span><strong>${escapeHtml(courseCode)}</strong></p>`
    );
  }
  if (courseTitle) parts.push(`<h2 class="syllabus-title">${escapeHtml(courseTitle)}</h2>`);
  if (credits) {
    parts.push(
      `<div class="syllabus-credits"><span class="syllabus-credits-value">${escapeHtml(credits)}</span><span class="syllabus-credits-label">Credits</span></div>`
    );
  }
  parts.push("</header>");

  if (objectives.length) {
    parts.push('<section class="syllabus-section">');
    parts.push('<h3 class="syllabus-section-title">Course Objectives</h3>');
    parts.push('<ol class="syllabus-objectives">');
    objectives.forEach((item, index) => {
      parts.push(
        `<li><span class="syllabus-objective-num">${index + 1}</span><span>${escapeHtml(item)}</span></li>`
      );
    });
    parts.push("</ol></section>");
  }

  if (outcomes.length) {
    parts.push('<section class="syllabus-section">');
    parts.push('<h3 class="syllabus-section-title">Course Outcomes</h3>');
    if (outcomeIntro) parts.push(`<p class="syllabus-lead">${escapeHtml(outcomeIntro)}</p>`);
    parts.push('<div class="syllabus-co-grid">');
    outcomes.forEach((outcome) => {
      parts.push(
        `<article class="syllabus-co-card"><span class="syllabus-co-badge">${escapeHtml(outcome.code)}</span><p>${escapeHtml(outcome.text)}</p></article>`
      );
    });
    parts.push("</div></section>");
  }

  if (units.length) {
    parts.push('<section class="syllabus-section">');
    parts.push('<h3 class="syllabus-section-title">Course Units</h3>');
    parts.push('<div class="syllabus-unit-grid">');
    units.forEach((unit) => {
      parts.push('<article class="syllabus-unit-card">');
      parts.push('<div class="syllabus-unit-head">');
      parts.push(`<h4>${escapeHtml(unit.title)}</h4>`);
      parts.push(`<span class="syllabus-hours">${escapeHtml(unit.hours)}</span>`);
      parts.push("</div>");
      if (unit.label) parts.push(`<p class="syllabus-unit-label">${escapeHtml(unit.label)}</p>`);
      parts.push('<ul class="syllabus-topic-list">');
      unit.items.forEach((item) => parts.push(`<li>${escapeHtml(item)}</li>`));
      parts.push("</ul></article>");
    });
    parts.push("</div></section>");
  }

  if (books.length) {
    parts.push('<section class="syllabus-section">');
    parts.push('<h3 class="syllabus-section-title">Prescribed Books</h3>');
    parts.push('<ol class="syllabus-book-list">');
    books.forEach((book) => parts.push(`<li>${escapeHtml(book)}</li>`));
    parts.push("</ol></section>");
  }

  if (evaluationBlocks.length || marksTable.length) {
    parts.push('<section class="syllabus-section syllabus-evaluation">');
    parts.push('<h3 class="syllabus-section-title">Evaluation</h3>');
    parts.push('<div class="syllabus-eval-grid">');
    evaluationBlocks.forEach((block) => {
      parts.push(`<div class="syllabus-eval-card"><p>${escapeHtml(block)}</p></div>`);
    });
    parts.push("</div>");
    if (marksTableHtml) {
      parts.push('<div class="syllabus-marks-table">');
      parts.push(marksTableHtml);
      parts.push("</div>");
    }
    parts.push("</section>");
  }

  parts.push("</div>");
  return parts.join("");
}
