import {
  Cloud,
  Rocket,
  History,
  GitBranch,
  ShieldCheck,
  Globe,
  Terminal,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Rocket className="text-blue-400" size={24} />,
    title: "One-Push Deployment",
    tag: "AUTOMATED",
    description: "Push to main branch. GitHub Webhooks automatically trigger the cloud deployment orchestration pipeline.",
  },
  {
    icon: <Cloud className="text-blue-400" size={24} />,
    title: "Amazon S3 Edge Origin",
    tag: "AWS S3",
    description: "Static React bundles sync to Amazon S3 buckets with zero-downtime atomic object replacements.",
  },
  {
    icon: <Globe className="text-blue-400" size={24} />,
    title: "CloudFront CDN",
    tag: "GLOBAL CDN",
    description: "Sub-millisecond global asset propagation across 300+ Edge Locations with instant cache invalidation.",
  },
  {
    icon: <GitBranch className="text-blue-400" size={24} />,
    title: "Isolated Runner Matrix",
    tag: "CI/CD",
    description: "Ubuntu-latest GitHub Actions runners execute linting, unit tests, and Vite bundle compilation in parallel.",
  },
  {
    icon: <ShieldCheck className="text-blue-400" size={24} />,
    title: "Automatic SSL & HTTPS",
    tag: "SECURITY",
    description: "TLS v1.3 certificates dynamically assigned to every CloudFront distribution endpoint.",
  },
  {
    icon: <History className="text-blue-400" size={24} />,
    title: "Deployment Telemetry",
    tag: "LOGS",
    description: "Complete historical audit log with commit hashes, run numbers, build durations, and deployment URLs.",
  },
];

const DEPLOY_HISTORY = [
  { commit: "a3f91c2", branch: "main", duration: "14.2s", status: "Live", url: "https://your-app.cloudfront.net", author: "harshitamugdha" },
  { commit: "f9b801a", branch: "main", duration: "13.8s", status: "Passed", url: "https://your-app-f9b801a.cloudfront.net", author: "harshitamugdha" },
  { commit: "c2e418d", branch: "main", duration: "15.1s", status: "Passed", url: "https://your-app-c2e418d.cloudfront.net", author: "harshitamugdha" },
];

export default function Features() {
  return (
    <section id="features" className="relative border-t border-zinc-900 bg-zinc-950 px-6 py-28 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-blue-400">
            PLATFORM ARCHITECTURE
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Built for High-Velocity Engineering
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Mini Vercel abstracts complex AWS infrastructure into a single automated pipeline.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat) => (
            <div
              key={feat.title}
              className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-blue-950/20"
              style={{ opacity: 1, transform: "translateY(0)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10">
                  {feat.icon}
                </div>
                <span className="font-mono text-[0.65rem] font-medium tracking-wider text-zinc-500 group-hover:text-blue-400">
                  {feat.tag}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white group-hover:text-blue-300">
                {feat.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Live Deployment History Preview Panel */}
        <div className="mt-20 rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5 font-mono text-xs text-zinc-300">
              <Terminal size={15} className="text-blue-400" />
              <span className="font-semibold">Recent Production Deployments</span>
            </div>
            <span className="font-mono text-[0.65rem] text-emerald-400">
              ● Live Monitoring
            </span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            {DEPLOY_HISTORY.map((dep, idx) => (
              <div
                key={dep.commit}
                className="flex flex-col justify-between gap-2 rounded-lg border border-zinc-800/60 bg-zinc-950/60 p-3.5 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${idx === 0 ? "bg-emerald-400" : "bg-zinc-600"}`} />
                  <span className="font-semibold text-white">{dep.commit}</span>
                  <span className="text-zinc-500">[{dep.branch}]</span>
                  <span className="text-zinc-400">by {dep.author}</span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-zinc-500">{dep.duration}</span>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-400 border border-emerald-500/20">
                    {dep.status}
                  </span>
                  <a
                    href={dep.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-blue-400 hover:underline max-w-[200px]"
                  >
                    {dep.url}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
