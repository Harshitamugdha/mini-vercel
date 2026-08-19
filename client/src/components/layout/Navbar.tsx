import { motion, useScroll, useTransform } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { loginWithGitHub } from "../../services/authService";

export default function Navbar() {
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, [0, 120], ["rgba(9,9,11,0.62)", "rgba(9,9,11,0.9)"]);
  const borderColor = useTransform(scrollY, [0, 120], ["rgba(39,39,42,0.35)", "rgba(63,63,70,0.72)"]);

  return (
    <motion.nav initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} style={{ backgroundColor, borderColor }} className="sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-5 sm:px-6 lg:px-10">
        <a href="/" className="text-base font-bold tracking-tight text-white transition-opacity hover:opacity-90">Mini <span className="text-blue-400">Vercel</span></a>
        <div className="ml-10 hidden items-center gap-7 md:flex">
          {[['How it Works', '#how-it-works'], ['Dashboard', '#dashboard'], ['Architecture', '#architecture'], ['Features', '#features']].map(([label, href]) => <motion.a key={href} whileHover={{ y: -1 }} href={href} className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">{label}</motion.a>)}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white sm:inline-flex" onClick={loginWithGitHub}>Log In</motion.button>
          <motion.button whileHover={{ y: -1, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200" onClick={loginWithGitHub}><FaGithub size={15} /><span className="hidden sm:inline">Continue with GitHub</span><span className="sm:hidden">GitHub</span></motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
