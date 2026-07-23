// ─── TopologyConnection (v2) ──────────────────────────────────────────────────
// Dual-layer SVG path:
//   1. Track layer  — always visible, faint, shows the route at rest
//   2. Pulse layer  — draws itself via stroke-dashoffset CSS transition
//
// The CSS transition approach keeps animation off the React render cycle.
// The hook sets `fraction = 1` and `transitionDurationMs = stageDuration`
// simultaneously — the browser's compositor handles the interpolation.
//
// On cycle reset: `transitionDurationMs = 0` snaps instantly (no reverse anim).

import { memo, useRef, useEffect, useState } from "react";
import type { ConnectionState } from "../types/topology";
import { computeBezierPath, approximateBezierLength } from "./pathUtils";

interface TopologyConnectionProps {
  id:                   string;
  from:                 { x: number; y: number };
  to:                   { x: number; y: number };
  state?:               ConnectionState;
  fraction?:            number;
  transitionDurationMs?: number;
  /** Thinner stroke for ambient (test/lint) branches */
  isAmbient?:           boolean;
}

const TRACK_COLOR  = "#3f3f46"; // zinc-700
const PULSE_COLOR  = "#3b82f6"; // blue-500
const COMPLETE_OPACITY = 0.22;

function TopologyConnection({
  id,
  from,
  to,
  state                = "idle",
  fraction             = 0,
  transitionDurationMs = 0,
  isAmbient            = false,
}: TopologyConnectionProps) {
  const pathRef  = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setLen(pathRef.current.getTotalLength());
    } else {
      setLen(approximateBezierLength(from, to));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from.x, from.y, to.x, to.y]);

  const d            = computeBezierPath(from, to);
  const trackWidth   = isAmbient ? 0.5 : 0.75;
  const trackOpacity = state === "complete" ? COMPLETE_OPACITY : isAmbient ? 0.07 : 0.10;
  const pulseWidth   = isAmbient ? 1 : 1.5;
  const pulseOpacity = state === "pulsing" && fraction > 0 ? (isAmbient ? 0.5 : 0.8) : 0;
  const dashOffset   = len > 0 ? len * (1 - fraction) : len;
  const filterId     = `cglow-${id}`;

  return (
    <g>
      <defs>
        <filter id={filterId} x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation={isAmbient ? 1.5 : 2.5} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Track */}
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={TRACK_COLOR}
        strokeWidth={trackWidth}
        opacity={trackOpacity}
        strokeLinecap="round"
      />

      {/* Pulse — CSS transition drives the animation */}
      {len > 0 && (
        <path
          d={d}
          fill="none"
          stroke={PULSE_COLOR}
          strokeWidth={pulseWidth}
          opacity={pulseOpacity}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={dashOffset}
          filter={pulseOpacity > 0 ? `url(#${filterId})` : undefined}
          style={{
            transition: transitionDurationMs > 0
              ? `stroke-dashoffset ${transitionDurationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`
              : "none",
          }}
        />
      )}
    </g>
  );
}

export default memo(TopologyConnection);
