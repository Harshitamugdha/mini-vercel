import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { loginWithGitHub } from "../../services/authService";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-zinc-900 bg-zinc-950 px-6 py-28 lg:px-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
      <motion.div initial={{ opacity: 0, y: 22, scale: 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.35 }} transition={{ type: "spring", stiffness: 120, damping: 20 }} className="mx-auto max-w-5xl rounded-[2rem] border border-zinc-800 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.18),transparent_42%),rgba(24,24,27,0.55)] p-8 text-center shadow-2xl shadow-black/40 sm:p-14">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">Ready to deploy</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">Ship it. See exactly what happened.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-400">Connect GitHub and move from repository to production through the same transparent pipeline showcased above.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <motion.button whileHover={{ y: -2, scale: 1.015 }} whileTap={{ scale: 0.98 }} onClick={loginWithGitHub} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950"><FaGithub /> Deploy a project <ArrowRight className="h-4 w-4" /></motion.button>
          <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-6 py-3 text-sm font-semibold text-zinc-200">View source</motion.a>
        </div>
      </motion.div>
    </section>
  );
}
