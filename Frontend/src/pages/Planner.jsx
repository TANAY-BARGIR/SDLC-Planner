// frontend/src/pages/Planner.jsx
import { useState } from "react";
import MermaidDiagram from "../components/MermaidDiagram";
import { formatCurrency, formatRisk } from "../utils/utils.js";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  FileText,
  Cpu,
} from "lucide-react";

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
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1>New Project Blueprint</h1>
        <p>
          Define your constraints to generate a comprehensive SDLC strategy.
        </p>
      </div>

      {/* Input Section */}
      <div
        className="card"
        style={{ maxWidth: "1000px", margin: "0 auto 3rem auto" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">Project Name</label>
              <input
                className="form-input"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="e.g. NextGen FinTech App"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Project Size</label>
              <select
                className="form-select"
                name="size"
                value={formData.size}
                onChange={handleChange}
              >
                <option value="small">Small (&lt; 20 KLOC)</option>
                <option value="medium">Medium (20-100 KLOC)</option>
                <option value="large">Large (&gt; 100 KLOC)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Requirements</label>
              <select
                className="form-select"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
              >
                <option value="fixed">Fixed / Stable</option>
                <option value="dynamic">Dynamic / Evolving</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Team Skill</label>
              <select
                className="form-select"
                name="teamSkill"
                value={formData.teamSkill}
                onChange={handleChange}
              >
                <option value="junior">Junior</option>
                <option value="mixed">Mixed</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Budget</label>
              <select
                className="form-select"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="flexible">Flexible</option>
                <option value="tight">Tight</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Criticality</label>
              <select
                className="form-select"
                name="safetyCritical"
                value={formData.safetyCritical}
                onChange={handleChange}
              >
                <option value="false">Standard</option>
                <option value="true">Safety Critical</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Analyzing Constraints..." : "Generate Strategic Plan"}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="results-grid">
          {/* LEFT COLUMN: Stats & Strategy */}
          <div className="card" style={{ height: "fit-content" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <span className="stat-label">Recommended Methodology</span>
              <h2 style={{ color: "#4f46e5", marginTop: "0.5rem" }}>
                {result.generatedPlan.methodology}
              </h2>
              <div
                style={{
                  marginTop: "0.5rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#eff6ff",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  color: "#1d4ed8",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                <Layers size={16} />
                {result.generatedPlan.architecture.model}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div className="stat-box">
                <div className="stat-label">Confidence</div>
                <div className="stat-value" style={{ color: "#10b981" }}>
                  {result.generatedPlan.confidenceScore}%
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-label">Duration</div>
                <div className="stat-value">
                  {result.generatedPlan.estimates.durationMonths} Mo
                </div>
              </div>
            </div>

            <div className="stat-box" style={{ marginBottom: "1.5rem" }}>
              <div className="stat-label">Estimated Cost</div>
              <div className="stat-value">
                {formatCurrency(result.generatedPlan.estimates.cost)}
              </div>
            </div>

            {/* Feedback Loop */}
            {!feedbackSent ? (
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: "8px",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Was this plan helpful?
                </p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleFeedback(true)}
                    className="btn btn-outline"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className="btn btn-outline"
                    style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <p
                style={{
                  color: "#10b981",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                ✓ Feedback recorded.
              </p>
            )}
          </div>

          {/* RIGHT COLUMN: Deep Dive Tabs */}
          <div className="card">
            {/* NEW TABS UI */}
            <div className="tab-group">
              <button
                className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <Info
                  size={16}
                  style={{
                    display: "inline",
                    verticalAlign: "text-bottom",
                    marginRight: "6px",
                  }}
                />
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === "architecture" ? "active" : ""}`}
                onClick={() => setActiveTab("architecture")}
              >
                <Cpu
                  size={16}
                  style={{
                    display: "inline",
                    verticalAlign: "text-bottom",
                    marginRight: "6px",
                  }}
                />
                Architecture
              </button>
              <button
                className={`tab-btn ${activeTab === "blueprints" ? "active" : ""}`}
                onClick={() => setActiveTab("blueprints")}
              >
                <FileText
                  size={16}
                  style={{
                    display: "inline",
                    verticalAlign: "text-bottom",
                    marginRight: "6px",
                  }}
                />
                Blueprints
              </button>
            </div>

            <div style={{ padding: "0.5rem 0" }}>
              {activeTab === "overview" && (
                <div>
                  <div className="content-card">
                    <div className="section-title">
                      <Info size={20} /> Executive Summary
                    </div>
                    <p style={{ lineHeight: "1.7", color: "#334155" }}>
                      {result.generatedPlan.riskAssessment.narrative.summary}
                    </p>
                  </div>

                  <div className="section-title">
                    <AlertTriangle size={20} /> Critical Factors
                  </div>
                  <div className="risk-list">
                    {result.generatedPlan.riskAssessment.rationale.map(
                      (r, i) => (
                        <div key={i} className="risk-item">
                          <span
                            style={{ color: "#334155", fontSize: "0.95rem" }}
                          >
                            {formatRisk(r.description)}
                          </span>

                          {r.impactScore > 0 ? (
                            <span className="risk-badge badge-green">
                              +{r.impactScore} Bonus
                            </span>
                          ) : r.impactScore < 0 ? (
                            <span className="risk-badge badge-red">
                              {r.impactScore} Risk
                            </span>
                          ) : (
                            <span className="risk-badge badge-gray">
                              Neutral
                            </span>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {activeTab === "architecture" && (
                <div>
                  <div className="content-card">
                    <div className="section-title">
                      <Cpu size={20} />{" "}
                      {result.generatedPlan.architecture.model}
                    </div>
                    <ul style={{ paddingLeft: "1.2rem", marginBottom: "0" }}>
                      {result.generatedPlan.architecture.rationale.map(
                        (reason, idx) => (
                          <li
                            key={idx}
                            style={{ marginBottom: "0.5rem", color: "#475569" }}
                          >
                            {reason}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div className="section-title">
                    <Layers size={20} /> System Structure
                  </div>
                  <MermaidDiagram
                    chart={result.generatedPlan.blueprints.systemDiagram}
                  />
                </div>
              )}

              {activeTab === "blueprints" && (
                <div>
                  <div className="section-title">
                    <FileText size={20} /> Process Workflow
                  </div>
                  <p style={{ marginBottom: "1rem", color: "#64748b" }}>
                    Standard lifecycle phases for{" "}
                    {result.generatedPlan.methodology}:
                  </p>
                  <MermaidDiagram
                    chart={result.generatedPlan.blueprints.processDiagram}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
