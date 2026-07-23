// ─── SVG Path Utilities ───────────────────────────────────────────────────────
// Computes the cubic bezier `d` attribute string for a connection between
// two nodes. Uses a horizontal-bias control point strategy so paths feel
// like infrastructure wiring rather than straight lines or sharp flowchart
// arrows.

interface Point {
  x: number;
  y: number;
}

/**
 * Computes a smooth cubic bezier SVG path between two points.
 * Control points are biased horizontally so curves feel like cable routes.
 *
 * @param from  Source node center point.
 * @param to    Target node center point.
 * @param bias  0–1. How far along x the control points anchor. Default 0.5.
 */
export function computeBezierPath(from: Point, to: Point, bias = 0.5): string {
  const dx = to.x - from.x;
  const cp1x = from.x + dx * bias;
  const cp1y = from.y;
  const cp2x = to.x - dx * (1 - bias);
  const cp2y = to.y;

  return `M ${from.x} ${from.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${to.x} ${to.y}`;
}

/**
 * Approximates the length of a cubic bezier via linear sampling.
 * Used to set `strokeDasharray` / `strokeDashoffset` for draw animations.
 *
 * @param from    Source point.
 * @param to      Target point.
 * @param samples Number of samples for approximation (higher = more accurate).
 */
export function approximateBezierLength(
  from: Point,
  to: Point,
  samples = 50
): number {
  const dx = to.x - from.x;
  const cp1 = { x: from.x + dx * 0.5, y: from.y };
  const cp2 = { x: to.x - dx * 0.5,   y: to.y   };

  let length = 0;
  let prev = from;

  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const mt = 1 - t;
    const curr = {
      x: mt ** 3 * from.x + 3 * mt ** 2 * t * cp1.x + 3 * mt * t ** 2 * cp2.x + t ** 3 * to.x,
      y: mt ** 3 * from.y + 3 * mt ** 2 * t * cp1.y + 3 * mt * t ** 2 * cp2.y + t ** 3 * to.y,
    };
    const segDx = curr.x - prev.x;
    const segDy = curr.y - prev.y;
    length += Math.sqrt(segDx * segDx + segDy * segDy);
    prev = curr;
  }

  return length;
}
