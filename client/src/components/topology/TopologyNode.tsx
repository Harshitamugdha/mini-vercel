// ─── TopologyNode (v2) ────────────────────────────────────────────────────────
// Renders a node with a shape marker determined by its NodeType.
// Shape markers communicate node role without labels:
//
//   git        → inner diamond (rotated rect) — commit SHA
//   runner     → 4 tick marks at 90° intervals — CI runner cores
//   job        → plain circle — generic job
//   build      → crosshair lines — compilation target
//   storage    → two horizontal bars — S3 cylinder
//   cdn        → 3 outward rays — edge distribution
//   production → outer ring — live environment

import { memo } from "react";
import type { NodeTier, NodeType, NodeState } from "../types/topology";

interface TopologyNodeProps {
  id:         string;
  x:          number;
  y:          number;
  tier:       NodeTier;
  nodeType:   NodeType;
  state?:     NodeState;
  proximity?: number;
}

// ─── Visual constants ─────────────────────────────────────────────────────────

const RADIUS: Record<NodeTier, number> = {
  primary:   7,
  secondary: 4.5,
  tertiary:  3,
};

const BASE_OPACITY: Record<NodeState, number> = {
  idle:     0.15,
  active:   0.75,
  complete: 0.32,
};

const NODE_COLOR: Record<NodeState, string> = {
  idle:     "#71717a", // zinc-500
  active:   "#60a5fa", // blue-400
  complete: "#3b82f6", // blue-500
};

// ─── Shape markers ────────────────────────────────────────────────────────────

function NodeMarker({ nodeType, r, color, opacity }: {
  nodeType: NodeType;
  r:        number;
  color:    string;
  opacity:  number;
}) {
  const mo = opacity * 0.9; // marker opacity slightly less than ring

  switch (nodeType) {
    case "git": {
      // Inner diamond (rotated square)
      const s = r * 0.45;
      return (
        <rect
          x={-s} y={-s} width={s * 2} height={s * 2}
          fill={color} opacity={mo}
          transform="rotate(45)"
        />
      );
    }
    case "runner": {
      // 4 tick marks at 90° intervals
      const inner = r * 1.1;
      const outer = r * 1.55;
      return (
        <>
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={Math.cos(rad) * inner} y1={Math.sin(rad) * inner}
                x2={Math.cos(rad) * outer} y2={Math.sin(rad) * outer}
                stroke={color} strokeWidth={0.8} opacity={mo}
              />
            );
          })}
        </>
      );
    }
    case "build": {
      // Short crosshair lines
      const arm = r * 1.4;
      return (
        <>
          <line x1={-arm} y1={0} x2={arm} y2={0} stroke={color} strokeWidth={0.7} opacity={mo} />
          <line x1={0} y1={-arm} x2={0} y2={arm} stroke={color} strokeWidth={0.7} opacity={mo} />
        </>
      );
    }
    case "storage": {
      // Two horizontal bars (cylinder)
      const hw = r * 0.7;
      return (
        <>
          <line x1={-hw} y1={-r * 0.35} x2={hw} y2={-r * 0.35} stroke={color} strokeWidth={0.7} opacity={mo} />
          <line x1={-hw} y1={ r * 0.35} x2={hw} y2={ r * 0.35} stroke={color} strokeWidth={0.7} opacity={mo} />
        </>
      );
    }
    case "cdn": {
      // 3 outward rays
      const angles = [0, 120, 240];
      const inner = r * 1.1;
      const outer = r * 1.6;
      return (
        <>
          {angles.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={Math.cos(rad) * inner} y1={Math.sin(rad) * inner}
                x2={Math.cos(rad) * outer} y2={Math.sin(rad) * outer}
                stroke={color} strokeWidth={0.8} opacity={mo}
              />
            );
          })}
        </>
      );
    }
    case "production": {
      // Outer ring — rendered in the main component, not here
      return null;
    }
    case "job":
    default:
      return null; // plain circle, no marker
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

function TopologyNode({
  id,
  x,
  y,
  tier,
  nodeType,
  state    = "idle",
  proximity = 0,
}: TopologyNodeProps) {
  const r        = RADIUS[tier];
  const baseOpacity = BASE_OPACITY[state];
  const opacity  = Math.min(baseOpacity + proximity * 0.3, 0.9);
  const color    = NODE_COLOR[state];
  const filterId = `nglow-${id}`;
  const hasGlow  = state === "active" || proximity > 0.1;
  const glowBlur = state === "active" ? 4 : proximity * 3;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {hasGlow && (
        <defs>
          <filter id={filterId} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation={glowBlur} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      )}

      {/* Production outer ring */}
      {nodeType === "production" && (
        <circle
          r={r + 5} fill="none"
          stroke={color} strokeWidth={0.6}
          opacity={opacity * 0.5}
        />
      )}

      {/* Subtle active halo for primary nodes */}
      {state === "active" && tier === "primary" && (
        <circle
          r={r * 3} fill="none"
          stroke={color} strokeWidth={0.5}
          opacity={opacity * 0.2}
        />
      )}

      {/* Core circle */}
      <circle
        r={r} fill="none"
        stroke={color} strokeWidth={1}
        opacity={opacity}
        filter={hasGlow ? `url(#${filterId})` : undefined}
      />

      {/* Center dot */}
      <circle r={r * 0.3} fill={color} opacity={opacity * 0.85} />

      {/* Type marker */}
      <NodeMarker nodeType={nodeType} r={r} color={color} opacity={opacity} />
    </g>
  );
}

export default memo(TopologyNode);
