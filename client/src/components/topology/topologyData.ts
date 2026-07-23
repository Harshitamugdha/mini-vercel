// ─── Topology Data (v2) ───────────────────────────────────────────────────────
// Redesigned for Phase 2:
//   • Nodes spread to dominate the full 1440×820 viewBox
//   • Fan-out at Actions into Test + Lint (ambient) + main deployment path
//   • Each node carries a NodeType for visual shape distinction
//   • isAmbient marks branches that illuminate but do not complete deployment

import type { TopologyNodeData, TopologyConnectionData } from "../types/topology";

// ─── Nodes ───────────────────────────────────────────────────────────────────

export const TOPOLOGY_NODES: readonly TopologyNodeData[] = [
  // Origin
  { id: "push",       label: "Push",           x: 38,   y: 400,  tier: "primary",   nodeType: "git"        },
  { id: "github",     label: "GitHub",          x: 180,  y: 210,  tier: "primary",   nodeType: "git"        },
  { id: "actions",    label: "GitHub Actions",  x: 400,  y: 310,  tier: "primary",   nodeType: "runner"     },

  // Ambient branches (fire but don't advance deployment)
  { id: "test",       label: "Tests",           x: 530,  y: 120,  tier: "secondary", nodeType: "job", isAmbient: true },
  { id: "lint",       label: "Lint",            x: 670,  y: 42,   tier: "tertiary",  nodeType: "job", isAmbient: true },

  // Main deployment path
  { id: "checkout",   label: "Checkout",        x: 310,  y: 540,  tier: "secondary", nodeType: "job"        },
  { id: "install",    label: "Install",         x: 540,  y: 640,  tier: "secondary", nodeType: "job"        },
  { id: "build",      label: "Build",           x: 760,  y: 430,  tier: "primary",   nodeType: "build"      },
  { id: "s3",         label: "Amazon S3",       x: 990,  y: 310,  tier: "secondary", nodeType: "storage"    },
  { id: "cloudfront", label: "CloudFront",      x: 1210, y: 455,  tier: "secondary", nodeType: "cdn"        },
  { id: "production", label: "Production",      x: 1400, y: 295,  tier: "primary",   nodeType: "production" },
] as const;

// ─── Connections ─────────────────────────────────────────────────────────────
// Ordered by traversal sequence used in the deployment stages.

export const TOPOLOGY_CONNECTIONS: readonly TopologyConnectionData[] = [
  // Main spine
  { id: "push-github",       from: "push",       to: "github"      },
  { id: "github-actions",    from: "github",     to: "actions"     },
  // Ambient branches
  { id: "actions-test",      from: "actions",    to: "test"        },
  { id: "actions-lint",      from: "actions",    to: "lint"        },
  // Main deployment path (fan-out then fan-in)
  { id: "actions-checkout",  from: "actions",    to: "checkout"    },
  { id: "checkout-install",  from: "checkout",   to: "install"     },
  { id: "install-build",     from: "install",    to: "build"       },
  // Distribution
  { id: "build-s3",          from: "build",      to: "s3"          },
  { id: "s3-cloudfront",     from: "s3",         to: "cloudfront"  },
  { id: "cloudfront-prod",   from: "cloudfront", to: "production"  },
] as const;

// ─── SVG Viewport ─────────────────────────────────────────────────────────────

export const SVG_VIEW_BOX = "0 0 1440 820" as const;

// ─── Lookup maps ─────────────────────────────────────────────────────────────

export const NODE_MAP = new Map<string, TopologyNodeData>(
  TOPOLOGY_NODES.map((n) => [n.id, n])
);

export const CONNECTION_MAP = new Map<string, TopologyConnectionData>(
  TOPOLOGY_CONNECTIONS.map((c) => [c.id, c])
);
