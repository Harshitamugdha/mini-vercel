// ─── Topology Types ──────────────────────────────────────────────────────────
// Single source of truth for all topology-related shapes.
// These are pure data types — no React, no Framer Motion.

export type NodeTier = "primary" | "secondary" | "tertiary";

/** Visual shape category — determines SVG marker drawn inside the node. */
export type NodeType =
  | "git"         // Push, GitHub — commit diamond
  | "runner"      // GitHub Actions — CI runner ticks
  | "job"         // Checkout, Install, Test, Lint — simple circle
  | "build"       // Build — crosshair
  | "storage"     // S3 — cylinder bars
  | "cdn"         // CloudFront — radial rays
  | "production"; // Production — double ring

export type NodeId =
  | "push"
  | "github"
  | "actions"
  | "checkout"
  | "install"
  | "test"
  | "lint"
  | "build"
  | "s3"
  | "cloudfront"
  | "production";

export interface TopologyNodeData {
  id: NodeId;
  label: string;
  x: number;
  y: number;
  tier: NodeTier;
  nodeType: NodeType;
  /** True for branches that illuminate but don't advance the deployment. */
  isAmbient?: boolean;
}

export interface TopologyConnectionData {
  id: string;
  from: NodeId;
  to: NodeId;
}

// The state of a single node during a deployment cycle.
export type NodeState = "idle" | "active" | "complete";

// The state of a single connection during a deployment cycle.
export type ConnectionState = "idle" | "pulsing" | "complete";

export interface DeploymentStage {
  /** Which connection is illuminated during this stage. */
  connectionId: string;
  /** Which node wakes at the end of this stage. */
  targetNodeId: NodeId;
  /** Duration in milliseconds for the pulse to travel this connection. */
  durationMs: number;
  /** Log lines that appear in the terminal during this stage. */
  logLines: readonly LogLine[];
}

export type LogLineStatus = "cmd" | "info" | "success" | "url" | "warn";

export interface LogLine {
  prefix: string;
  text: string;
  status: LogLineStatus;
  /** Offset in ms from the start of this stage when this line appears. */
  offsetMs: number;
}
