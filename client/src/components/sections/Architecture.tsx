import { motion } from "framer-motion";
import { Box, Cloud, Code2, GitBranch, Github, Globe } from "lucide-react";

const steps = [
  { label: "GitHub", detail: "Repository push", icon: Github },
  { label: "GitHub Actions", detail: "CI runner", icon: GitBranch },
  { label: "Build", detail: "React bundle", icon: Code2 },
  { label: "AWS S3", detail: "Static hosting", icon: Box },
  { label: "CloudFront", detail: "CDN delivery", icon: Cloud },
  { label: "Production", detail: "Live URL", icon: Globe },
];

export default function Architecture() {
  return (
    <section id="architecture" className="border-t border-zinc-900 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_38%),#09090b] px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">Architecture</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Understand the path to production.</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }} className="mt-16 grid gap-4 md:grid-cols-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return <motion.div key={step.label} variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -5 }} className="relative rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 text-center">
              {index < steps.length - 1 && <motion.div aria-hidden="true" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + index * 0.08, duration: 0.45 }} className="absolute left-[calc(50%+2rem)] top-9 hidden h-px w-[calc(100%-2rem)] origin-left bg-blue-400/35 md:block" />}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 text-blue-200"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-4 text-sm font-semibold text-white">{step.label}</h3><p className="mt-1 font-mono text-[11px] text-zinc-500">{step.detail}</p>
            </motion.div>;
          })}
        </motion.div>
      </div>
    </section>
  );
}
