import type { Ref } from "react";
import { motion, type Variants } from "framer-motion";
import StageMotion from "./StageMotion";
import EvidenceCard from "./EvidenceCard";
import AmbientDetails from "./AmbientDetails";
import { STAGE_LAYOUTS } from "./stageLayout";
import type { StageConfig } from "./pipelineConfig";
import type { StagePhase } from "../motion/useDeploymentJourney";

interface JourneyStageProps {
  index: number;
  sectionRef: Ref<HTMLDivElement>;
  phase: StagePhase;
  stage: StageConfig;
  onComplete: () => void;
}

const child: Variants = {
  waiting: { opacity: 0, y: 18, filter: "blur(8px)" },
  playing: { opacity: 1, y: 0, filter: "blur(0px)" },
  complete: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function JourneyStage({
  index,
  sectionRef,
  phase,
  stage,
  onComplete,
}: JourneyStageProps) {
  const layout = STAGE_LAYOUTS[index];
  const isProduction = stage.id === "production";

  return (
    <div ref={sectionRef} id={stage.id} data-stage-index={index} className={layout.section}>
      <AmbientDetails stageId={stage.id} active={phase !== "waiting"} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: phase === "waiting" ? 0 : 1,
          background: isProduction
            ? "radial-gradient(ellipse 55% 42% at 50% 56%, rgba(34,211,238,0.09), transparent 68%)"
            : "radial-gradient(ellipse 48% 38% at 50% 50%, rgba(59,130,246,0.07), transparent 72%)",
        }}
      />

      <StageMotion
        phase={phase}
        fromX={layout.fromX}
        fromY={layout.fromY}
        fromScale={layout.fromScale}
        rotate={layout.rotate}
        className={layout.content}
      >
        <motion.p
          variants={child}
          className="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-blue-400/80"
        >
          {stage.eyebrow}
        </motion.p>

        <motion.h2
          variants={child}
          className={isProduction
            ? "text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
            : "text-3xl font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-5xl"}
        >
          {stage.title}
          <br />
          <span className={isProduction
            ? "bg-gradient-to-b from-cyan-100 via-sky-300 to-blue-500 bg-clip-text text-transparent"
            : "bg-gradient-to-b from-blue-200 to-blue-500 bg-clip-text text-transparent"}
          >
            {stage.accent}
          </span>
        </motion.h2>

        <motion.p
          variants={child}
          className={`mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base ${isProduction ? "mx-auto" : ""}`}
        >
          {stage.copy}
        </motion.p>

        <motion.div
          variants={child}
          className={`mt-8 ${isProduction ? "mx-auto max-w-xl text-left" : ""}`}
        >
          <EvidenceCard evidence={stage.evidence} phase={phase} onComplete={onComplete} />
        </motion.div>

        {isProduction && (
          <motion.div
            variants={child}
            className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3"
          >
            {[
              ["HTTPS", "active"],
              ["CDN", "global"],
              ["Status", "200 OK"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-cyan-400/15 bg-blue-400/5 p-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cyan-300/70">{label}</p>
                <p className={`mt-2 font-mono text-sm font-semibold ${label === "Status" ? "text-emerald-300" : "text-sky-100"}`}>{value}</p>
              </div>
            ))}
          </motion.div>
        )}
      </StageMotion>
    </div>
  );
}
