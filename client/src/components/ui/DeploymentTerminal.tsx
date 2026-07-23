// ─── DeploymentTerminal (v2) ──────────────────────────────────────────────────
// The terminal is now a pure presentational component.
// It has NO internal timer and NO own animation state.
// All log lines and the cycle key come from the deployment timeline hook
// via Hero.tsx — guaranteeing it is always in sync with the topology.
//
// Visual changes from v1:
//   • macOS three-dot chrome replaced with a deployment console header
//   • Run counter and [running/live] status badge
//   • Divider line instead of colored dots
//   • URL line rendered larger + slow-breathing dot

import type { LogLine } from "../types/topology";

// ─── Props ────────────────────────────────────────────────────────────────────

interface DeploymentTerminalProps {
  logLines:   LogLine[];
  isComplete: boolean;
  cycleKey:   number;
  runNumber?: number;
}

// ─── Color maps ───────────────────────────────────────────────────────────────

const TEXT_COLOR: Record<LogLine["status"], string> = {
  cmd:     "text-zinc-100",
  info:    "text-zinc-400",
  success: "text-emerald-400",
  url:     "text-blue-400",
  warn:    "text-amber-400",
};

const PREFIX_COLOR: Record<LogLine["status"], string> = {
  cmd:     "text-zinc-500",
  info:    "text-zinc-600",
  success: "text-emerald-600",
  url:     "text-blue-500",
  warn:    "text-amber-500",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DeploymentTerminal({
  logLines,
  isComplete,
  cycleKey,
  runNumber = 47,
}: DeploymentTerminalProps) {
  const statusLabel = isComplete ? "live" : "running";
  const statusColor = isComplete ? "text-emerald-400" : "text-blue-400";
  const dotColor    = isComplete ? "bg-emerald-400"   : "bg-blue-500";

  return (
    <div
      aria-label="Live deployment log"
      className="w-full max-w-[640px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 shadow-2xl"
    >
      {/* ── Console header ── */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        {/* Left: pipeline identity */}
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
          <span className="text-zinc-600">▸</span>
          <span>mini-vercel</span>
          <span className="text-zinc-700">/</span>
          <span>pipeline</span>
        </div>

        {/* Right: status + run number */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            <span className={statusColor}>[{statusLabel}]</span>
          </div>
          <span className="text-zinc-700">run #{runNumber}</span>
        </div>
      </div>

      {/* ── Log body ── */}
      <div className="min-h-[210px] space-y-1.5 p-4 font-mono text-sm">
        <div data-cycle={cycleKey}>
          {logLines.map((line, i) => (
            <div
              key={`${cycleKey}-${i}`}
              className={`flex items-baseline gap-3 ${
                line.status === "url" ? "mt-2" : ""
              }`}
            >
              {/* Prefix */}
              <span className={`w-4 shrink-0 select-none text-center text-xs ${PREFIX_COLOR[line.status]}`}>
                {line.prefix}
              </span>

              {/* Text — URL line is slightly larger */}
              <span
                className={`${TEXT_COLOR[line.status]} ${
                  line.status === "url" ? "text-sm font-medium" : ""
                }`}
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>

        {/* Blinking cursor while build is in progress */}
        {!isComplete && logLines.length > 0 && (
          <div className="flex items-baseline gap-3">
            <span className="w-4 shrink-0 select-none text-center text-xs text-zinc-700">›</span>
            <span className="inline-block h-3.5 w-1.5 translate-y-0.5 rounded-sm bg-zinc-600" />
          </div>
        )}
      </div>
    </div>
  );
}
