// backend/data/constants.js

// COCOMO I (Basic) Constants
// Formula: Effort = a * (KLOC)^b
// Modes based on project complexity
const COCOMO_MODES = {
  ORGANIC: { a: 2.4, b: 1.05, c: 2.5, d: 0.38, desc: "Small, simple projects with experienced teams." },
  SEMI_DETACHED: { a: 3.0, b: 1.12, c: 2.5, d: 0.35, desc: "Intermediate size and complexity." },
  EMBEDDED: { a: 3.6, b: 1.20, c: 2.5, d: 0.32, desc: "Tight constraints, complex hardware/software interactions." }
};

// SDLC Characteristics (Unit 1 Syllabus)
const SDLC_TYPES = {
  WATERFALL: "Waterfall Model",
  AGILE: "Agile (Scrum/Kanban)",
  SPIRAL: "Spiral Model",
  V_MODEL: "V-Model"
};

// Risk Thresholds
const RISK_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical"
};

module.exports = { COCOMO_MODES, SDLC_TYPES, RISK_LEVELS };