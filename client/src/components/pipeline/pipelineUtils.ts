// ─── Pipeline SVG Utilities ───────────────────────────────────────────────────
// Pure functions for computing wide asymmetrical PCB-style routed paths across the viewport.

/**
 * Builds an engineered 90° PCB-trace path between two node coordinates (x1, y1) → (x2, y2).
 * Strictly 90-degree orthogonal turns (no diagonal shortcuts) for hardware aesthetic.
 */
export function buildPcbPath(
  fromX: number,
  fromY: number,
  toX:   number,
  toY:   number,
): string {
  if (fromX === toX) {
    return `M ${fromX} ${fromY} L ${toX} ${toY}`;
  }

  const midY = fromY + (toY - fromY) * 0.5;

  return [
    `M ${fromX} ${fromY}`,
    `L ${fromX} ${midY}`,
    `L ${toX} ${midY}`,
    `L ${toX} ${toY}`,
  ].join(" ");
}

/**
 * Approximate the total orthogonal path length.
 */
export function approxPcbLength(
  fromX: number,
  fromY: number,
  toX:   number,
  toY:   number,
): number {
  const midY = fromY + (toY - fromY) * 0.5;
  return (
    Math.abs(midY - fromY) +
    Math.abs(toX - fromX) +
    Math.abs(toY - midY)
  );
}
