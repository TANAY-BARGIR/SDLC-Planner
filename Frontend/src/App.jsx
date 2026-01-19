// frontend/src/App.jsx
import { useState } from "react";
import { generatePlan } from "./api";
import Timeline from "./components/Timeline"; // Import Timeline
import { formatRisk, formatCurrency } from "./utils/utils.js"; // Import Utils
import "./index.css";

function App() {
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
      const response = await generatePlan(payload);
      setResult(response.data);
    } catch (err) {
      alert("Simulation Failed! Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🚀 SDLC Simulator</h1>
      <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
        AI-Powered Software Planning Engine
      </p>

      {/* --- INPUT FORM --- */}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="e.g. NextGen FinTech App"
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {/* Project Size */}
            <div className="form-group">
              <label>Project Size</label>
              <select name="size" value={formData.size} onChange={handleChange}>
                <option value="small">Small (&lt; 20 KLOC)</option>
                <option value="medium">Medium (20-100 KLOC)</option>
                <option value="large">Large (&gt; 100 KLOC)</option>
              </select>
            </div>

            {/* Requirements */}
            <div className="form-group">
              <label>Requirements Stability</label>
              <select
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
              >
                <option value="fixed">Fixed / Clear</option>
                <option value="dynamic">Dynamic / Vague</option>
              </select>
            </div>

            {/* Team Skill */}
            <div className="form-group">
              <label>Team Skill</label>
              <select
                name="teamSkill"
                value={formData.teamSkill}
                onChange={handleChange}
              >
                <option value="junior">Junior (Learners)</option>
                <option value="mixed">Mixed (Standard)</option>
                <option value="senior">Senior (Experts)</option>
              </select>
            </div>

            {/* Safety Critical */}
            <div className="form-group">
              <label>Safety Critical?</label>
              <select
                name="safetyCritical"
                value={formData.safetyCritical}
                onChange={handleChange}
              >
                <option value="false">No (Standard App)</option>
                <option value="true">Yes (Life/Money Critical)</option>
              </select>
            </div>

            {/* Budget */}
            <div className="form-group">
              <label>Budget</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="flexible">Flexible</option>
                <option value="tight">Tight Constraint</option>
              </select>
            </div>

            {/* Timeline */}
            <div className="form-group">
              <label>Timeline</label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
              >
                <option value="flexible">Flexible</option>
                <option value="short">Short (Rush)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Simulating..." : "Generate Plan"}
          </button>
        </form>
      </div>

      {/* --- RESULTS DISPLAY --- */}
      {result && (
        <div className="result-card">
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                OPTIMAL METHODOLOGY
              </span>
              <h2 style={{ margin: 0 }}>{result.generatedPlan.methodology}</h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                className="badge score"
                style={{ fontSize: "1.2rem", padding: "0.5rem 1rem" }}
              >
                {result.generatedPlan.confidenceScore}% Confidence
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              marginTop: "1.5rem",
              background: "#0f172a",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                ESTIMATED COST
              </div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {formatCurrency(result.generatedPlan.estimates.cost)}
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                borderLeft: "1px solid #334155",
                borderRight: "1px solid #334155",
              }}
            >
              <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                DURATION
              </div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {result.generatedPlan.estimates.durationMonths} Months
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                TEAM SIZE
              </div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {result.generatedPlan.estimates.teamSize} Engineers
              </div>
            </div>
          </div>

          {/* New Timeline Visualizer */}
          <Timeline phases={result.generatedPlan.phases} />

          {/* Consultant Report */}
          <div style={{ marginTop: "2rem", lineHeight: "1.6" }}>
            <h3>👨‍💼 Consultant Report</h3>
            <p>
              <strong>Summary:</strong>{" "}
              {result.generatedPlan.riskAssessment.narrative.summary}
            </p>
            <p>
              <strong>Evidence:</strong>{" "}
              {result.generatedPlan.riskAssessment.narrative.evidence}
            </p>

            <div
              style={{
                background: "#334155",
                padding: "1rem",
                borderRadius: "6px",
                marginTop: "1rem",
              }}
            >
              <strong style={{ color: "#ef4444" }}>⚠️ Risk Analysis:</strong>
              <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.5rem" }}>
                {/* We parse the raw text string into list items for better readability */}
                {result.generatedPlan.riskAssessment.narrative.riskAnalysis
                  .split(";")
                  .map((risk, i) => {
                    const cleanRisk = risk
                      .replace("Key risk factors identified include:", "")
                      .trim();
                    if (!cleanRisk || cleanRisk === ".") return null;
                    return (
                      <li key={i} style={{ marginBottom: "0.5rem" }}>
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
  );
}

export default App;
