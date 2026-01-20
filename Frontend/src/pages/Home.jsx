import { useNavigate } from "react-router-dom";
import DiamondGallery from "../components/DiamondGallery";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="grid-layout">
        {/* Left Column */}
        <div className="left-column">
          <h2 className="gradient-text">
            Plan Your Software Development Journey
          </h2>
          <p className="subtitle">
            AI-powered insights to choose the perfect methodology for your
            project. Get estimates, timelines, and risk assessments in seconds.
          </p>
          <button onClick={() => navigate("/planner")} className="btn-primary">
            Get Started →
          </button>
        </div>
        {/* Right Column */}
        <div className="right-column">
          <DiamondGallery />
        </div>
      </div>
    </div>
  );
};

export default Home;