import Navbar from "../components/layout/Navbar";
import PipelineLayout from "../components/pipeline/PipelineLayout";
import Architecture from "../components/sections/Architecture";
import BuiltWith from "../components/sections/BuiltWith";
import Features from "../components/sections/Features";
import FinalCTA from "../components/sections/FinalCTA";
import Hero from "../components/sections/Hero";
import ProductPreview from "../components/sections/ProductPreview";
import Footer from "../components/layout/Footer";

function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-blue-500/20 selection:text-blue-300 antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <section id="how-it-works" className="relative border-t border-zinc-900 bg-zinc-950 px-6 pt-24 text-center lg:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-blue-300">How it works</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">From push to production.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-400">Every deployment stage is visible. No black box. Scroll into the existing product journey and watch the release move through the stack.</p>
        </section>
        <PipelineLayout />
        <ProductPreview />
        <Architecture />
        <Features />
        <BuiltWith />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
