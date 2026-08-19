import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { loginWithGitHub } from "../../services/authService";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const terminalLines = [
  { tone: "text-zinc-500", text: "$ git push origin main" },
  { tone: "text-blue-300", text: "✓ webhook received from GitHub" },
  { tone: "text-cyan-300", text: "→ running build on GitHub Actions" },
  { tone: "text-emerald-300", text: "✓ synced /dist to AWS S3" },
  { tone: "text-white", text: "production live behind CloudFront" },
];

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const rawContentY = useTransform(scrollYProgress, [0, 0.22], [0, reduceMotion ? 0 : -34]);
  const rawVisualY = useTransform(scrollYProgress, [0, 0.22], [0, reduceMotion ? 0 : 48]);
  const rawGridY = useTransform(scrollYProgress, [0, 0.22], [0, reduceMotion ? 0 : 28]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 0.92, 0.72]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.24], [0.75, 0.28]);
  const contentY = useSpring(rawContentY, { stiffness: 90, damping: 26 });
  const visualY = useSpring(rawVisualY, { stiffness: 80, damping: 24 });
  const gridY = useSpring(rawGridY, { stiffness: 70, damping: 28 });

  return (
    <section className="relative isolate overflow-hidden border-b border-zinc-900 bg-zinc-950 px-6 pb-20 pt-24 sm:pt-28 lg:px-10 lg:pb-28">
      <motion.div
        aria-hidden="true"
        style={{ y: gridY }}
        className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(63,63,70,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.16)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black_35%,transparent_72%)]"
      />
      <motion.div
        aria-hidden="true"
        style={{ opacity: glowOpacity }}
        className="absolute left-1/2 top-10 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div variants={container} initial="hidden" animate="visible" style={{ y: contentY, opacity: contentOpacity }}>
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.22em] text-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_14px_rgba(96,165,250,0.9)]" />
            Transparent CI/CD for React
          </motion.div>

          <motion.h1 variants={item} className="mt-6 max-w-5xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
            Deploy React apps. <span className="text-zinc-500">Watch every step.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            Mini Vercel turns a GitHub push into a visible deployment journey: Actions builds the app, S3 hosts the bundle, CloudFront delivers it, and every stage leaves evidence behind.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={loginWithGitHub} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 shadow-xl shadow-blue-950/25">
              <FaGithub /> Deploy a project <ArrowRight className="h-4 w-4" />
            </motion.button>
            <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-6 py-3 text-sm font-semibold text-zinc-200">
              <Play className="h-4 w-4" /> Watch the pipeline
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div variants={item} initial="hidden" animate="visible" style={{ y: visualY }} className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/70 px-4 py-3">
              <div className="flex gap-2"><span className="h-3 w-3 rounded-full bg-red-400/70" /><span className="h-3 w-3 rounded-full bg-yellow-400/70" /><span className="h-3 w-3 rounded-full bg-emerald-400/70" /></div>
              <div className="font-mono text-xs text-zinc-500">mini-vercel/deploy</div>
            </div>
            <div className="space-y-4 p-5 font-mono text-sm">
              {terminalLines.map((line, index) => (
                <motion.div key={line.text} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + index * 0.08 }} className={line.tone}>{line.text}</motion.div>
              ))}
            </div>
            <div className="grid border-t border-zinc-800 sm:grid-cols-3">
              {['GitHub', 'S3', 'CloudFront'].map((label) => <div key={label} className="flex items-center gap-2 border-zinc-800 px-4 py-3 text-xs text-zinc-400 sm:border-r last:border-r-0"><CheckCircle2 className="h-4 w-4 text-blue-300" />{label}</div>)}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
