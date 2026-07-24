// ─── ProjectGrid Component ───────────────────────────────────────────────────
// Responsive project grid component rendering cards, skeletons, empty states, or error states.

import ProjectCard from "./ProjectCard";
import ProjectSkeleton from "./ProjectSkeleton";
import DashboardErrorState from "./DashboardErrorState";
import EmptyProjects from "./EmptyProjects";
import type { Project } from "../../types/project";

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onImportClick?: () => void;
  onOpenDrawer: (projectId: string) => void;
  onRedeploy?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
}

export default function ProjectGrid({
  projects,
  loading,
  error,
  onRetry,
  onImportClick,
  onOpenDrawer,
  onRedeploy,
    onDelete,
}: ProjectGridProps) {
  if (error) {
    return <DashboardErrorState message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectSkeleton />
        <ProjectSkeleton />
        <ProjectSkeleton />
      </div>
    );
  }

  if (projects.length === 0) {
    return <EmptyProjects onImportClick={onImportClick} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onOpenDrawer={onOpenDrawer}
          onRedeploy={onRedeploy}
        onDelete={onDelete}
        />
      ))}
    </div>
  );
}
