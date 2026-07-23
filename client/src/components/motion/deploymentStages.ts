// ─── Deployment Stages ────────────────────────────────────────────────────────
// Single source of truth for the deployment timeline.
// Each stage maps to:
//   • A connection that pulses
//   • A node that activates on arrival
//   • A set of terminal log lines with offsets from stage start
//
// AMBIENT stages (test, lint) fire in parallel with stage index 2 but
// do not advance the main sequence — they are tagged `isAmbient: true`.

import type { DeploymentStage, LogLine } from "../types/topology";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function log(
  prefix: string,
  text: string,
  status: LogLine["status"],
  offsetMs: number
): LogLine {
  return { prefix, text, status, offsetMs };
}

// ─── Stage definitions ────────────────────────────────────────────────────────

export const DEPLOYMENT_STAGES: readonly DeploymentStage[] = [
  // 0: Push → GitHub
  {
    connectionId: "push-github",
    targetNodeId:  "github",
    durationMs:    1000,
    logLines: [
      log("$", "git push origin main", "cmd", 0),
    ],
  },
  // 1: GitHub → Actions
  {
    connectionId: "github-actions",
    targetNodeId:  "actions",
    durationMs:    800,
    logLines: [
      log("›", "Workflow detected: deploy.yml", "info", 0),
    ],
  },
  // 2: Actions → Checkout (main path)
  {
    connectionId: "actions-checkout",
    targetNodeId:  "checkout",
    durationMs:    900,
    logLines: [
      log("›", "Dispatching 3 parallel jobs...", "info", 0),
    ],
  },
  // 3: Checkout → Install
  {
    connectionId: "checkout-install",
    targetNodeId:  "install",
    durationMs:    700,
    logLines: [
      log("›", "Checkout complete (ref: main)", "info", 0),
    ],
  },
  // 4: Install → Build
  {
    connectionId: "install-build",
    targetNodeId:  "build",
    durationMs:    800,
    logLines: [
      log("›", "Dependencies installed (cache hit 1.1s)", "info", 0),
    ],
  },
  // 5: Build → S3
  {
    connectionId: "build-s3",
    targetNodeId:  "s3",
    durationMs:    1000,
    logLines: [
      log("✓", "Build complete — 847 files, 2.1 MB", "success", 0),
      log("✓", "Uploading to S3 (us-east-1)...", "success", 200),
    ],
  },
  // 6: S3 → CloudFront
  {
    connectionId: "s3-cloudfront",
    targetNodeId:  "cloudfront",
    durationMs:    800,
    logLines: [
      log("✓", "S3 sync complete (312 objects)", "success", 0),
      log("›", "Invalidating CloudFront: /* ...", "info", 200),
    ],
  },
  // 7: CloudFront → Production
  {
    connectionId: "cloudfront-prod",
    targetNodeId:  "production",
    durationMs:    600,
    logLines: [
      log("✓", "CloudFront invalidation complete", "success", 0),
    ],
  },
] as const;

// ─── Ambient stages (fire in parallel with stage index 2) ─────────────────────

export const AMBIENT_STAGES: readonly DeploymentStage[] = [
  {
    connectionId: "actions-test",
    targetNodeId:  "test",
    durationMs:    500,
    logLines: [
      log("✓", "Tests passed (14/14)", "success", 420),
    ],
  },
  {
    connectionId: "actions-lint",
    targetNodeId:  "lint",
    durationMs:    380,
    logLines: [
      log("✓", "Lint passed (0 errors)", "success", 310),
    ],
  },
] as const;

// ─── Completion log ───────────────────────────────────────────────────────────

export const COMPLETION_LOG: LogLine = log(
  "●",
  "Live  https://your-app.cloudfront.net",
  "url",
  0
);

// ─── Cycle timing ─────────────────────────────────────────────────────────────
// Total active time = sum of all stage durations + 150ms node settle per stage.

const ACTIVE_DURATION_MS = DEPLOYMENT_STAGES.reduce(
  (sum, s) => sum + s.durationMs + 150,
  0
);

/** Total cycle length including the rest period. */
export const CYCLE_DURATION_MS = ACTIVE_DURATION_MS + 7500;

/** Stage index at which ambient stages fire in parallel. */
export const AMBIENT_FIRES_AT_STAGE = 2;
