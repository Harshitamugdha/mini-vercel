// ─── ProjectDrawer Component ───────────────────────────────────────────────────
// URL-addressable slide-out drawer (/dashboard?project={id}).
//
// Features:
//   • Phase 4: Consumes canonical DeploymentPipeline component (variant="drawer")
//   • Phase 5: Stage-specific logs viewer (GitHub ref, Actions logs, S3 sync, CloudFront)
//   • Phase 6: Failure recovery (View Logs for failed stage, Retry, Open Workflow link)
//   • Phase 7: Chronological deployment history grouping (Today, Yesterday, Dated)
//   • Phase 8: Reserved Settings tab (Environment Variables, Domains, Build Settings)

import { useState } from "react";
import {
  X,
  ExternalLink,
  GitBranch,
  RotateCw,
  Terminal,
  Settings as SettingsIcon,
  Activity,
  AlertCircle,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Key,
  Globe,
  Sliders,
} from "lucide-react";
import DeploymentPipeline from "../pipeline/DeploymentPipeline";
import Button from "../ui/Button";
import type { Project, StageId, Deployment } from "../../types/project";

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
  onRedeploy?: (projectId: string) => void;
}

type DrawerTab = "deployments" | "logs" | "settings";

export default function ProjectDrawer({
  project,
  onClose,
  onRedeploy,
}: ProjectDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("deployments");
  const [selectedStageId, setSelectedStageId] = useState<StageId>("actions");
  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2000);
  };

  if (!project) return null;

  const latestDeployment = project.latestDeployment;
  const overallStatus = latestDeployment?.overallStatus || "queued";
  const failedStage = latestDeployment?.stages.find((s) => s.status === "failed");

  // Chronological grouping helper (Phase 7)
  const groupDeploymentsByDay = (deployments: Deployment[]) => {
    const groups: { [key: string]: Deployment[] } = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    (deployments || []).forEach((dep) => {
      const depDate = new Date(dep.createdAt).toDateString();
      if (depDate === todayStr) {
        groups["Today"].push(dep);
      } else if (depDate === yesterdayStr) {
        groups["Yesterday"].push(dep);
      } else {
        groups["Earlier"].push(dep);
      }
    });

    return groups;
  };

  const groupedHistory = groupDeploymentsByDay(project.deployments || (latestDeployment ? [latestDeployment] : []));

  // Selected stage for stage-specific log viewer (Phase 5)
  const currentStageObject = latestDeployment?.stages.find((s) => s.id === selectedStageId);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl border-l border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://github.com/${project.repoOwner}.png?size=32`}
                    alt={project.repoOwner}
                    className="h-6 w-6 rounded-full border border-zinc-800"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <h2 className="font-sans text-xl font-bold text-white truncate">
                    {project.name}
                  </h2>
                  <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-xs text-zinc-400">
                    {project.framework}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-zinc-400 truncate">
                  {project.repoOwner}/{project.repoName} · {project.subdomain}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Bar */}
            <div className="mt-4 flex items-center gap-2 border-b border-zinc-800/80 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab("deployments")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                  activeTab === "deployments"
                    ? "bg-zinc-900 text-white border border-zinc-800"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-blue-400" />
                <span>Deployments</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("logs")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                  activeTab === "logs"
                    ? "bg-zinc-900 text-white border border-zinc-800"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Terminal className="h-3.5 w-3.5 text-amber-400" />
                <span>Stage Logs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                  activeTab === "settings"
                    ? "bg-zinc-900 text-white border border-zinc-800"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <SettingsIcon className="h-3.5 w-3.5 text-zinc-400" />
                <span>Settings</span>
              </button>
            </div>

            {/* TAB CONTENT 1: DEPLOYMENTS & PIPELINE */}
            {activeTab === "deployments" && (
              <div className="mt-4 space-y-4">
                {/* Latest Deployment Interactive Pipeline */}
                {latestDeployment && (
                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-400">LATEST DEPLOYMENT</span>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="font-semibold text-white">
                            #{latestDeployment.commitSha}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySha(latestDeployment.commitSha)}
                            className="text-zinc-500 hover:text-white transition-colors"
                          >
                            {copiedSha === latestDeployment.commitSha ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                          <span className="flex items-center gap-1 text-zinc-400">
                            <GitBranch className="h-3 w-3" /> {latestDeployment.branch}
                          </span>
                          <span className="rounded bg-zinc-800/50 px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">
                            {latestDeployment.triggeredBy}
                          </span>
                          <span className="text-zinc-500">
                            {latestDeployment.buildDurationSec ? `${latestDeployment.buildDurationSec}s` : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {overallStatus === "ready" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Ready</span>
                        </span>
                      )}
                      {overallStatus === "failed" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs text-rose-400">
                          <AlertCircle className="h-3 w-3" />
                          <span>Failed</span>
                        </span>
                      )}
                      {overallStatus === "running" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400">
                          <Clock className="h-3 w-3 animate-spin" />
                          <span>Building</span>
                        </span>
                      )}
                    </div>

                    {/* Metric Chips */}
                    <div className="flex gap-2">
                      <div className="rounded border border-zinc-800 px-2 py-1 font-mono text-[10px] text-zinc-400">
                        Build Duration: {latestDeployment.buildDurationSec ? `${latestDeployment.buildDurationSec}s` : '—'}
                      </div>
                      <div className="rounded border border-zinc-800 px-2 py-1 font-mono text-[10px] text-zinc-400">
                        Stages completed: {latestDeployment.stages.filter(s => s.status === 'success').length}
                      </div>
                      <div className="rounded border border-zinc-800 px-2 py-1 font-mono text-[10px] text-zinc-400">
                        Branch: {latestDeployment.branch}
                      </div>
                    </div>

                    {/* Canonical DeploymentPipeline (variant="drawer") */}
                    <DeploymentPipeline
                      stages={latestDeployment.stages}
                      variant="drawer"
                      selectedStageId={selectedStageId}
                      onSelectStage={(stageId) => {
                        setSelectedStageId(stageId);
                        setActiveTab("logs");
                      }}
                    />

                    {/* Failure Recovery Actions Box (Phase 6) */}
                    {overallStatus === "failed" && (
                      <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 space-y-2.5">
                        <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold">
                          <AlertCircle className="h-4 w-4" />
                          <span>Build failed at stage: {failedStage?.id.toUpperCase()}</span>
                        </div>

                        <p className="text-xs text-zinc-300">
                          Inspect stage build logs or re-trigger the pipeline.
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              if (failedStage) setSelectedStageId(failedStage.id);
                              setActiveTab("logs");
                            }}
                            className="text-xs py-1 px-2.5 bg-zinc-900 border-zinc-800"
                          >
                            <Terminal className="h-3.5 w-3.5 text-amber-400" />
                            <span>View Stage Logs</span>
                          </Button>

                          {failedStage?.url && (
                            <a
                              href={failedStage.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-300 hover:text-white transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Open GitHub Workflow</span>
                            </a>
                          )}

                          <Button
                            variant="primary"
                            onClick={() => onRedeploy?.(project.id)}
                            className="text-xs py-1 px-2.5"
                          >
                            <RotateCw className="h-3.5 w-3.5" />
                            <span>Retry Deployment</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Chronological Deployment History (Phase 7) */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs font-semibold uppercase text-zinc-400">
                    DEPLOYMENT HISTORY
                  </h3>

                  {Object.entries(groupedHistory).map(([dayLabel, deps]) => {
                    if (deps.length === 0) return null;

                    return (
                      <div key={dayLabel} className="space-y-2">
                        <div className="font-mono text-[10px] uppercase text-zinc-500 font-semibold tracking-wider">
                          • {dayLabel}
                        </div>

                        {deps.map((dep) => {
                          const status = dep.overallStatus;
                          return (
                            <div
                              key={dep.id}
                              className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3 font-mono text-xs hover:border-zinc-700 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="font-semibold text-white">#{dep.commitSha}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopySha(dep.commitSha);
                                    }}
                                    className="text-zinc-500 hover:text-white transition-colors"
                                  >
                                    {copiedSha === dep.commitSha ? (
                                      <Check className="h-3 w-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                                <span className="text-zinc-400 truncate max-w-[240px]">
                                  {dep.commitMessage}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className="rounded bg-zinc-800/50 px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
                                  {dep.triggeredBy}
                                </span>
                                <span className="text-[11px] text-zinc-500">
                                  {new Date(dep.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                {dep.buildDurationSec && (
                                  <span className="font-mono text-[10px] text-zinc-500">
                                    {dep.buildDurationSec}s
                                  </span>
                                )}
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    status === "ready"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                      : status === "failed"
                                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                  }`}
                                >
                                  {status.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: STAGE LOGS (Phase 5) */}
            {activeTab === "logs" && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-400">SELECT STAGE LOG:</span>
                  <div className="flex items-center gap-1.5">
                    {(["github", "actions", "s3", "cloudfront"] as StageId[]).map((sid) => (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => setSelectedStageId(sid)}
                        className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                          selectedStageId === sid
                            ? "bg-blue-600 text-white font-semibold"
                            : "bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {sid.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-bold text-white uppercase">{selectedStageId} LOG OUTPUT</span>
                    <span className="text-zinc-500">Status: {currentStageObject?.status || "pending"}</span>
                  </div>

                  {/* Stage-Specific Semantic Content (Phase 5) */}
                  {selectedStageId === "github" && (
                    <div className="space-y-2 text-zinc-300">
                      <p className="text-emerald-400">✓ Webhook Trigger Received</p>
                      <p>Commit: <span className="text-blue-400">{latestDeployment?.commitSha}</span></p>
                      <p>Branch: <span className="text-zinc-400">{project.branch}</span></p>
                      {currentStageObject?.url && (
                        <a href={currentStageObject.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:underline">
                          <span>View Commit on GitHub</span> <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {selectedStageId === "actions" && (
                    <div className="space-y-1.5 font-mono text-xs">
                      {currentStageObject?.logs ? (
                        <pre className="whitespace-pre-wrap text-zinc-300 bg-zinc-900/60 p-3 rounded border border-zinc-800/80">
                          {currentStageObject.logs}
                        </pre>
                      ) : (
                        <p className="text-zinc-500">No logs generated for Actions stage yet.</p>
                      )}
                      {currentStageObject?.url && (
                        <a href={currentStageObject.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:underline pt-2">
                          <span>Open Full GitHub Actions Run</span> <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {selectedStageId === "s3" && (
                    <div className="space-y-2 text-zinc-300">
                      <p className="text-emerald-400">✓ Amazon S3 Bucket Sync Complete</p>
                      <p className="text-zinc-400">Bucket: s3://{project.name}-prod</p>
                      <pre className="bg-zinc-900/60 p-3 rounded text-zinc-300 border border-zinc-800/80">
                        {currentStageObject?.logs || "Uploaded 847 static objects in 1.8s"}
                      </pre>
                    </div>
                  )}

                  {selectedStageId === "cloudfront" && (
                    <div className="space-y-2 text-zinc-300">
                      <p className="text-emerald-400">✓ CloudFront CDN Cache Invalidation Complete</p>
                      <p className="text-zinc-400">Live URL: <a href={`https://${project.subdomain}`} target="_blank" rel="noreferrer" className="text-blue-400 underline">https://{project.subdomain}</a></p>
                      <pre className="bg-zinc-900/60 p-3 rounded text-zinc-300 border border-zinc-800/80">
                        {currentStageObject?.logs || "Invalidation E1JKXYZ902 finished across 300+ Edge locations."}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: RESERVED SETTINGS STUBS (Phase 8) */}
            {activeTab === "settings" && (
              <div className="mt-6 space-y-5">
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
                    <Key className="h-4 w-4 text-amber-400" />
                    <span>Environment Variables</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Add build-time variables for GitHub Actions and CloudFront deployments.
                  </p>
                  <div className="rounded-lg border border-dashed border-zinc-800/80 p-5 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-zinc-300">No environment variables configured</p>
                      <p className="text-[11px] text-zinc-500">Build-time variables will be injected into your GitHub Actions workflow.</p>
                    </div>
                    <Button variant="ghost" disabled title="Coming soon" className="text-xs py-1 px-3 border border-zinc-800 bg-zinc-900/40 text-zinc-400">
                      + Add Variable
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <span>Custom Domains</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Connect your custom CNAME or CloudFront edge distribution domains.
                  </p>
                  <div className="rounded-lg border border-dashed border-zinc-800/80 p-5 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="space-y-1">
                      <p className="font-mono text-xs text-zinc-300">No custom domains configured</p>
                      <p className="text-[11px] text-zinc-500">Connect a custom CNAME to your CloudFront distribution.</p>
                    </div>
                    <Button variant="ghost" disabled title="Coming soon" className="text-xs py-1 px-3 border border-zinc-800 bg-zinc-900/40 text-zinc-400">
                      + Add Domain
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-white">
                    <Sliders className="h-4 w-4 text-emerald-400" />
                    <span>Build & Development Settings</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Configure build command, root directory, and output directory.
                  </p>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-400 space-y-1">
                    <p>Build Command: <span className="text-white">npm run build</span></p>
                    <p>Output Directory: <span className="text-white">dist</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="mt-8 border-t border-zinc-800 pt-4 flex items-center justify-between">
            <a
              href={`https://${project.subdomain}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-blue-400 hover:underline"
            >
              <span>Visit Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <Button
              variant="ghost"
              onClick={() => onRedeploy?.(project.id)}
              className="border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-zinc-700"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Redeploy</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
