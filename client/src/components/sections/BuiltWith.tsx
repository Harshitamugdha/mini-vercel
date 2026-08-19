import { motion } from "framer-motion";

const stack = [
  ["Frontend", "React", "TypeScript", "Framer Motion", "Vite", "Tailwind CSS"],
  ["Backend", "Node.js", "Express", "MongoDB", "Passport GitHub"],
  ["Delivery", "GitHub Actions", "AWS S3", "CloudFront"],
];

export default function BuiltWith() {
  return (
    <section className="border-t border-zinc-900 bg-zinc-950 px-6 py-24 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-7xl rounded-3xl border border-zinc-800 bg-zinc-900/35 p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div><p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">Built with</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">A real full-stack deployment project.</h2></div>
          <div className="grid gap-4 md:grid-cols-3">
            {stack.map(([group, ...items]) => <div key={group} className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5"><p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">{group}</p><div className="mt-4 space-y-2">{items.map((item) => <p key={item} className="text-sm text-zinc-200">{item}</p>)}</div></div>)}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
