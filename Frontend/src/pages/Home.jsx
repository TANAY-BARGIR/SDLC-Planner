// frontend/src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { Layers, Zap, ShieldCheck } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // Common style for the circular icon background
  const iconBoxStyle = (bgColor, color) => ({
    background: bgColor,
    color: color,
    width: "64px", // FIXED WIDTH
    height: "64px", // FIXED HEIGHT
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
  });

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1
          style={{ color: "#0f172a", fontSize: "3rem", marginBottom: "1.5rem" }}
        >
          Engineering Decisions, <br />
          <span style={{ color: "#4f46e5" }}>Backed by Data.</span>
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            margin: "0 auto 2.5rem auto",
            maxWidth: "600px",
            color: "#475569",
          }}
        >
          Stop guessing your SDLC methodology. Our AI Consultant analyzes your
          project constraints to recommend the optimal process, architecture,
          and risk mitigation strategy.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "4rem",
          }}
        >
          <button
            onClick={() => navigate("/planner")}
            className="btn btn-primary"
            style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}
          >
            Start New Project
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}
          >
            View Case Studies
          </button>
        </div>

        {/* Trust Badges - Fixed Layout */}
        <div
          className="hero-badges"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "4rem",
            flexWrap: "wrap",
          }}
        >
          <div
            className="badge-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={iconBoxStyle("#e0e7ff", "#4f46e5")}>
              <Layers size={32} />
            </div>
            <span style={{ fontWeight: "600", color: "#334155" }}>
              Architecture Design
            </span>
          </div>

          <div
            className="badge-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={iconBoxStyle("#dcfce7", "#10b981")}>
              <Zap size={32} />
            </div>
            <span style={{ fontWeight: "600", color: "#334155" }}>
              Process Optimization
            </span>
          </div>

          <div
            className="badge-item"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={iconBoxStyle("#fee2e2", "#ef4444")}>
              <ShieldCheck size={32} />
            </div>
            <span style={{ fontWeight: "600", color: "#334155" }}>
              Risk Compliance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
