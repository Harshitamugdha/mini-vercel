import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 px-8 py-4 backdrop-blur-md">
      <a href="/" className="text-lg font-bold tracking-tight text-white">
        Mini <span className="text-blue-500">Vercel</span>
      </a>

      <div className="flex items-center gap-6">
        <a
          href="#features"
          className="text-sm text-zinc-400 transition-colors duration-150 hover:text-white"
        >
          Features
        </a>

        <a
          href="#docs"
          className="text-sm text-zinc-400 transition-colors duration-150 hover:text-white"
        >
          Docs
        </a>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700/60 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-150 hover:border-zinc-600 hover:text-white"
        >
          <FaGithub size={15} />
          GitHub
        </a>
      </div>
    </nav>
  );
}