import { useEffect, useRef, type Ref } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { loginWithGitHub } from "../../../services/authService";
interface HeroStageProps {
  sectionRef: Ref<HTMLDivElement>;
  onWatchDeployment: () => void;
}

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 180, damping: 22, mass: 0.9 },
  },
};

export default function PushStage({ sectionRef, onWatchDeployment }: HeroStageProps) {
  const commandRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const command = "git push origin main";
    let frame = 0;
    let startedAt = performance.now();
    let lastBlink = startedAt;
    let cursorVisible = true;
    const typeMs = command.length * 34;
    const holdMs = 900;
    const clearMs = 180;
    const cycleMs = typeMs + holdMs + clearMs;

    const tick = (now: number) => {
      const elapsed = (now - startedAt) % cycleMs;
      const commandEl = commandRef.current;
      const cursorEl = cursorRef.current;

      if (commandEl) {
        if (elapsed < typeMs) {
          const chars = Math.floor((elapsed / typeMs) * (command.length + 1));
          commandEl.textContent = command.slice(0, chars);
        } else if (elapsed < typeMs + holdMs) {
          commandEl.textContent = command;
        } else {
          commandEl.textContent = "";
        }
      }

      if (cursorEl && now - lastBlink > 420) {
        cursorVisible = !cursorVisible;
        cursorEl.style.opacity = cursorVisible ? "1" : "0.28";
        lastBlink = now;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      ref={sectionRef}
      data-stage-index={0}
      className="relative z-20 flex min-h-[calc(100vh-65px)] items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 42%, rgba(59,130,246,0.13), transparent 70%), radial-gradient(ellipse 80% 80% at 50% 100%, rgba(16,185,129,0.05), transparent 60%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-4xl flex-col items-center"
      >
        <motion.h1
          variants={item}
          className="max-w-4xl text-[3rem] font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-8xl"
        >
          Push once.
          <br />
          <span className="bg-gradient-to-b from-blue-100 via-blue-300 to-blue-500 bg-clip-text text-transparent">
            Watch it deploy.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-7 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg"
        >
        From a single Git push to a live production deployment,
        powered by GitHub Actions, Amazon S3, and CloudFront.
                </motion.p>

      <motion.div
        variants={item}
        className="mt-10 flex flex-wrap justify-center gap-4"
      >
  
      <button
        type="button"
        onClick={loginWithGitHub}
        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-xl shadow-blue-950/20 transition-all duration-200 hover:scale-[1.03] hover:bg-zinc-200 active:scale-[0.98]"
      >
      <FaGithub size={16} />
      Continue with GitHub
      </button>

  
        <button
          type="button"
          onClick={onWatchDeployment}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-6 py-3 text-sm font-semibold text-zinc-200 backdrop-blur-xl transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900"
          >
          See Demo
          <ArrowRight size={16} />
          </button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-11 w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/90 text-left shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
              terminal
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          </div>
          <div className="flex items-center gap-3 px-5 py-5 font-mono text-sm text-zinc-100 sm:text-base">
            <span className="select-none text-zinc-500">$</span>
            <span ref={commandRef} className="min-h-5 min-w-0" />
            <span ref={cursorRef} className="h-4 w-1 rounded-sm bg-blue-300 shadow-[0_0_14px_rgba(125,211,252,0.55)]" />
          </div>
        </motion.div>

        <div data-node-anchor className="mt-8 h-1 w-1" />
      </motion.div>
    </section>
  );
}
