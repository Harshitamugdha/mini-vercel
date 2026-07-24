
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FolderPlus, Search, ArrowUpDown, RefreshCw } from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProjectGrid from "../components/dashboard/ProjectGrid";
import ProjectDrawer from "../components/dashboard/ProjectDrawer";
import ImportRepoModal from "../components/dashboard/ImportRepoModal";
import Button from "../components/ui/Button";
import type { Project, ImportRepoPayload } from "../types/project";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  createProject,
  getProjects,
  deleteProject,
    redeployProject,
} from "../services/projectApi";
export default function Dashboard() {
    const navigate = useNavigate();
const { user, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"updated" | "name" | "status">("updated");

  // Import Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // URL-addressable Drawer state (?project={id})
  const activeProjectId = searchParams.get("project");
  const selectedProject = projects.find((p) => p.id === activeProjectId || p.name === activeProjectId) || null;
    
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProjects();

setProjects(response.projects);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
  if (!authLoading && !user) {
    navigate("/");
  }
}, [authLoading, user, navigate]);
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenDrawer = (projectId: string) => {
    setSearchParams({ project: projectId });
  };

  const handleCloseDrawer = () => {
    setSearchParams({});
  };
const handleImportConfirm = async (payload: ImportRepoPayload) => {
  console.log("Import payload:", payload);

  try {
    console.log("Calling createProject...");

    const response = await createProject(payload);

    console.log("Response:", response);

    if (response.success) {
      await fetchProjects();
    }
  } catch (err) {
    console.error("Create project failed:", err);
  }
};
  const handleRedeploy = async (
    projectId: string
) => {
    try {
        await redeployProject(projectId);

        await fetchProjects();
    } catch (err) {
        console.error(err);
    }
};
const handleDeleteProject = async (projectId: string) => {
  try {
    await deleteProject(projectId);

    setProjects((prev) =>
      prev.filter((project) => project.id !== projectId)
    );

    // Close drawer if deleted project is open
    if (selectedProject?.id === projectId) {
      handleCloseDrawer();
    }
  } catch (err) {
    console.error("Failed to delete project:", err);
  }
};
  // Filter & Sort logic
  const filteredProjects = projects
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.repoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.framework.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "status") {
        const statusA = a.latestDeployment?.overallStatus || "";
        const statusB = b.latestDeployment?.overallStatus || "";
        return statusA.localeCompare(statusB);
      }
      return 0; // Default: recently updated order
    });
    if (authLoading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
      Loading...
    </div>
  );
}
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* App Shell Header */}
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Projects
              </h1>
              {!loading && (
                <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 font-mono text-xs text-zinc-400">
                  {projects.length} {projects.length === 1 ? "project" : "projects"}
                </span>
              )}
            </div>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              Manage and monitor your transparent 4-stage cloud pipelines
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchProjects}
              className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
              title="Refresh projects"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              <FolderPlus className="h-4 w-4" />
              <span>Import Repository</span>
            </Button>
          </div>
        </div>

        {/* Toolbar: Local Search & Sort */}
        <div className="my-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter projects by name or framework..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 pl-9 pr-3 py-2 font-mono text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 shrink-0">
            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="updated">Recently Updated</option>
              <option value="name">Name</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Responsive Project Grid */}
        <ProjectGrid
          projects={filteredProjects}
          loading={loading}
          error={error}
          onRetry={fetchProjects}
          onImportClick={() => setIsModalOpen(true)}
          onOpenDrawer={handleOpenDrawer}
          onRedeploy={handleRedeploy}
          onDelete={handleDeleteProject}
        />
      </main>

      {/* URL-Addressable Project Drawer (?project={id}) */}
      <ProjectDrawer
        project={selectedProject}
        onClose={handleCloseDrawer}
        onRedeploy={handleRedeploy}
      />

      {/* Repository Import Modal */}
      <ImportRepoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleImportConfirm}
      />
    </div>
  );
}