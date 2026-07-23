// ─── Topology (v2) ───────────────────────────────────────────────────────────
// Accepts full timeline state from the parent Hero and distributes it
// to the individual node and connection components.

import { memo } from "react";
import type { NodeId, NodeState } from "../types/topology";
import type { TimelineState } from "../motion/useDeploymentTimeline";
import { TOPOLOGY_NODES, TOPOLOGY_CONNECTIONS, NODE_MAP, SVG_VIEW_BOX } from "./topologyData";
import TopologyNode from "./TopologyNode";
import TopologyConnection from "./TopologyConnection";

// ─── Props ────────────────────────────────────────────────────────────────────

interface TopologyProps {
  timeline?: Pick<TimelineState, "nodeStates" | "connectionMeta">;
  mousePos?: { x: number; y: number } | null;
  className?: string;
}

// ─── Proximity ────────────────────────────────────────────────────────────────

const PROXIMITY_RADIUS = 90; // SVG units

function getProximity(
  nx: number,
  ny: number,
  mouse: { x: number; y: number } | null | undefined
): number {
  if (!mouse) return 0;
  const dx = nx - mouse.x;
  const dy = ny - mouse.y;
  return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / PROXIMITY_RADIUS);
}

// Ambient connection IDs (thinner visual treatment)
const AMBIENT_CONNECTIONS = new Set(["actions-test", "actions-lint"]);

// ─── Component ────────────────────────────────────────────────────────────────

function Topology({ timeline, mousePos, className = "" }: TopologyProps) {
  const nodeStates     = timeline?.nodeStates     ?? {};
  const connectionMeta = timeline?.connectionMeta ?? {};

  return (
    <svg
      viewBox={SVG_VIEW_BOX}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity: 0.09 }}
    >
      {/* Connections rendered below nodes */}
      {TOPOLOGY_CONNECTIONS.map((conn) => {
        const fromNode = NODE_MAP.get(conn.from);
        const toNode   = NODE_MAP.get(conn.to);
        if (!fromNode || !toNode) return null;

        const meta = connectionMeta[conn.id];

        return (
          <TopologyConnection
            key={conn.id}
            id={conn.id}
            from={{ x: fromNode.x, y: fromNode.y }}
            to={{   x: toNode.x,   y: toNode.y   }}
            state={meta?.state ?? "idle"}
            fraction={meta?.fraction ?? 0}
            transitionDurationMs={meta?.transitionDurationMs ?? 0}
            isAmbient={AMBIENT_CONNECTIONS.has(conn.id)}
          />
        );
      })}

      {/* Nodes rendered above connections */}
      {TOPOLOGY_NODES.map((node) => (
        <TopologyNode
          key={node.id}
          id={node.id}
          x={node.x}
          y={node.y}
          tier={node.tier}
          nodeType={node.nodeType}
          state={(nodeStates[node.id as NodeId] as NodeState) ?? "idle"}
          proximity={getProximity(node.x, node.y, mousePos)}
        />
      ))}
    </svg>
  );
}

export default memo(Topology);
