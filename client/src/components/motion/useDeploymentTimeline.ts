import type { NodeId, NodeState, LogLine } from "../types/topology";

interface ConnectionMeta {
  state: "idle" | "pulsing" | "complete";
  fraction: number;
  transitionDurationMs: number;
}

export interface TimelineState {
  nodeStates: Partial<Record<NodeId, NodeState>>;
  connectionMeta: Partial<Record<string, ConnectionMeta>>;
  logLines: LogLine[];
  isComplete: boolean;
  cycleKey: number;
}

const STATIC_TIMELINE: TimelineState = {
  nodeStates: {},
  connectionMeta: {},
  logLines: [],
  isComplete: false,
  cycleKey: 0,
};

export function useDeploymentTimeline(): TimelineState {
  return STATIC_TIMELINE;
}
