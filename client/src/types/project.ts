// ─── Pipeline & Project Data Model (Phase 2) ───────────────────────────────────
// Single source of truth for pipeline stages, deployments, and projects.
// overallStatus is STRICTLY DERIVED from stages — never stored or set independently.

export type StageId = "github" | "actions" | "s3" | "cloudfront";

export type StageStatus = "pending" | "running" | "success" | "failed" | "skipped";

export type OverallStatus = "queued" | "running" | "ready" | "failed";

export interface PipelineStage {
  id: StageId;
  status: StageStatus;
  startedAt: string | null; // ISO timestamp, null until started
  endedAt: string | null;   // ISO timestamp, null until finished
  logs?: string;             // stage-specific log output
  url?: string;              // external link (commit URL, workflow URL, live site URL)
}

export interface Deployment {
  id: string;
  projectId: string;
  commitSha: string;
  commitMessage: string;
  branch: string;
  triggeredBy: "push" | "manual" | "retry";
  stages: PipelineStage[];
  overallStatus: OverallStatus; // Computed via computeOverallStatus
  createdAt: string;            // ISO timestamp
  url?: string;
  buildDurationSec?: number;
}

export interface Project {
  id: string;
  name: string;
  repoOwner: string;
  repoName: string;
  branch: string;
  subdomain: string;
  framework: string;
  deployToken?: string;
  latestDeploymentId: string | null;
  latestDeployment?: Deployment;
  deployments?: Deployment[];
  updatedAt: string;
}
export interface ImportRepoPayload {
  githubRepoId: number;

  repoOwner: string;

  repoName: string;

  branch: string;

  framework: string;

  buildCommand?: string;

  outputDirectory?: string;
}
export interface GitHubRepoOption {
  id: number;
  name: string;
  owner: string;
  fullName: string;

  isPrivate: boolean;

  defaultBranch: string;

  updatedAt: string;

  language: string | null;

  description?: string;
}
/**
 * MANDATORY DERIVATION RULE (Phase 2):
 * Computes overallStatus from stages array. Never set independently!
 */
export function computeOverallStatus(stages: PipelineStage[]): OverallStatus {
  if (!stages || stages.length === 0) return "queued";
  if (stages.some((s) => s.status === "failed")) return "failed";
  if (stages.every((s) => s.status === "success" || s.status === "skipped")) return "ready";
  if (stages.some((s) => s.status === "running")) return "running";
  return "queued";
}

/** Default initial 4-stage pipeline array */
export function createDefaultStages(): PipelineStage[] {
  return [
    { id: "github", status: "pending", startedAt: null, endedAt: null, url: "https://github.com" },
    { id: "actions", status: "pending", startedAt: null, endedAt: null },
    { id: "s3", status: "pending", startedAt: null, endedAt: null },
    { id: "cloudfront", status: "pending", startedAt: null, endedAt: null },
  ];
}
