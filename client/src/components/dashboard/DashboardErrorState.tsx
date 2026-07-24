// ─── DashboardErrorState Component ────────────────────────────────────────────
// Dedicated error state for failed data fetches (distinct from empty states and build failures).

import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "../ui/Button";

interface DashboardErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function DashboardErrorState({
  message = "Failed to load projects. Please check your connection.",
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="mx-auto my-12 flex max-w-md flex-col items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 p-8 text-center backdrop-blur-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold text-white">Couldn't load projects</h3>
      <p className="mt-2 text-sm text-zinc-400">{message}</p>

      {onRetry && (
        <div className="mt-6">
          <Button variant="primary" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </div>
      )}
    </div>
  );
}
