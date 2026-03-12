import { useNavigate } from "react-router-dom";
import { Layers, Zap, ShieldCheck, ArrowRight, Code, Database, Cpu } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-fade-in" data-purpose="hero-section">
        <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight text-white">
          Engineering Decisions, <br />
          <span className="gradient-text">Backed by Data.</span>
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto text-xl leading-relaxed">
          Stop guessing your SDLC methodology. Our AI Consultant analyzes your project constraints to recommend the optimal process, architecture, and risk mitigation strategy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate("/planner")}
            className="bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 px-8 py-4 rounded-xl text-lg font-bold flex items-center gap-2 transition-all hover-lift glow-effect text-white shadow-brand-500/20 shadow-xl"
          >
            Start New Project <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 rounded-xl text-lg font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
            View Case Studies
          </button>
        </div>

        {/* Features / Trust Badges */}
        <div className="grid md:grid-cols-3 gap-8 pt-16 mt-8 border-t border-white/5 mx-auto max-w-5xl">
          <div className="glass-morphism p-8 rounded-3xl flex flex-col items-center hover-lift group">
            <div className="w-16 h-16 bg-brand-500/10 text-brand-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner shadow-brand-500/20">
              <Layers size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Architecture Design</h3>
            <p className="text-slate-400 text-center">Data-driven structural recommendations based on project scale.</p>
          </div>

          <div className="glass-morphism p-8 rounded-3xl flex flex-col items-center hover-lift group">
            <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner shadow-green-500/20">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Process Optimization</h3>
            <p className="text-slate-400 text-center">Select pure Agile, strict V-Model or hybrid flows effortlessly.</p>
          </div>

          <div className="glass-morphism p-8 rounded-3xl flex flex-col items-center hover-lift group">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner shadow-red-500/20">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Risk Compliance</h3>
            <p className="text-slate-400 text-center">Anticipate delivery bottlenecks and team velocity limits.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white font-display">How the Engine Works</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Three simple steps to transition from abstract requirements to a concrete engineering roadmap.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-16 right-16 h-0.5 bg-gradient-to-r from-brand-500/0 via-brand-500/20 to-brand-500/0"></div>

          <div className="relative text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-slate-900 border border-brand-500/30 rounded-full flex items-center justify-center shadow-xl shadow-brand-500/10 z-10 relative">
              <Code size={32} className="text-brand-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">1. Define Metrics</h3>
            <p className="text-slate-400 leading-relaxed">Input your project constraints including team skill level, budget flexibility, and domain criticality.</p>
          </div>

          <div className="relative text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-slate-900 border border-purple-500/30 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/10 z-10 relative">
              <Cpu size={32} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">2. AI Analysis</h3>
            <p className="text-slate-400 leading-relaxed">Our proprietary engine evaluates combinations of methodologies and design patterns to find the perfect fit.</p>
          </div>

          <div className="relative text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-slate-900 border border-green-500/30 rounded-full flex items-center justify-center shadow-xl shadow-green-500/10 z-10 relative">
              <Database size={32} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">3. Export Blueprint</h3>
            <p className="text-slate-400 leading-relaxed">Instantly receive a comprehensive strategic plan with duration estimates, risk mitigation, and mermaid charts.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="glass-morphism rounded-3xl p-12 text-center space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-purple-600/10 z-0 pointer-events-none"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">Ready to streamline your workflow?</h2>
          <p className="text-slate-300 text-lg">Join forward-thinking engineering teams shipping better software.</p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-4 bg-white text-brand-900 hover:bg-slate-200 px-8 py-4 rounded-xl text-lg font-bold transition-all hover-lift"
          >
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
