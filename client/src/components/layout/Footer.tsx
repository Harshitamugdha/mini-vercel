import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 px-10 py-12">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-8 md:flex-row md:items-end">
        {/* Left */}
        <div className="max-w-lg">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
          >
            Mini <span className="text-blue-500">Vercel</span>
          </a>

          <p className="mt-5 text-base leading-8 text-zinc-400">
            A modern deployment platform powered by GitHub Actions,
            Amazon S3, and CloudFront.
          </p>
        </div>

        {/* Right */}
        <div className="ml-auto flex flex-col gap-6 md:items-end">
          <div className="flex items-center gap-10 text-base font-medium">
            <a
              href="#features"
              className="text-zinc-300 transition-colors duration-200 hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-zinc-300 transition-colors duration-200 hover:text-white"
            >
              How it Works
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-zinc-300 transition-colors duration-200 hover:text-white"
            >
              <FaGithub size={17} />
              GitHub
            </a>
          </div>

          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Mini Vercel. Powered by React, GitHub
            Actions, Amazon S3 & CloudFront.
          </p>
        </div>
      </div>
    </footer>
  );
}