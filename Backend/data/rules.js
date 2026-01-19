// backend/data/rules.js
const { COCOMO_MODES, SDLC_TYPES } = require("./constants");

const RULES = [
  // --- HARD CONSTRAINTS (Deal Breakers) ---
  {
    id: "H001",
    type: "HARD",
    category: "COMPLIANCE",
    description: "Safety-Critical systems strictly require high documentation.",
    condition: (candidate, inputs) => {
      if (inputs.parameters.safetyCritical) {
        return candidate.documentationLevel === "High";
      }
      return true;
    },
  },
  {
    id: "H002",
    type: "HARD",
    category: "FEASIBILITY",
    description:
      "Agile models cannot be used with fixed-price, strict contracts.",
    condition: (candidate, inputs) => {
      if (
        inputs.parameters.budget === "tight" &&
        inputs.parameters.requirements === "fixed"
      ) {
        return candidate.model !== SDLC_TYPES.AGILE;
      }
      return true;
    },
  },

  // --- RISKS (Specific Named Scenarios - The "Red Flags") ---
  {
    id: "R001",
    type: "SOFT",
    category: "RISK",
    weight: -40, // Massive Penalty
    description:
      "DEATH MARCH RISK: Short timeline for a safety-critical/large project.",
    impact: (candidate, inputs) => {
      if (
        inputs.parameters.timeline === "short" &&
        (inputs.parameters.safetyCritical || inputs.parameters.size === "large")
      ) {
        return -40;
      }
      return 0;
    },
  },
  {
    id: "R002",
    type: "SOFT",
    category: "RISK",
    weight: -30,
    description: "CHAOS TRAP: Junior team combined with dynamic requirements.",
    impact: (candidate, inputs) => {
      if (
        inputs.parameters.teamSkill === "junior" &&
        inputs.parameters.requirements === "dynamic"
      ) {
        if (candidate.model === SDLC_TYPES.AGILE) return -30;
      }
      return 0;
    },
  },

  // --- METHODOLOGY FIT (Soft Constraints) ---
  {
    id: "S001",
    type: "SOFT",
    category: "SUITABILITY",
    weight: 20,
    description: "Dynamic requirements strongly favor Agile iterations.",
    impact: (candidate, inputs) => {
      if (inputs.parameters.requirements === "dynamic") {
        if (candidate.model === SDLC_TYPES.AGILE) return 20;
        if (candidate.model === SDLC_TYPES.WATERFALL) return -20;
      }
      return 0;
    },
  },
  {
    id: "S002",
    type: "SOFT",
    category: "SUITABILITY",
    weight: 15,
    description: "Short timelines penalize heavy process models.",
    impact: (candidate, inputs) => {
      if (inputs.parameters.timeline === "short") {
        if (
          candidate.model === SDLC_TYPES.SPIRAL ||
          candidate.model === SDLC_TYPES.WATERFALL
        )
          return -15;
        if (candidate.model === SDLC_TYPES.AGILE) return 10;
      }
      return 0;
    },
  },
  {
    id: "S003",
    type: "SOFT",
    category: "TEAM",
    weight: 25,
    description:
      "Junior teams require structure (Waterfall/V-Model) over autonomy.",
    impact: (candidate, inputs) => {
      if (inputs.parameters.teamSkill === "junior") {
        if (candidate.model === SDLC_TYPES.AGILE) return -25;
        if (candidate.model === SDLC_TYPES.WATERFALL) return 15;
      }
      return 0;
    },
  },
];

module.exports = RULES;
