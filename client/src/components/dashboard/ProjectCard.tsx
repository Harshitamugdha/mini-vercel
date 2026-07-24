// ─── ProjectCard Component (Phase 4 Glanceable Model) ─────────────────────────
// Glanceable card design: clicking the card opens the URL-addressable Drawer.
// Quick-action Redeploy is the sole direct button target to avoid overlapping click targets.

import React from "react";
import {
  GitBranch,
  RotateCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import MiniPipelineStrip from "./MiniPipelineStrip";
import type { Project } from "../../types/project";
interface ProjectCardProps {
  project: Project;
  onOpenDrawer: (projectId: string) => void;
  onRedeploy?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
}
export default function ProjectCard({
  project,
  onOpenDrawer,
  onRedeploy,
  onDelete,
}: ProjectCardProps) {
  const latestDeployment = project.latestDeployment;
  const stages = latestDeployment?.stages || [];
  const status = latestDeployment?.overallStatus || "queued";
  const failedStage = stages.find((s) => s.status === "failed");

  return (
    <div
      onClick={() => onOpenDrawer(project.id)}
      tabIndex={0}
      role="button"
      aria-label={`Open project details for ${project.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDrawer(project.id);
        }
      }}
      className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-zinc-700/80 hover:bg-zinc-900/90 hover:shadow-2xl hover:shadow-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div>
        {/* Top Header: Name + Status Badge + Quick-Action Redeploy */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-sans text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                {project.name}
              </h3>
              <span className="inline-flex items-center rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                {project.framework}
              </span>
            </div>

            <p className="mt-1 font-mono text-xs text-zinc-400 truncate">
              {project.repoOwner}/{project.repoName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge (Text + Shape) */}
            {status === "ready" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>Ready</span>
              </span>
            )}

            {status === "running" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Building</span>
              </span>
            )}

            {status === "failed" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400">
                <AlertCircle className="h-3 w-3" />
                <span>Failed</span>
              </span>
            )}

            {status === "queued" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400">
                <Clock className="h-3 w-3" />
                <span>Queued</span>
              </span>
            )}

            {/* Sole Quick-Action Button: Redeploy (Phase 4 Model) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Don't trigger drawer open
                onRedeploy?.(project.id);
              }}
              aria-label={`Redeploy ${project.name}`}
              className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-1.5 text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
              title="Redeploy Pipeline"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
            <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();

    const confirmed = window.confirm(
      `Delete "${project.name}"?\n\nAll deployments will also be deleted.`
    );

    if (confirmed) {
      onDelete?.(project.id);
    }
  }}
  aria-label={`Delete ${project.name}`}
  title="Delete Project"
  className="rounded-lg border border-rose-900/60 bg-rose-950/30 p-1.5 text-rose-400 transition-colors hover:border-rose-700 hover:bg-rose-900/40 hover:text-rose-300"
>
  <Trash2 className="h-3.5 w-3.5" />
</button>
          </div>
        </div>

        {/* Live URL Subdomain Preview */}
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-blue-400 group-hover:text-blue-300 transition-colors">
            <span className="truncate">https://{project.subdomain}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </span>
        </div>

        {/* Git Metadata Line */}
        <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-0.5 text-zinc-300 font-medium">
            <GitBranch className="h-3 w-3 text-zinc-400" />
            {project.branch}
          </span>
          {latestDeployment && (
            <>
              <span className="rounded bg-zinc-950 px-1.5 py-0.5 text-zinc-400 border border-zinc-800">
                #{latestDeployment.commitSha}
              </span>
              <span className="text-zinc-400 truncate max-w-[180px]">
                {latestDeployment.commitMessage}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Signature 4-Stage Mini Pipeline Strip (Canonical Wrapper) */}
      <div className="mt-5 border-t border-zinc-800/60 pt-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase text-zinc-400">
          <span>PIPELINE STATUS</span>
          {status === "failed" ? (
            <span className="text-rose-400 font-semibold">
              FAILED AT {failedStage?.id.toUpperCase() || "STAGE"}
            </span>
          ) : status === "running" ? (
            <span className="text-amber-400 font-semibold">EXECUTING MATRIX...</span>
          ) : (
            <span className="text-emerald-400">4 / 4 COMPLETE</span>
          )}
        </div>

        <MiniPipelineStrip stages={stages} />
      </div>
    </div>
  );
}
