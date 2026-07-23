import Navbar from "./components/layout/Navbar";
import PipelineLayout from "./components/pipeline/PipelineLayout";
import Features from "./components/sections/Features";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-blue-500/20 selection:text-blue-300 antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <PipelineLayout />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default App;
