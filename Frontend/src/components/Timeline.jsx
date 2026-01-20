const Timeline = ({ phases }) => {
  return (
    <div className="timeline-wrapper">
      <h3
        style={{ margin: "0 0 1.5rem 0", color: "#667eea", fontSize: "1.3rem" }}
      >
        📅 Project Roadmap
      </h3>
      <div className="timeline-track">
        {phases.map((phase, index) => (
          <div key={index} className="timeline-step">
            <div className="timeline-dot"></div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="stat-label">Phase {index + 1}</span>
              <span className="timeline-phase-name">{phase}</span>
            </div>
            {index < phases.length - 1 && <div className="timeline-line"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
