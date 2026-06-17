/** Map chart data coordinates to SVG pixel coordinates (y-axis inverted). */
function toSvgPoints(
  points: [number, number][],
  w: number,
  h: number,
  pad: { t: number; r: number; b: number; l: number },
  xMax: number,
  yMax: number
): string {
  return points
    .map(([x, y]) => {
      const sx = pad.l + (x / xMax) * (w - pad.l - pad.r);
      const sy = pad.t + (1 - y / yMax) * (h - pad.t - pad.b);
      return `${sx.toFixed(1)},${sy.toFixed(1)}`;
    })
    .join(" ");
}

function axisGrid(w: number, h: number, pad: { t: number; r: number; b: number; l: number }, xTicks: number[], yTicks: number[], xMax: number, yMax: number): string {
  const lines: string[] = [];
  for (const x of xTicks) {
    const sx = pad.l + (x / xMax) * (w - pad.l - pad.r);
    lines.push(`<line x1="${sx}" y1="${pad.t}" x2="${sx}" y2="${h - pad.b}" class="chart-grid"/>`);
  }
  for (const y of yTicks) {
    const sy = pad.t + (1 - y / yMax) * (h - pad.t - pad.b);
    lines.push(`<line x1="${pad.l}" y1="${sy}" x2="${w - pad.r}" y2="${sy}" class="chart-grid"/>`);
  }
  return lines.join("");
}

function miniChart(pathD: string, caption: string): string {
  return `<figure class="study-mini-chart">
    <svg viewBox="0 0 120 120" role="img" aria-label="${caption}">
      <line x1="20" y1="100" x2="110" y2="100" class="chart-axis"/>
      <line x1="20" y1="100" x2="20" y2="10" class="chart-axis"/>
      <text x="62" y="115" class="chart-axis-label">x</text>
      <text x="8" y="55" class="chart-axis-label" transform="rotate(-90 8 55)">y</text>
      <path d="${pathD}" class="chart-line" fill="none"/>
    </svg>
    <figcaption>${caption}</figcaption>
  </figure>`;
}

export function renderSlopeCalculationFigure(): string {
  const w = 380;
  const h = 300;
  const pad = { t: 28, r: 16, b: 44, l: 52 };
  const xMax = 8;
  const yMax = 18;

  const negPoints: [number, number][] = [
    [1, 16], [2, 11], [3, 7], [4, 4], [5, 2], [6, 1], [7, 0.5],
  ];
  const posPoints: [number, number][] = [
    [1, 0.5], [2, 1], [3, 2], [4, 4], [5, 7], [6, 11], [7, 16],
  ];

  const negStep: [number, number][] = [
    [1, 16], [1, 11], [2, 11], [2, 7], [3, 7], [3, 4], [4, 4], [4, 2], [5, 2], [5, 1], [5, 0.5], [6, 0.5],
  ];
  const posStep: [number, number][] = [
    [2, 1], [3, 1], [3, 2], [4, 2], [4, 4], [5, 4], [5, 7], [6, 7], [6, 11], [7, 11], [7, 16],
  ];

  const labels = ["A", "B", "C", "D", "E", "F", "G"];

  function singleChart(
    title: string,
    solid: [number, number][],
    dashed: [number, number][],
    slopeLabel: string,
    id: string
  ): string {
    const solidPts = toSvgPoints(solid, w, h, pad, xMax, yMax);
    const dashPts = toSvgPoints(dashed, w, h, pad, xMax, yMax);
    const grid = axisGrid(w, h, pad, [1, 2, 3, 4, 5, 6, 7, 8], [5, 9, 12, 14, 15], xMax, yMax);

    const pointLabels = solid
      .map(([x, y], i) => {
        const sx = pad.l + (x / xMax) * (w - pad.l - pad.r);
        const sy = pad.t + (1 - y / yMax) * (h - pad.t - pad.b);
        const dy = i % 2 === 0 ? -10 : 14;
        return `<text x="${sx}" y="${sy + dy}" class="chart-point-label">${labels[i]}</text>`;
      })
      .join("");

    return `<figure class="study-chart-panel" id="${id}">
      <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
        ${grid}
        <line x1="${pad.l}" y1="${h - pad.b}" x2="${w - pad.r}" y2="${h - pad.b}" class="chart-axis"/>
        <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${h - pad.b}" class="chart-axis"/>
        <text x="${(pad.l + w - pad.r) / 2}" y="${h - 8}" class="chart-axis-title">Demand</text>
        <text x="14" y="${(pad.t + h - pad.b) / 2}" class="chart-axis-title" transform="rotate(-90 14 ${(pad.t + h - pad.b) / 2})">Marginal utility</text>
        <polyline points="${dashPts}" class="chart-line chart-line-dashed" fill="none"/>
        <polyline points="${solidPts}" class="chart-line" fill="none"/>
        ${pointLabels}
        <text x="${pad.l + 40}" y="${pad.t + 36}" class="chart-annotation">${slopeLabel}</text>
      </svg>
      <figcaption>${title}</figcaption>
    </figure>`;
  }

  return `<figure class="study-figure study-chart-figure" id="slopeCalculation">
    <div class="study-chart-grid">
      ${singleChart("Negative Slope", negPoints, negStep, "slope = −dy/dx", "negativeSlopeCalculation")}
      ${singleChart("Positive Slope", posPoints, posStep, "slope = dy/dx", "positiveSlopeCalculation")}
    </div>
    <figcaption class="study-chart-main-caption">Slope — marginal utility vs demand</figcaption>
  </figure>`;
}

export function renderCurveTypesFigure(): string {
  const linear = [
    miniChart("M20,70 L110,70", "Slope is zero"),
    miniChart("M70,15 L70,100", "Slope is ∞"),
    miniChart("M20,70 L110,30", "Slope −ve"),
    miniChart("M20,30 L110,70", "Slope +ve"),
  ];

  const nonlinear = [
    miniChart("M20,95 Q55,55 110,15", "↑ at ↓ rate"),
    miniChart("M20,95 Q40,90 110,15", "↑ at ↑ rate"),
    miniChart("M20,15 Q55,55 110,95", "↓ at ↑ rate"),
    miniChart("M20,15 Q40,85 110,95", "↓ at ↓ rate"),
  ];

  const rising = [
    miniChart("M20,95 Q35,75 60,55 Q85,35 110,15", "Initially ↓ rate, then ↑ rate"),
    miniChart("M20,95 Q45,88 60,55 Q75,22 110,18", "Initially ↑ rate, then ↓ rate"),
  ];

  return `<div class="study-figure-group">
    <figure class="study-figure">
      <div class="study-mini-chart-grid">${linear.join("")}</div>
      <figcaption>Linear curves — change at a constant rate</figcaption>
    </figure>
    <figure class="study-figure">
      <div class="study-mini-chart-grid">${nonlinear.join("")}</div>
      <figcaption>Non-linear curves — change at a variable rate</figcaption>
    </figure>
    <figure class="study-figure">
      <div class="study-mini-chart-grid study-mini-chart-grid-2">${rising.join("")}</div>
      <figcaption>Rising curves</figcaption>
    </figure>
  </div>`;
}
