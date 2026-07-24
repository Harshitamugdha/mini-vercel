// ─── ImportRepoModal Component ────────────────────────────────────────────────
// GitHub repository import modal with repo search, configuration fields,
// and a 2-second animated ConnectingPipelinePreview upon deployment trigger.

import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import {
  Search,
  X,
  Lock,
  Globe,
  GitBranch,
  ArrowRight,
  Terminal,
  Folder,
  Sparkles,
} from "lucide-react";
import Button from "../ui/Button";
import MiniPipelineStrip from "./MiniPipelineStrip";
import { getRepositories } from "../../services/githubService";
import type { GitHubRepoOption, ImportRepoPayload} from "../../types/project";
type PreviewPipelineStage = {
  id: "github" | "actions" | "s3" | "cloudfront";
  name: string;
  status: "idle" | "building" | "success" | "failed";
};
interface ImportRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: ImportRepoPayload) => void;
}

const INITIAL_PREVIEW_STAGES: PreviewPipelineStage[] = [
  { id: "github", name: "GitHub", status: "success" },
  { id: "actions", name: "Actions", status: "building" },
  { id: "s3", name: "S3", status: "idle" },
  { id: "cloudfront", name: "CloudFront", status: "idle" },
];

export default function ImportRepoModal({
  isOpen,
  onClose,
  onConfirm,
}: ImportRepoModalProps) {
  const [repos, setRepos] = useState<GitHubRepoOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepoOption | null>(null);

  // Configuration fields
  const [branch, setBranch] = useState("main");
  const [framework, setFramework] = useState("Vite / React");
  const [buildCommand, setBuildCommand] = useState("npm run build");
  const [outputDir, setOutputDir] = useState("dist");

  // Pipeline Preview state
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
  if (!isOpen) return;

  setLoading(true);

  getRepositories()
    .then((data) => {
      setRepos(data);

      if (data.length > 0) {
        setSelectedRepo(data[0]);
      }
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });
}, [isOpen]);

  if (!isOpen) return null;

  const filteredRepos = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return;

    setIsDeploying(true);

    // 2-second animated pipeline preview before submitting
    setTimeout(() => {
      onConfirm({
  githubRepoId: selectedRepo.id,

  repoOwner: selectedRepo.owner,
  repoName: selectedRepo.name,
  branch: branch || selectedRepo.defaultBranch || "main",

  framework,
  buildCommand,
  outputDirectory: outputDir,
});
      setIsDeploying(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-white">
              <FaGithub className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-sans text-lg font-bold text-white">
                Import GitHub Repository
              </h2>
              <p className="font-mono text-xs text-zinc-400">
                Connect a repo to deploy your 4-stage pipeline
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isDeploying ? (
          /* Connecting Pipeline Preview (~2s animation) */
          <div className="my-10 flex flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 mb-4 animate-pulse">
              <Sparkles className="h-6 w-6" />
            </div>

            <h3 className="text-lg font-bold text-white">
              Initializing Pipeline for {selectedRepo?.name}...
            </h3>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              Connecting GitHub Webhook → Dispatching Actions Runner
            </p>

            <div className="mt-6 w-full max-w-md">
              <MiniPipelineStrip stages={INITIAL_PREVIEW_STAGES}  />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            {/* Repo Search & Selector */}
            <div>
              <label className="mb-2 block font-mono text-xs text-zinc-300">
                SELECT REPOSITORY
              </label>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-4 py-2 font-mono text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                {loading ? (
                  <p className="py-4 font-mono text-xs text-zinc-500 text-center">
                    Loading GitHub repositories...
                  </p>
                ) : filteredRepos.length === 0 ? (
                  <p className="py-4 font-mono text-xs text-zinc-500 text-center">
                    No repositories found matching "{search}"
                  </p>
                ) : (
                  filteredRepos.map((repo) => {
                    const isSelected = selectedRepo?.id === repo.id;
                    return (
                      <div
                        key={repo.id}
                        onClick={() => setSelectedRepo(repo)}
                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-all ${
                          isSelected
                            ? "border-blue-500/60 bg-blue-500/10 text-white"
                            : "border-zinc-800/80 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                        }`}
                      >
                       <div className="min-w-0 flex-1">
  <div className="flex items-center gap-2.5">
    {repo.isPrivate ? (
      <Lock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
    ) : (
      <Globe className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
    )}

    <span className="truncate font-mono text-xs font-semibold">
      {repo.fullName}
    </span>
  </div>

  {repo.description && (
    <p className="mt-1 truncate font-sans text-[11px] text-zinc-500">
      {repo.description}
    </p>
  )}
</div>

                        <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 shrink-0">
                          <span className="rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5">
                            {repo.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            {repo.defaultBranch}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Build Settings */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-mono text-xs text-zinc-400">
                  PRODUCTION BRANCH
                </label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-3 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs text-zinc-400">
                  FRAMEWORK PRESET
                </label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Vite / React">Vite / React</option>
                  <option value="Next.js">Next.js</option>
                  <option value="Create React App">Create React App</option>
                  <option value="Node.js API">Node.js API</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs text-zinc-400">
                  BUILD COMMAND
                </label>
                <div className="relative">
                  <Terminal className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={buildCommand}
                    onChange={(e) => setBuildCommand(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-3 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-mono text-xs text-zinc-400">
                  OUTPUT DIRECTORY
                </label>
                <div className="relative">
                  <Folder className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={outputDir}
                    onChange={(e) => setOutputDir(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-3 py-2 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
              <Button variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>

              <Button
                variant="primary"
                type="submit"
                disabled={!selectedRepo || isDeploying}
              >
                <span>Import & Deploy</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
