/** Hexagon points centered at (cx, cy) with given radius. */
function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

export function renderBillDiscountingFigure(): string {
  const seller = hexPoints(170, 95, 52);
  const buyer = hexPoints(470, 95, 52);
  const bank = hexPoints(320, 295, 58);

  return `<figure class="study-figure study-flow-figure" id="billDiscounting">
    <svg viewBox="0 0 640 380" role="img" aria-label="Bill Discounting — Seller, Buyer, and Bank" class="flow-diagram">
      <defs>
        <marker id="billFlowArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" class="flow-arrow-head"/>
        </marker>
      </defs>
      <!-- Nodes -->
      <polygon points="${seller}" class="flow-node"/>
      <text x="170" y="100" class="flow-node-label">Seller</text>
      <polygon points="${buyer}" class="flow-node"/>
      <text x="470" y="100" class="flow-node-label">Buyer</text>
      <polygon points="${bank}" class="flow-node"/>
      <text x="320" y="300" class="flow-node-label">Bank</text>
      <!-- Sale of goods: Seller → Buyer -->
      <text x="320" y="42" class="flow-edge-label flow-edge-label-strong">Sale of Goods</text>
      <line x1="228" y1="78" x2="412" y2="78" class="flow-edge flow-edge-goods" marker-end="url(#billFlowArrow)"/>
      <!-- Invoice: Seller → Bank -->
      <text x="218" y="195" class="flow-edge-label">Invoice</text>
      <path d="M170,150 L170,230 L280,230 L280,268" class="flow-edge flow-edge-invoice" marker-end="url(#billFlowArrow)"/>
      <!-- Acknowledgment: Buyer → Bank -->
      <text x="400" y="195" class="flow-edge-label">Acknowledgment</text>
      <path d="M470,150 L470,230 L360,230 L360,268" class="flow-edge flow-edge-ack" marker-end="url(#billFlowArrow)"/>
      <!-- Payment by Buyer → Bank -->
      <text x="430" y="268" class="flow-edge-label">Payment by Buyer</text>
      <path d="M455,135 L340,280" class="flow-edge flow-edge-pay" marker-end="url(#billFlowArrow)"/>
      <!-- Payment to Seller: Bank → Seller -->
      <text x="155" y="268" class="flow-edge-label">Payment to Seller</text>
      <path d="M285,280 L185,135" class="flow-edge flow-edge-pay" marker-end="url(#billFlowArrow)"/>
    </svg>
    <figcaption>Bill Discounting — flow between Seller, Buyer, and Bank</figcaption>
  </figure>`;
}
