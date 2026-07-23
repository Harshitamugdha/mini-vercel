import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import type { StagePhase } from "../motion/useDeploymentJourney";

interface StageMotionProps {
  phase: StagePhase;
  children: ReactNode;
  className?: string;
  fromX?: number;
  fromY?: number;
  fromScale?: number;
  rotate?: number;
}

export default function StageMotion({
  phase,
  children,
  className,
  fromX = 0,
  fromY = 28,
  fromScale = 0.96,
  rotate = 0,
}: StageMotionProps) {
  const variants: Variants = {
    waiting: {
      opacity: 0,
      x: fromX,
      y: fromY,
      scale: fromScale,
      rotate,
      filter: "blur(14px)",
    },
    playing: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 180,
        damping: 22,
        mass: 0.9,
        staggerChildren: 0.08,
      },
    },
    complete: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
    },
  };

  return (
    <motion.div
      className={`relative z-10 ${className ?? ""}`}
      variants={variants}
      initial="waiting"
      animate={phase}
      style={{ transformOrigin: "50% 60%" }}
    >
      {children}
    </motion.div>
  );
}
