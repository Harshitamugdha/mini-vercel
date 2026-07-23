import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PIPELINE_STAGES, NODE_R_PRIMARY, NODE_R_SECONDARY } from "./pipelineConfig";
import { segmentDash } from "./pipelinePath";
import TraceArrow, { TraceArrowDefs } from "./TraceArrow";
import type { JourneyState, StagePhase } from "../motion/useDeploymentJourney";

interface PipelineSpineProps {
  journey: JourneyState;
}

const TRACE_COLOR = "#3b82f6";
const SEGMENT_COUNT = PIPELINE_STAGES.length - 1;

function NodeShape({ type, r }: { type: string; r: number }) {
  switch (type) {
    case "git":
      return <rect x={-r * 0.42} y={-r * 0.42} width={r * 0.84} height={r * 0.84} transform="rotate(45)" fill="currentColor" />;
    case "runner":
      return (
        <>
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={Math.cos(rad) * (r + 1)}
                y1={Math.sin(rad) * (r + 1)}
                x2={Math.cos(rad) * (r + 4)}
                y2={Math.sin(rad) * (r + 4)}
                stroke="currentColor"
                strokeWidth={0.9}
              />
            );
          })}
        </>
      );
    case "build":
      return (
        <>
          <line x1={-r * 1.35} y1={0} x2={r * 1.35} y2={0} stroke="currentColor" strokeWidth={0.8} />
          <line x1={0} y1={-r * 1.35} x2={0} y2={r * 1.35} stroke="currentColor" strokeWidth={0.8} />
        </>
      );
    case "storage":
      return (
        <>
          <line x1={-r * 0.7} y1={-r * 0.38} x2={r * 0.7} y2={-r * 0.38} stroke="currentColor" strokeWidth={0.8} />
          <line x1={-r * 0.7} y1={r * 0.38} x2={r * 0.7} y2={r * 0.38} stroke="currentColor" strokeWidth={0.8} />
        </>
      );
    case "cdn":
      return (
        <>
          {[0, 120, 240].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={Math.cos(rad) * (r + 1)}
                y1={Math.sin(rad) * (r + 1)}
                x2={Math.cos(rad) * (r + 4)}
                y2={Math.sin(rad) * (r + 4)}
                stroke="currentColor"
                strokeWidth={0.9}
              />
            );
          })}
        </>
      );
    case "production":
      return <circle r={r + 4} fill="none" stroke="currentColor" strokeWidth={0.8} />;
    default:
      return null;
  }
}

function nodeOpacity(index: number, phase: StagePhase, segmentProgress: number[]): number {
  if (index === 0) return 1;
  if (phase !== "waiting") return 1;
  return Math.min(0.22, (segmentProgress[index - 1] ?? 0) * 0.22);
}

