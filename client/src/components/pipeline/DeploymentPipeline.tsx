// ─── Canonical DeploymentPipeline Component ───────────────────────────────────
// Single canonical pipeline component for Mini Vercel (resolves pipeline tech debt).
// Consolidates Card, Drawer, and Static representations driven directly from Deployment.stages.
//
// Features:
//   • Variants: "card" | "drawer" | "full" | "static"
//   • Accessibility: Text + Shape status badges (never color alone), aria-live announcements
//   • Motion: Respects prefers-reduced-motion / motionLevel="static"
//   • Selection: Interactive stage node selection in "drawer" mode

import React from "react";
import { FaGithub } from "react-icons/fa";
import { Cpu, Database, Globe, Check, X, Loader2, Minus } from "lucide-react";
import type { PipelineStage, StageId, OverallStatus } from "../../types/project";
import { computeOverallStatus } from "../../types/project";

export interface DeploymentPipelineProps {
  stages: PipelineStage[];
  variant?: "card" | "drawer" | "full" | "static";
  selectedStageId?: StageId;
  onSelectStage?: (stageId: StageId) => void;
  motionLevel?: "auto" | "static";
  compact?: boolean;
  overallStatus?: OverallStatus;
}

const STAGE_META: Record<StageId, { label: string; icon: React.ReactNode }> = {
  github: { label: "GitHub", icon: <FaGithub className="h-3.5 w-3.5" /> },
  actions: { label: "Actions", icon: <Cpu className="h-3.5 w-3.5" /> },
  s3: { label: "Amazon S3", icon: <Database className="h-3.5 w-3.5" /> },
  cloudfront: { label: "CloudFront", icon: <Globe className="h-3.5 w-3.5" /> },
};

export default function DeploymentPipeline({
  stages,
  variant = "card",
  selectedStageId,
  onSelectStage,
  motionLevel = "auto",
  compact = false,
  overallStatus: overallStatusProp,
}: DeploymentPipelineProps) {
  // Prefer the prop (backend-derived); only compute locally for aria-live fallback
  const overallStatus: OverallStatus = overallStatusProp ?? computeOverallStatus(stages);
  const isStatic = motionLevel === "static";

  return (
    <div
      role="region"
      aria-label="Deployment Pipeline Status"
      className={`w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 font-mono text-xs shadow-inner ${
        variant === "drawer" ? "p-4" : "p-3"
      }`}
    >
      {/* Polite ARIA Live announcement for status changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Deployment pipeline status: {overallStatus}. Stages:{" "}
        {stages.map((s) => `${s.id}: ${s.status}`).join(", ")}
      </div>

      <div className="flex items-center justify-between gap-0.5">
        {stages.map((stage, idx) => {
          const isLast = idx === stages.length - 1;
          const meta = STAGE_META[stage.id] || { label: stage.id, icon: <FaGithub className="h-3.5 w-3.5" /> };
          const isSelected = selectedStageId === stage.id;

          const isSuccess = stage.status === "success";
          const isFailed = stage.status === "failed";
          const isRunning = stage.status === "running";
          const isSkipped = stage.status === "skipped";

          const nextStage = stages[idx + 1];
          const isLineActive = isSuccess && nextStage && nextStage.status !== "pending";
          const isLineRunning = isSuccess && nextStage && nextStage.status === "running";
          const isLineFailed = isSuccess && nextStage && nextStage.status === "failed";

          let titleText = `${meta.label}: ${stage.status}`;
          if (stage.startedAt) {
            titleText += `\nStarted: ${new Date(stage.startedAt).toLocaleTimeString()}`;
          }
          if (stage.endedAt) {
            titleText += `\nEnded: ${new Date(stage.endedAt).toLocaleTimeString()}`;
          }
          if (stage.startedAt && stage.endedAt) {
            const start = new Date(stage.startedAt).getTime();
            const end = new Date(stage.endedAt).getTime();
            const durationSec = Math.round((end - start) / 1000);
            titleText += `\nDuration: ${durationSec}s`;
          }

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Node */}
              <button
                type="button"
                disabled={variant !== "drawer"}
                onClick={() => onSelectStage?.(stage.id)}
                aria-label={`Pipeline stage ${meta.label}: ${stage.status}`}
                title={titleText}
                aria-selected={isSelected}
                className={`group relative flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 transition-all ${
                  variant === "drawer" ? "cursor-pointer hover:scale-105" : "cursor-default"
                }`}
              >
                <div
                  className={`relative flex items-center justify-center rounded-lg border transition-all duration-300 ${
                    variant === "drawer" ? "h-10 w-10" : "h-8 w-8"
                  } ${
                    isSelected ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-950" : ""
                  } ${
                    isSuccess
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      : isFailed
                      ? "border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]" +
                        (!isStatic ? " animate-pulse" : "")
                      : isRunning
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]" +
                        (!isStatic ? " animate-pulse" : "")
                      : isSkipped
                      ? "border-zinc-700 bg-zinc-800/40 text-zinc-500"
                      : "border-zinc-800/80 bg-zinc-900/60 text-zinc-600"
                  }`}
                >
                  {meta.icon}

                  {/* Text + Shape status badge overlay (Never color alone!) */}
                  {isSuccess && (
                    <span
                      title="Success (Check)"
                      className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-zinc-950"
                    >
                      <Check className="h-2 w-2 stroke-[3]" />
                    </span>
                  )}
                  {isFailed && (
                    <span
                      title="Failed (X)"
                      className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white"
                    >
                      <X className="h-2 w-2 stroke-[3]" />
                    </span>
                  )}
                  {isRunning && (
                    <span
                      title="Running (Spinner)"
                      className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] text-zinc-950"
                    >
                      <Loader2 className={`h-2 w-2 stroke-[3] ${!isStatic ? "animate-spin" : ""}`} />
                    </span>
                  )}
                  {isSkipped && (
                    <span
                      title="Skipped (Dash)"
                      className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-zinc-700 text-[8px] text-zinc-300"
                    >
                      <Minus className="h-2 w-2 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Stage Text Label */}
                {!compact && (
                  <span
                    className={`text-[10px] font-medium tracking-tight ${
                      isSuccess
                        ? "text-emerald-400/90"
                        : isFailed
                        ? "text-rose-400 font-semibold"
                        : isRunning
                        ? "text-amber-400 font-semibold"
                        : "text-zinc-500"
                    }`}
                  >
                    {meta.label}
                  </span>
                )}
              </button>

              {/* Inter-Node Trace Line */}
              {!isLast && (
                <div className="relative flex-1 px-0.5">
                  <div className="h-[2px] w-full overflow-hidden rounded-full bg-zinc-800/80">
                    <div
                      className={`h-full w-full transition-all duration-500 ${
                        isLineFailed
                          ? "bg-gradient-to-r from-emerald-500 to-rose-500"
                          : isLineRunning
                          ? "bg-gradient-to-r from-emerald-500 via-amber-400 to-zinc-800" +
                            (!isStatic ? " animate-pulse" : "")
                          : isLineActive
                          ? "bg-emerald-500"
                          : "bg-zinc-800/80"
                      }`}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
