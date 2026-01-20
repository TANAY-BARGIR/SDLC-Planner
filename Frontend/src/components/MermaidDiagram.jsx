import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "base", // Cleaner than default
  themeVariables: {
    primaryColor: "#e0e7ff",
    primaryBorderColor: "#4f46e5",
    lineColor: "#64748b",
  },
  securityLevel: "loose",
});

const MermaidDiagram = ({ chart }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      containerRef.current.removeAttribute("data-processed");
      containerRef.current.innerHTML = chart; // Reset content
      mermaid.init(undefined, containerRef.current);
    }
  }, [chart]);

  return (
    <div
      className="mermaid"
      ref={containerRef}
      style={{
        background: "#ffffff",
        padding: "2rem",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem",
      }}
    >
      {chart}
    </div>
  );
};

export default MermaidDiagram;
