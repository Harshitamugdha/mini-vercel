import { motion } from "framer-motion";
import type { StageId } from "./pipelineConfig";

const DETAILS: Record<StageId, string[]> = {
  hero: ["sha:a3f91c2", "main", "origin/main"],
  github: ["payload:push", "sha:a3f91c2", "sig:verified", "branch:main"],
  actions: ["runner-us-east-1", "job-418", "matrix:node20", "lint:0"],
  build: ["build-182", "chunks:14", "assets:2.1mb", "vite:ready"],
  s3: ["s3://prod", "objects:312", "us-east-1", "etag:9fd1"],
  cloudfront: ["edge-cache", "iad:43ms", "fra:51ms", "invalidation:I2J8"],
  production: ["200 OK", "tls:1.3", "cdn:HIT", "live"],
};

interface AmbientDetailsProps {
  stageId: StageId;
  active: boolean;
}

export default function AmbientDetails({ stageId, active }: AmbientDetailsProps) {
  const items = DETAILS[stageId];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.065] [background-image:linear-gradient(rgba(125,211,252,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.22)_1px,transparent_1px)] [background-size:72px_72px]" />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 45% 38% at 50% 50%, rgba(56,189,248,0.12), transparent 70%)",
        }}
        animate={{ opacity: active ? 0.42 : 0.12 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {items.map((item, index) => {
        const left = [8, 76, 18, 68][index % 4];
        const top = [18, 26, 70, 78][index % 4];
        return (
          <motion.span
            key={`${stageId}-${item}`}
            className="absolute font-mono text-[0.58rem] uppercase tracking-[0.22em] text-sky-200"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              opacity: 0.06,
            }}
            animate={{ y: [0, -6, 0], opacity: [0.035, 0.07, 0.035] }}
            transition={{
              duration: 7 + index * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.6,
            }}
          >
            {item}
          </motion.span>
        );
      })}

      <motion.div
        className="absolute h-px w-28 bg-sky-300"
        style={{ left: "12%", top: "42%", opacity: 0.055 }}
        animate={{ x: [0, 18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute h-20 w-px bg-sky-300"
        style={{ right: "14%", bottom: "20%", opacity: 0.048 }}
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