export default function PipelineSpine({ journey }: PipelineSpineProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>(Array(SEGMENT_COUNT).fill(null));
  const [svgH, setSvgH] = useState(2600);
  const [dashes, setDashes] = useState<string[]>(Array(SEGMENT_COUNT).fill("0 9999"));
  const [tip, setTip] = useState(journey.tip);

  const { activeSegmentIndex, segmentProgress, phases, geometry, nodeYs } = journey;

  useEffect(() => {
    const el = wrapperRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(() => setSvgH(el.scrollHeight));
    ro.observe(el);
    setSvgH(el.scrollHeight);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!geometry) return;

    setDashes(geometry.segmentPaths.map((_, index) => {
      const progress = segmentProgress[index] ?? 0;
      if (progress >= 1) {
        const el = pathRefs.current[index];
        if (!el) return "9999 0";
        const total = el.getTotalLength();
        return `${total} ${total}`;
      }
      return segmentDash(pathRefs.current[index], progress);
    }));

    if (activeSegmentIndex >= 0) {
      const el = pathRefs.current[activeSegmentIndex];
      const progress = segmentProgress[activeSegmentIndex] ?? 0;
      if (el) {
        const total = el.getTotalLength();
        const drawn = total * progress;
        const pt = el.getPointAtLength(drawn);
        const prev = el.getPointAtLength(Math.max(0, drawn - 5));
        const angle = (Math.atan2(pt.y - prev.y, pt.x - prev.x) * 180) / Math.PI;
        setTip({ x: pt.x, y: pt.y, angle });
        return;
      }
    }

    const completedSegments = segmentProgress.filter((progress) => progress >= 1).length;
    const restingIndex = Math.min(completedSegments, PIPELINE_STAGES.length - 1);
    setTip({
      x: PIPELINE_STAGES[restingIndex].nodeX,
      y: nodeYs[restingIndex] ?? 0,
      angle: 90,
    });
  }, [activeSegmentIndex, geometry, nodeYs, segmentProgress]);

  const showArrow = phases[phases.length - 1] !== "complete";

  return (
    <>
      <div
        ref={wrapperRef}
        aria-hidden="true"
        className="pipeline-spine pointer-events-none absolute inset-x-0 top-0 z-10 w-full"
        style={{ height: svgH }}
      >
        <svg
          viewBox={`0 0 1440 ${svgH}`}
          width="100%"
          height={svgH}
          preserveAspectRatio="xMidYMin meet"
          className="overflow-visible"
        >
          <TraceArrowDefs />

          {geometry?.segmentPaths.map((d, index) => {
            const progress = segmentProgress[index] ?? 0;
            const active = index === activeSegmentIndex && progress > 0 && progress < 1;
            const complete = progress >= 1;
            return (
              <path
                key={`seg-${index}`}
                ref={(el) => {
                  pathRefs.current[index] = el;
                }}
                d={d}
                fill="none"
                stroke={TRACE_COLOR}
                strokeWidth={active ? 2.45 : 2.1}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#trace-glow)"
                opacity={progress > 0 ? (complete ? 1 : 0.96) : 0}
                style={{
                  strokeDasharray: dashes[index],
                  strokeDashoffset: 0,
                  filter: active
                    ? "drop-shadow(0 0 7px rgba(56,189,248,0.48)) drop-shadow(0 0 14px rgba(59,130,246,0.18))"
                    : complete
                      ? "drop-shadow(0 0 5px rgba(56,189,248,0.30))"
                      : undefined,
                }}
              />
            );
          })}

          {PIPELINE_STAGES.map((stage, index) => {
            const phase = phases[index] ?? "waiting";
            const isPrimary = ["git", "build", "production", "runner"].includes(stage.nodeType);
            const r = isPrimary ? NODE_R_PRIMARY : NODE_R_SECONDARY;
            const active = phase === "playing";
            const complete = phase === "complete";
            const opacity = nodeOpacity(index, phase, segmentProgress);

            return (
              <g key={stage.id} transform={`translate(${stage.nodeX}, ${nodeYs[index] ?? 0})`}>
                <motion.g
                  initial={false}
                  animate={{
                    opacity,
                    scale: active ? [1.06, 1.16, 1.06] : [1, 1.06, 1],
                  }}
                  transition={{
                    duration: active ? 1.8 : 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`spine-node ${complete ? "text-cyan-300" : "text-blue-400"}`}
                >
                  <circle
                    r={r + 5}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.9}
                    opacity={active ? 0.75 : complete ? 0.45 : 0.22}
                  />
                  <circle r={r} fill="#09090b" stroke="currentColor" strokeWidth={1.6} />
                  <circle r={r * 0.34} fill="currentColor" />
                  <NodeShape type={stage.nodeType} r={r} />
                </motion.g>
              </g>
            );
          })}
        </svg>
      </div>

      <div
        aria-hidden="true"
        className="pipeline-arrow pointer-events-none absolute inset-x-0 top-0 z-50 w-full"
        style={{ height: svgH }}
      >
        <svg
          viewBox={`0 0 1440 ${svgH}`}
          width="100%"
          height={svgH}
          preserveAspectRatio="xMidYMin meet"
          className="overflow-visible"
        >
          <TraceArrowDefs />
          {activeSegmentIndex >= 0 && (
            <circle
              cx={tip.x}
              cy={tip.y}
              r={12}
              fill="#38bdf8"
              opacity={0.16}
              filter="url(#arrow-bloom)"
            />
          )}
          <TraceArrow x={tip.x} y={tip.y} angle={tip.angle} visible={showArrow} />
        </svg>
      </div>
    </>
  );
}
