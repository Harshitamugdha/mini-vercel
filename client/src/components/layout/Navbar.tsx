import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center px-10">
        {/* Logo */}
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          Mini <span className="text-blue-500">Vercel</span>
        </a>

        {/* Navigation */}
        <div className="ml-10 hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-white"
          >
            How it Works
          </a>
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-3">
          <button
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:bg-zinc-900 hover:text-white"
          >
            Log In
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98]"
          >
            <FaGithub size={15} />
            Continue with GitHub
          </button>
        </div>
      </div>
    </nav>
  );
}