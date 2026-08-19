import { motion } from "framer-motion";
import { Activity, FolderPlus, RefreshCw, Search } from "lucide-react";

const projects = [
  { name: "portfolio-site", repo: "github.com/you/portfolio-site", status: "Ready", url: "portfolio.cloudfront.net" },
  { name: "docs-starter", repo: "github.com/you/docs-starter", status: "Building", url: "actions run #128" },
];

export default function ProductPreview() {
  return (
    <section id="dashboard" className="relative overflow-hidden border-t border-zinc-900 bg-zinc-950 px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6, ease: "easeOut" }} className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">Product surface</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">A dashboard for what actually shipped.</h2>
          <p className="mt-4 text-base leading-8 text-zinc-400">The landing page story resolves into the real Mini Vercel app shell: projects, repository imports, redeploy controls, and deployment status in one place.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 36, scale: 0.98, clipPath: "inset(12% 8% 0% 8% round 28px)" }} whileInView={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0% round 28px)" }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75, ease: "easeOut" }} className="mt-12 overflow-hidden rounded-[1.75rem] border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50">
          <div className="flex flex-col gap-4 border-b border-zinc-800 bg-zinc-900/70 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div><p className="text-lg font-semibold text-white">Projects</p><p className="font-mono text-xs text-zinc-500">Manage and monitor transparent cloud pipelines</p></div>
            <div className="flex gap-2"><button className="rounded-lg border border-zinc-800 bg-zinc-950 p-2 text-zinc-400"><RefreshCw className="h-4 w-4" /></button><button className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white"><FolderPlus className="h-4 w-4" /> Import Repository</button></div>
          </div>
          <div className="grid gap-0 lg:grid-cols-[260px_1fr]">
            <aside className="border-b border-zinc-800 bg-zinc-950/80 p-5 lg:border-b-0 lg:border-r"><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-600" /><div className="rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-9 font-mono text-xs text-zinc-500">Filter projects...</div></div><div className="mt-6 space-y-3 font-mono text-xs text-zinc-500"><p>updated</p><p>status</p><p>framework</p></div></aside>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {projects.map((project) => <motion.div key={project.name} whileHover={{ y: -4, borderColor: "rgba(96,165,250,0.45)" }} className="rounded-2xl border border-zinc-800 bg-zinc-900/55 p-5"><div className="flex items-center justify-between"><p className="font-semibold text-white">{project.name}</p><span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 font-mono text-[10px] uppercase text-emerald-300">{project.status}</span></div><p className="mt-2 truncate font-mono text-xs text-zinc-500">{project.repo}</p><div className="mt-6 flex items-center gap-2 text-sm text-zinc-300"><Activity className="h-4 w-4 text-blue-300" /> {project.url}</div></motion.div>)}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
