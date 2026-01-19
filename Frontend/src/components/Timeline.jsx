import React from "react";

const Timeline = ({ phases }) => {
  return (
    <div className="timeline-container">
      <h3>📅 Project Roadmap</h3>
      <div className="timeline-track">
        {phases.map((phase, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="step-number">Phase {index + 1}</span>
              <span className="step-name">{phase}</span>
            </div>
            {index < phases.length - 1 && <div className="timeline-line"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
