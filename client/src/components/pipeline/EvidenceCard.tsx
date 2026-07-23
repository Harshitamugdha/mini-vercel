import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import type { EvidenceConfig } from "./pipelineConfig";
import type { StagePhase } from "../motion/useDeploymentJourney";

interface EvidenceCardProps {
  evidence: EvidenceConfig;
  phase: StagePhase;
  onComplete?: () => void;
}

const LINE_COLORS: Record<string, string> = {
  cmd: "text-zinc-100 font-medium",
  info: "text-blue-300",
  success: "text-emerald-300",
  url: "text-emerald-300 font-semibold",
  dim: "text-zinc-400",
};

const PREFIX_COLORS: Record<string, string> = {
  cmd: "text-zinc-500",
  info: "text-blue-500",
  success: "text-emerald-500",
  url: "text-emerald-400",
  dim: "text-zinc-600",
};

function emptyLines(evidence: EvidenceConfig): string[] {
  return evidence.lines.map(() => "");
}

export default function EvidenceCard({ evidence, phase, onComplete }: EvidenceCardProps) {
  const [typedLines, setTypedLines] = useState<string[]>(() => emptyLines(evidence));
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);
  const displayLinesRef = useRef<string[]>(emptyLines(evidence));
  const frameRef = useRef<number | null>(null);
  const lineRef = useRef(0);
  const charRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const empty = emptyLines(evidence);
    displayLinesRef.current = empty;
    setTypedLines(empty);
    setDone(false);
    startedRef.current = false;
    completedRef.current = false;
    lineRef.current = 0;
    charRef.current = 0;
    lastRef.current = 0;
  }, [evidence]);

  useEffect(() => {
    if (phase === "waiting" || startedRef.current || done) return;
    startedRef.current = true;
    lastRef.current = performance.now();

    const tick = (now: number) => {
      const lineIndex = lineRef.current;
      const currentLine = evidence.lines[lineIndex];
      if (!currentLine) {
        if (completedRef.current) return;
        completedRef.current = true;
        setDone(true);
        onCompleteRef.current?.();
        return;
      }

      const cadence = currentLine.type === "cmd" ? 32 : 24;
      if (now - lastRef.current >= cadence) {
        const steps = Math.max(1, Math.floor((now - lastRef.current) / cadence));
        lastRef.current = now;
        charRef.current = Math.min(currentLine.text.length, charRef.current + steps);

        displayLinesRef.current[lineIndex] = currentLine.text.slice(0, charRef.current);
        setTypedLines([...displayLinesRef.current]);

        if (charRef.current >= currentLine.text.length) {
          displayLinesRef.current[lineIndex] = currentLine.text;
          setTypedLines([...displayLinesRef.current]);
          lineRef.current += 1;
          charRef.current = 0;
          lastRef.current = now + (currentLine.type === "cmd" ? 220 : 150);
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [done, evidence.lines, phase]);

  const isComplete = phase === "complete" || done;
  const variants: Variants = {
    waiting: { opacity: 0, y: 18, scale: 0.96, rotateX: -3, filter: "blur(10px)" },
    playing: { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" },
    complete: { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" },
  };

  return (
    <motion.div
      variants={variants}
      initial="waiting"
      animate={phase}
      transition={{ type: "spring", stiffness: 190, damping: 24, mass: 0.85 }}
      className="relative w-full origin-top overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/85 shadow-2xl shadow-black/40 backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(59,130,246,0.18),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_42%)]" />

      <div className="relative flex items-center justify-between border-b border-zinc-800/80 px-4 py-3">
        <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
          {evidence.system}
        </div>
        <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em]">
          <span className={`h-1.5 w-1.5 rounded-full ${isComplete ? "bg-emerald-400" : "bg-blue-400"}`} />
          <span className={isComplete ? "text-emerald-400" : "text-blue-400"}>
            {isComplete ? "complete" : phase === "playing" ? "running" : "waiting"}
          </span>
        </div>
      </div>

      <div className="relative min-h-[150px] space-y-2.5 p-4 font-mono text-xs sm:text-sm">
        {evidence.lines.map((line, index) => {
          const text = typedLines[index] ?? "";
          return (
            <div key={`${line.text}-${index}`} className="flex min-h-5 items-baseline gap-3">
              <span className={`w-4 shrink-0 select-none text-center text-xs font-bold ${PREFIX_COLORS[line.type]}`}>
                {text ? line.prefix : ""}
              </span>
              <span className={`min-w-0 break-words ${LINE_COLORS[line.type]}`}>{text}</span>
              {!isComplete && phase !== "waiting" && index === lineRef.current && (
                <span className="terminal-cursor h-3.5 w-1 translate-y-0.5 rounded-sm bg-blue-300 shadow-[0_0_12px_rgba(125,211,252,0.5)]" />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
