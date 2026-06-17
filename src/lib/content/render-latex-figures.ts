import {
  renderCurveTypesFigure,
  renderSlopeCalculationFigure,
} from "./figures/charts";
import { renderBillDiscountingFigure } from "./figures/bill-discounting";

const FIGURE_LABELS: Record<string, string> = {
  negativeSlopeCalculation: "Figure: Negative Slope",
  positiveSlopeCalculation: "Figure: Positive Slope",
  slopeCalculation: "Figure: Slope",
  billDiscounting: "Figure: Bill Discounting",
  balanceSheet3: "Figure: Balance Sheet",
  balanceSheet4: "Figure: Balance Sheet",
  balanceSheet5: "Figure: Balance Sheet",
  studyBoxOfFuncttions: "the study box",
  function: "the function",
};

function cleanLatexCell(cell: string): string {
  return cell
    .replace(/\\(hline|toprule|midrule|bottomrule|scriptsize|centering)\b/g, "")
    .replace(/\\cline\{[^}]+\}/g, "")
    .replace(/\{\s*\\?[^}]+\s*\}/g, (m) => {
      if (/^\{\s*\\[a-zA-Z]+\s*\}$/.test(m)) return "";
      return m;
    })
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function renderLatexTable(tabularContent: string): string {
  const normalized = tabularContent
    .replace(/\\(hline|toprule|midrule|bottomrule)\b/g, "")
    .replace(/\\cline\{[^}]+\}/g, "")
    .trim();

  const rows = normalized
    .split(/\\\\/)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split("&").map((cell) => cleanLatexCell(cell)).filter(Boolean))
    .filter((cells) => cells.length > 0);

  if (rows.length === 0) return "";

  const hasHeader = rows[0].some((cell) =>
    /liabilities|assets|particulars|amount|debit|credit/i.test(cell)
  );
  const header = hasHeader ? rows.shift()! : null;
  const maxCols = Math.max(...rows.map((r) => r.length), header?.length ?? 0, 1);

  const headerHtml = header
    ? `<thead><tr>${header
        .map((cell) => `<th>${cell}</th>`)
        .join("")}${"<th></th>".repeat(Math.max(0, maxCols - header.length))}</tr></thead>`
    : "";
  const bodyHtml = rows
    .map((cells) => {
      const padded = [...cells, ...Array(Math.max(0, maxCols - cells.length)).fill("")];
      return `<tr>${padded.map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
    })
    .join("");

  return `<div class="content-table-wrapper study-table-wrap"><table class="content-table study-latex-table">${headerHtml}<tbody>${bodyHtml}</tbody></table></div>`;
}

function extractAndRenderLatexTables(html: string): string {
  let result = html;

  result = result.replace(
    /\\begin\{table\}[\s\S]*?\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}[\s\S]*?\\end\{table\}/g,
    (_, tabular) => renderLatexTable(tabular) || ""
  );

  result = result.replace(
    /\\begin\{tabular\}\{[^}]*\}([\s\S]*?)\\end\{tabular\}/g,
    (_, tabular) => renderLatexTable(tabular) || ""
  );

  return result;
}

function replaceFigureBlock(content: string): string | null {
  if (content.includes("\\label{slopeCalculation}") || content.includes("negativeSlopeCalculation")) {
    return renderSlopeCalculationFigure();
  }
  if (
    content.includes("Linear curves or change at constant rate") ||
    content.includes("Non-linear curve or change at variable rate") ||
    content.includes("\\caption{Rising curves.")
  ) {
    return renderCurveTypesFigure();
  }
  if (content.includes("\\label{billDiscounting}") || content.includes("Bill Discounting")) {
    return renderBillDiscountingFigure();
  }
  return null;
}

function extractFigureBlocks(html: string): string {
  let result = html;

  // <pre>…\begin{figure}…</pre>
  result = result.replace(/<pre>\s*([\s\S]*?)<\/pre>/gi, (match, inner) => {
    if (!/\\begin\{figure\}|\\begin\{tikzpicture\}/.test(inner)) return match;
    return replaceFigureBlock(inner) ?? `<figure class="study-figure study-latex-fallback"><details><summary>View diagram source</summary><pre class="study-latex-source">${inner.trim()}</pre></details></figure>`;
  });

  // Raw \begin{figure}…\end{figure} outside <pre> (e.g. banking page)
  result = result.replace(/\\begin\{figure\}[\s\S]*?\\end\{figure\}/g, (block) => {
    return replaceFigureBlock(block) ?? "";
  });

  // Orphan \begin{tikzpicture}…\end{tikzpicture}
  result = result.replace(/\\begin\{tikzpicture\}[\s\S]*?\\end\{tikzpicture\}/g, (block) => {
    if (block.includes("Bill Discounting") || block.includes("Seller")) {
      return renderBillDiscountingFigure();
    }
    return "";
  });

  return result;
}

export function fixLatexReferences(html: string): string {
  return html.replace(/\\ref\{([^}]+)\}/g, (_, label: string) => {
    const text = FIGURE_LABELS[label];
    return text
      ? `<span class="study-fig-ref">${text}</span>`
      : `<span class="study-fig-ref">the figure</span>`;
  });
}

export function fixLatexMisc(html: string): string {
  return html
    .replace(/\{\\studybox\{([^}]+)\}\}/g, '<aside class="study-callout study-callout-tip"><strong>$1</strong></aside>')
    .replace(/\\studybox\{([^}]+)\}/g, '<aside class="study-callout study-callout-tip"><strong>$1</strong></aside>')
    .replace(/\\label\{[^}]+\}/g, "")
    .replace(/\\caption\{([^}]*)\}/g, "")
    .replace(/\\begin\{[^}]+\}(?:\[[^\]]*\])?/g, "")
    .replace(/\\end\{[^}]+\}/g, "")
    .replace(/\\(hline|toprule|midrule|bottomrule)\b/g, "")
    .replace(/\\cline\{[^}]+\}/g, "")
    .replace(/\\begin\{center\}|\\end\{center\}/g, "")
    .replace(/\\scriptsize|\\centering/g, "")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/\\exmp\b/gi, "Example:")
    .replace(/\s{2,}/g, " ")
    .replace(/Potisive Slope/g, "Positive Slope")
    .replace(/fslope -ve/g, "slope −ve")
    .replace(/drawees acknowledgement/gi, "drawee's acknowledgement");
}

export function processLatexFigures(html: string): string {
  let result = extractFigureBlocks(html);
  result = extractAndRenderLatexTables(result);
  result = fixLatexReferences(result);
  result = fixLatexMisc(result);
  return result;
}
