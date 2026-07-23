import { FaGithub } from "react-icons/fa";

const STACK = ["React", "GitHub Actions", "AWS S3", "CloudFront"];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-10 text-sm text-zinc-500 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <a href="/" className="text-base font-bold tracking-tight text-white">
            Mini <span className="text-blue-500">Vercel</span>
          </a>

          <p className="mt-3 leading-6 text-zinc-400">
            Deployment pipeline showcasing GitHub Actions, AWS S3 and CloudFront.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {STACK.map((item) => (
              <span
                key={item}
                className="rounded-full border border-zinc-800 bg-zinc-900/40 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex items-center gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
            >
              <FaGithub size={14} />
              GitHub
            </a>
            <a href="#features" className="text-zinc-400 transition-colors hover:text-white">
              Documentation
            </a>
          </div>

          <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-zinc-700">
            (c) {new Date().getFullYear()} Mini Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
