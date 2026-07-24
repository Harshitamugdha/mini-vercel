// ─── MiniPipelineStrip Wrapper ────────────────────────────────────────────────
// Refactored wrapper using the canonical DeploymentPipeline component (variant="card").
// Resolves pipeline component duplication tech debt.
import DeploymentPipeline from "../pipeline/DeploymentPipeline";

import type {
  PipelineStage,
  StageStatus,
  StageId,
  OverallStatus,
} from "../../types/project";
type LegacyStage = {
  id: StageId;
  name?: string;
  status:
    | "idle"
    | "building"
    | "running"
    | "success"
    | "failed"
    | "pending"
    | "skipped";
};

interface MiniPipelineStripProps {
  stages?: LegacyStage[] | PipelineStage[];
  overallStatus?: OverallStatus;
  compact?: boolean;
}
export default function MiniPipelineStrip({
  stages,
  compact = false,
}: MiniPipelineStripProps) {
  // Normalize stages to Phase 2 PipelineStage format
  const normalizedStages: PipelineStage[] = (stages || []).map((s: any) => {
    let status: StageStatus = "pending";
    if (s.status === "success") status = "success";
    else if (s.status === "failed") status = "failed";
    else if (s.status === "building" || s.status === "running") status = "running";
    else if (s.status === "skipped") status = "skipped";

    return {
      id: s.id as StageId,
      status,
      startedAt: s.startedAt || null,
      endedAt: s.endedAt || null,
      logs: s.logs,
      url: s.url,
    };
  });

  // Fallback default 4 stages if empty
  const finalStages: PipelineStage[] = normalizedStages.length === 4 ? normalizedStages : [
    { id: "github", status: "pending", startedAt: null, endedAt: null },
    { id: "actions", status: "pending", startedAt: null, endedAt: null },
    { id: "s3", status: "pending", startedAt: null, endedAt: null },
    { id: "cloudfront", status: "pending", startedAt: null, endedAt: null },
  ];

  return <DeploymentPipeline stages={finalStages} variant="card" compact={compact} />;
}
