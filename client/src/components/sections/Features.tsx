import { motion } from "framer-motion";
import { Cloud, Rocket, History, GitBranch, Globe, Cpu } from "lucide-react";

const FEATURES = [
  { icon: Rocket, title: "GitHub integration", tag: "WEBHOOK", description: "Authenticate with GitHub, import a repository, and let repository events start the deployment flow." },
  { icon: GitBranch, title: "Automated builds", tag: "ACTIONS", description: "GitHub Actions runs the install and build work needed to turn a React project into a deployable bundle." },
  { icon: Cpu, title: "Visible pipeline", tag: "TIMELINE", description: "The landing journey makes each deployment stage explicit instead of hiding the process in a black box." },
  { icon: Cloud, title: "AWS S3 hosting", tag: "ORIGIN", description: "Built static assets are published to S3 as the durable origin for deployed React applications." },
  { icon: Globe, title: "CloudFront delivery", tag: "EDGE", description: "CloudFront sits in front of S3 so production traffic is delivered through an AWS CDN layer." },
  { icon: History, title: "Deployment evidence", tag: "LOGS", description: "Project views preserve status, deployment URLs, timestamps, and operational context for each release." },
];

export default function Features() {
  return (
    <section id="features" className="relative border-t border-zinc-900 bg-zinc-950 px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.55 }} className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">Platform capabilities</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">The pieces of a deployment platform, made visible.</h2>
          <p className="mt-4 text-base leading-8 text-zinc-400">Mini Vercel focuses on the real mechanics of shipping a React app: source control, CI, storage, CDN delivery, and evidence that explains what happened.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }} className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <motion.article key={feat.title} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } }} whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(96,165,250,0.42)" }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="group relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-6 shadow-xl shadow-black/20">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10"><Icon className="h-5 w-5 text-blue-300" /></div><span className="font-mono text-[0.65rem] tracking-[0.2em] text-zinc-500 group-hover:text-blue-300">{feat.tag}</span></div>
                <h3 className="mt-6 text-lg font-semibold text-white">{feat.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{feat.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
