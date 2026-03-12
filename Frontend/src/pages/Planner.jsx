import { useState } from "react";
import MermaidDiagram from "../components/MermaidDiagram";
import { formatCurrency, formatRisk } from "../utils/utils.js";
import { Sparkles } from "lucide-react";

const Planner = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    size: "medium",
    requirements: "fixed",
    teamSkill: "mixed",
    timeline: "flexible",
    budget: "flexible",
    safetyCritical: "false",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setFeedbackSent(false);

    try {
      const response = await fetch("http://localhost:5000/api/inception", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parameters: {
            ...formData,
            safetyCritical: formData.safetyCritical === "true",
          },
        }),
      });
      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      alert("Simulation Failed! Ensure Backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (success) => {
    if (!result) return;
    try {
      await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: result._id,
          feedback: {
            success: success,
            rating: success ? 5 : 2,
            actualDuration: result.generatedPlan.estimates.durationMonths,
            comment: "User feedback from Web UI",
          },
        }),
      });
      setFeedbackSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <section className="text-center space-y-6 animate-fade-in" data-purpose="hero-section">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-500 text-xs font-bold uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          V2.0 Blueprint Engine Active
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">
          Generate Your Project <br />
          <span className="gradient-text">Strategic Blueprint</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Input your project parameters and our AI-driven engine will recommend the optimal SDLC methodology, architecture patterns, and risk mitigation strategies.
        </p>
      </section>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-5 space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="glass-morphism p-8 rounded-3xl" data-purpose="input-card">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <svg className="text-brand-500" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Project Parameters
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5" data-purpose="planner-form">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Project Name</label>
                <input required name="projectName" value={formData.projectName} onChange={handleChange} className="w-full glass-input rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Neo-Banking Core" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Project Size</label>
                  <select name="size" value={formData.size} onChange={handleChange} className="w-full glass-input rounded-xl px-4 py-3 text-white focus:outline-none appearance-none focus:ring-2 focus:ring-brand-500">
                    <option value="small" className="text-slate-900">Small (&lt; 20 KLOC)</option>
                    <option value="medium" className="text-slate-900">Medium (20-100 KLOC)</option>
                    <option value="large" className="text-slate-900">Large (&gt; 100 KLOC)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Req. Stability</label>
                  <select name="requirements" value={formData.requirements} onChange={handleChange} className="w-full glass-input rounded-xl px-4 py-3 text-white focus:outline-none appearance-none focus:ring-2 focus:ring-brand-500">
                    <option value="dynamic" className="text-slate-900">Highly Dynamic</option>
                    <option value="fixed" className="text-slate-900">Fixed / Rigid</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Team Skill</label>
                  <select name="teamSkill" value={formData.teamSkill} onChange={handleChange} className="w-full glass-input rounded-xl px-4 py-3 text-white focus:outline-none appearance-none focus:ring-2 focus:ring-brand-500">
                    <option value="junior" className="text-slate-900">Junior/Learning</option>
                    <option value="mixed" className="text-slate-900">Balanced</option>
                    <option value="senior" className="text-slate-900">Expert/Senior</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Domain Criticality</label>
                  <select name="safetyCritical" value={formData.safetyCritical} onChange={handleChange} className="w-full glass-input rounded-xl px-4 py-3 text-white focus:outline-none appearance-none focus:ring-2 focus:ring-brand-500">
                    <option value="false" className="text-slate-900">Standard / Low</option>
                    <option value="true" className="text-slate-900">Critical (Life/Safety)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Budget</label>
                  <select name="budget" value={formData.budget} onChange={handleChange} className="w-full glass-input rounded-xl px-4 py-3 text-white focus:outline-none appearance-none focus:ring-2 focus:ring-brand-500">
                    <option value="flexible" className="text-slate-900">Flexible</option>
                    <option value="tight" className="text-slate-900">Tight</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Timeline</label>
                  <select name="timeline" value={formData.timeline} onChange={handleChange} className="w-full glass-input rounded-xl px-4 py-3 text-white focus:outline-none appearance-none focus:ring-2 focus:ring-brand-500">
                    <option value="flexible" className="text-slate-900">Flexible</option>
                    <option value="short" className="text-slate-900">Strict / Short</option>
                  </select>
                </div>
              </div>
              <button disabled={loading} className="w-full mt-4 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-3 transition-all hover-lift glow-effect disabled:opacity-50 relative overflow-hidden group" type="submit">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing Constraints...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2">Generate Strategic Plan <Sparkles size={18} /></span>
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="p-6 rounded-3xl border border-brand-500/20 bg-brand-500/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            </div>
            <p className="text-sm text-slate-400">
              <strong className="text-white">Pro Tip:</strong> For high-stakes domains, the engine prioritizes security-focused V-Model principles within Agile sprints.
            </p>
          </div>
        </aside>

        {result ? (
          <div className="lg:col-span-7 space-y-6 animate-fade-in" data-purpose="results-dashboard" style={{ animationDelay: '200ms' }}>
            <div className="glass-morphism rounded-3xl overflow-hidden" data-purpose="summary-stats">
              <div className="bg-gradient-to-r from-slate-900/50 to-brand-900/50 p-8 border-b border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Recommended Framework</span>
                    <h2 className="text-3xl font-extrabold font-display text-white">
                      {result.generatedPlan.methodology} <span className="text-slate-500 font-normal mx-2">+</span> {result.generatedPlan.architecture.model}
                    </h2>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-green-400 text-sm font-bold">Optimal Match</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-medium">Est. Confidence</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{result.generatedPlan.confidenceScore}%</span>
                      <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500" style={{ width: `${result.generatedPlan.confidenceScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-medium">Proj. Duration</span>
                    <div className="text-2xl font-bold text-white">{result.generatedPlan.estimates.durationMonths} Months</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-medium">Total Resource Cost</span>
                    <div className="text-2xl font-bold text-white">{formatCurrency(result.generatedPlan.estimates.cost)}</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-brand-600/10 flex items-center justify-center gap-3">
                <span className="text-xs font-semibold text-brand-300">Continuous Feedback Loop: {feedbackSent ? 'Recorded' : 'Waiting...'}</span>
                {!feedbackSent ? (
                  <div className="flex gap-2 ml-2">
                    <button onClick={() => handleFeedback(true)} className="px-3 py-1 text-xs border border-brand-500/50 hover:bg-brand-500/20 text-brand-300 rounded transition-colors">Yes, Helpful</button>
                    <button onClick={() => handleFeedback(false)} className="px-3 py-1 text-xs border border-slate-500/50 hover:bg-slate-500/20 text-slate-400 rounded transition-colors">No</button>
                  </div>
                ) : (
                  <svg className="text-green-400" fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"></polyline></svg>
                )}
              </div>
            </div>

            <div className="glass-morphism rounded-3xl overflow-hidden" data-purpose="detailed-results">
              <div className="flex border-b border-white/10 px-6 overflow-x-auto scx">
                <button
                  className={`whitespace-nowrap px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'overview' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500 hover:text-white'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview & Risks
                </button>
                <button
                  className={`whitespace-nowrap px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'architecture' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500 hover:text-white'}`}
                  onClick={() => setActiveTab('architecture')}
                >
                  Architecture
                </button>
                <button
                  className={`whitespace-nowrap px-6 py-4 font-bold text-sm transition-colors ${activeTab === 'blueprints' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-500 hover:text-white'}`}
                  onClick={() => setActiveTab('blueprints')}
                >
                  Process Flow
                </button>
              </div>

              {activeTab === 'overview' && (
                <div className="p-8 space-y-8 animate-fade-in" data-purpose="overview-content">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Executive Summary</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {result.generatedPlan.riskAssessment.narrative.summary}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Critical Success Factors & Risks</h3>
                    <div className="grid gap-3">
                      {result.generatedPlan.riskAssessment.rationale.map((r, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group gap-4">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className={`mt-1 sm:mt-0 w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${r.impactScore > 0 ? 'bg-green-500/20 text-green-400' : r.impactScore < 0 ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                              {r.impactScore > 0 ? (
                                <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                              ) : r.impactScore < 0 ? (
                                <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>
                              ) : (
                                <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-300">{formatRisk(r.description)}</span>
                          </div>
                          <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${r.impactScore > 0 ? 'bg-green-400/10 text-green-400 border border-green-500/20' : r.impactScore < 0 ? 'bg-red-400/10 text-red-400 border border-red-500/20' : 'bg-slate-400/10 text-slate-400 border border-slate-500/20'}`}>
                            {r.impactScore > 0 ? `+${r.impactScore} Factor` : r.impactScore < 0 ? `${r.impactScore} Risk` : 'Neutral'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'architecture' && (
                <div className="p-8 space-y-6 animate-fade-in" data-purpose="architecture-content">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-400">
                      <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><rect height="16" rx="2" width="16" x="4" y="4"></rect><rect height="6" width="6" x="9" y="9"></rect><path d="M15 2v2"></path><path d="M15 20v2"></path><path d="M2 15h2"></path><path d="M2 9h2"></path><path d="M20 15h2"></path><path d="M20 9h2"></path><path d="M9 2v2"></path><path d="M9 20v2"></path></svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">System Structure Details</h3>
                  </div>
                  <ul className="list-disc list-inside text-slate-400 space-y-3 mb-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                    {result.generatedPlan.architecture.rationale.map((reason, idx) => (
                      <li key={idx} className="text-sm leading-relaxed">{reason}</li>
                    ))}
                  </ul>
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-slate-600 p-6 overflow-x-auto">
                     <MermaidDiagram chart={result.generatedPlan.blueprints.systemDiagram} />
                  </div>
                </div>
              )}

              {activeTab === 'blueprints' && (
                <div className="p-8 space-y-6 animate-fade-in" data-purpose="blueprints-content">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-400">
                      <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Process Workflow Blueprint</h3>
                  </div>
                  <div className="w-full bg-slate-900/80 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-slate-600 p-6 overflow-x-auto">
                     <MermaidDiagram chart={result.generatedPlan.blueprints.processDiagram} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 h-full min-h-[500px] glass-morphism rounded-3xl border border-white/10 p-12 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
            <div className="w-32 h-32 bg-slate-800/50 rounded-full flex items-center justify-center border border-white/5 relative shadow-2xl">
              <div className="absolute inset-0 rounded-full border border-brand-500/20 animate-[ping_3s_ease-in-out_infinite]"></div>
              <Sparkles size={48} className="text-brand-500/50" />
            </div>
            <div className="space-y-4 max-w-md">
              <h3 className="text-2xl font-bold text-white">Awaiting Project Specifications</h3>
              <p className="text-slate-400 leading-relaxed">
                Fill in the details on the left and hit generate to visualize your custom software development blueprint here.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full opacity-50 pointer-events-none mt-8">
              <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
              <div className="h-24 bg-white/5 rounded-2xl border border-white/5"></div>
              <div className="col-span-2 h-32 bg-white/5 rounded-2xl border border-white/5"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;
