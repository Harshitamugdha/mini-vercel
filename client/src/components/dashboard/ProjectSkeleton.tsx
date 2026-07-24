// ─── ProjectSkeleton Component ────────────────────────────────────────────────
// Skeleton loading cards at identical dimensions to populated ProjectCards to prevent layout shift.
// Pipeline dots remain static (not shimmering) per spec so they don't falsely imply active builds.

export default function ProjectSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-lg">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-zinc-800" />
            <div className="h-3 w-28 animate-pulse rounded bg-zinc-800/60" />
          </div>
          <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-800" />
        </div>

        {/* Live Link Skeleton */}
        <div className="mt-4">
          <div className="h-4 w-52 animate-pulse rounded bg-zinc-800/80" />
        </div>

        {/* Git Meta Line Skeleton */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-5 w-16 animate-pulse rounded bg-zinc-800/60" />
          <div className="h-5 w-16 animate-pulse rounded bg-zinc-800/60" />
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-800/40" />
        </div>
      </div>

      {/* Pipeline Strip Skeleton (STATIC dots, no shimmering) */}
      <div className="mt-5 border-t border-zinc-800/60 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-3 w-24 rounded bg-zinc-800/60" />
          <div className="h-3 w-16 rounded bg-zinc-800/60" />
        </div>

        <div className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg border border-zinc-800/80 bg-zinc-900/60 text-zinc-700 flex items-center justify-center font-mono text-xs">
                  ●
                </div>
                {i < 4 && <div className="h-[2px] w-12 bg-zinc-800/80" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
