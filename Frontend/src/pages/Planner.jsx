import { useState } from "react";
import Timeline from "../components/Timeline";

const Planner = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
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

    const payload = {
      projectName: formData.projectName,
      description: "Generated via UI",
      parameters: {
        size: formData.size,
        requirements: formData.requirements,
        teamSkill: formData.teamSkill,
        timeline: formData.timeline,
        budget: formData.budget,
        safetyCritical: formData.safetyCritical === "true",
      },
    };

    try {
      const response = await fetch("http://localhost:5000/api/inception", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      alert("Simulation Failed! Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumSignificantDigits: 3,
    }).format(amount);
  };

  const formatRisk = (rawString) => {
    const DICTIONARY = {
      size_large: "Large Scale Project",
      size_medium: "Medium Scale Project",
      size_small: "Small Scale Project",
      team_junior: "Inexperienced Team",
      team_senior: "Expert Team",
      team_mixed: "Mixed Skill Team",
      model_agile: "Agile Methodology",
      model_waterfall: "Waterfall Methodology",
      "short timelines penalize heavy process models":
        "Timeline too short for heavy process",
      "dynamic requirements strongly favor agile iterations":
        "Dynamic scope needs Agile",
      "junior teams require structure": "Juniors need structured workflow",
    };

    Object.keys(DICTIONARY).forEach((key) => {
      if (rawString.includes(key))
        rawString = rawString.replace(key, DICTIONARY[key]);
    });

    if (rawString.includes("AI Pattern Detected")) {
      return `🤖 AI Insight: ${rawString.split(" (Impact")[0]}`;
    }
    return rawString;
  };

  return (
    <div className="page-container planner-layout">
      <div>
        <h1
          className="gradient-text"
          style={{ textAlign: "center", fontSize: "2.5rem" }}
        >
          🚀 SDLC Simulator
        </h1>
        <p className="subtitle" style={{ textAlign: "center" }}>
          AI-Powered Software Planning Engine
        </p>

        {/* Form Card */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
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
            <div className="form-grid">
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
                <label className="form-label">Requirements Stability</label>
                <select
                  className="form-select"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                >
                  <option value="fixed">Fixed / Clear</option>
                  <option value="dynamic">Dynamic / Vague</option>
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
                  <option value="junior">Junior (Learners)</option>
                  <option value="mixed">Mixed (Standard)</option>
                  <option value="senior">Senior (Experts)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Safety Critical?</label>
                <select
                  className="form-select"
                  name="safetyCritical"
                  value={formData.safetyCritical}
                  onChange={handleChange}
                >
                  <option value="false">No (Standard App)</option>
                  <option value="true">Yes (Life/Money Critical)</option>
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
                  <option value="tight">Tight Constraint</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Timeline</label>
                <select
                  className="form-select"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                >
                  <option value="flexible">Flexible</option>
                  <option value="short">Short (Rush)</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-full"
            >
              {loading ? "Simulating..." : "Generate Plan"}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="results-container">
            <div className="result-header">
              <div>
                <span className="stat-label">OPTIMAL METHODOLOGY</span>
                <h2 className="methodology-title">
                  {result.generatedPlan.methodology}
                </h2>
              </div>
              <span className="confidence-badge">
                {result.generatedPlan.confidenceScore}% Confidence
              </span>
            </div>

            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-label">ESTIMATED COST</span>
                <div className="stat-value">
                  {formatCurrency(result.generatedPlan.estimates.cost)}
                </div>
              </div>
              <div
                className="stat-item"
                style={{
                  borderLeft: "2px solid #e2e8f0",
                  borderRight: "2px solid #e2e8f0",
                }}
              >
                <span className="stat-label">DURATION</span>
                <div className="stat-value">
                  {result.generatedPlan.estimates.durationMonths} Months
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-label">TEAM SIZE</span>
                <div className="stat-value">
                  {result.generatedPlan.estimates.teamSize} Engineers
                </div>
              </div>
            </div>

            <Timeline phases={result.generatedPlan.phases} />

            <div className="consultant-report">
              <h3
                style={{
                  color: "#667eea",
                  fontSize: "1.3rem",
                  marginBottom: "1rem",
                }}
              >
                👨‍💼 Consultant Report
              </h3>
              <p className="report-section">
                <strong className="report-label">Summary:</strong>{" "}
                {result.generatedPlan.riskAssessment.narrative.summary}
              </p>
              <p className="report-section">
                <strong className="report-label">Evidence:</strong>{" "}
                {result.generatedPlan.riskAssessment.narrative.evidence}
              </p>

              <div className="risk-box">
                <strong className="risk-title">⚠️ Risk Analysis:</strong>
                <ul className="risk-list">
                  {result.generatedPlan.riskAssessment.narrative.riskAnalysis
                    .split(";")
                    .map((risk, i) => {
                      const cleanRisk = risk
                        .replace("Key risk factors identified include:", "")
                        .trim();
                      if (!cleanRisk || cleanRisk === ".") return null;
                      return (
                        <li key={i} className="risk-item">
                          {formatRisk(cleanRisk)}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planner;