// ─── EmptyProjects Component ──────────────────────────────────────────────────
// Redesigned empty state anchored by a dim/unfilled version of the 4-stage pipeline strip.
// Replaces generic folder icons with Mini Vercel's signature visual identity.

import { FolderPlus, BookOpen } from "lucide-react";
import Button from "../ui/Button";
import MiniPipelineStrip from "./MiniPipelineStrip";

interface EmptyProjectsProps {
  onImportClick?: () => void;
}

export default function EmptyProjects({ onImportClick }: EmptyProjectsProps) {
  return (
    <div className="mx-auto my-12 flex max-w-[460px] flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-10 text-center shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Subtle radial background glow */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      {/* Signature 4-Stage Pipeline Strip (Dim / Unfilled Anchor) */}
      <div className="w-full mb-6 relative drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        <MiniPipelineStrip overallStatus="queued" />
      </div>

      <h3 className="font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">
        No projects yet
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        Connect a GitHub repository to light up your first deployment pipeline.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3 w-full sm:w-auto z-10">
        <Button variant="primary" onClick={onImportClick} className="w-full justify-center animate-[pulse_3s_ease-in-out_infinite]">
          <FolderPlus className="h-4 w-4" />
          <span>Import Repository</span>
        </Button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>or import via Git URL · View docs</span>
        </a>
      </div>
    </div>
  );
}