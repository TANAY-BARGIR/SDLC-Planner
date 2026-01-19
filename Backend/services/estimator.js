// backend/services/estimator.js
const { COCOMO_MODES, SDLC_TYPES } = require("../data/constants");

const estimateResources = (details) => {
  let KLOC = 0;
  // Size Heuristics
  switch (details.size) {
    case "small":
      KLOC = 20;
      break;
    case "medium":
      KLOC = 50;
      break;
    case "large":
      KLOC = 120;
      break;
    default:
      KLOC = 30;
  }

  // Complexity Mode Selection
  let mode = COCOMO_MODES.SEMI_DETACHED;
  if (details.safetyCritical) mode = COCOMO_MODES.EMBEDDED;
  else if (details.requirements === "fixed" && details.size === "small")
    mode = COCOMO_MODES.ORGANIC;

  // Basic COCOMO Calculation
  const effort = mode.a * Math.pow(KLOC, mode.b);
  const duration = mode.c * Math.pow(effort, mode.d);
  const personnel = effort / duration;
  const estimatedCost = effort * 5000;

  return {
    effort: Math.round(effort),
    durationMonths: Math.round(duration * 10) / 10,
    personnel: Math.round(personnel),
    estimatedBudget: Math.round(estimatedCost),
    complexityMode: mode.desc,
  };
};

const getPhases = (model) => {
  if (model === SDLC_TYPES.WATERFALL)
    return [
      "Requirements",
      "System Design",
      "Implementation",
      "Testing",
      "Deployment",
    ];
  if (model === SDLC_TYPES.AGILE)
    return [
      "Backlog Creation",
      "Sprint Planning",
      "Dev/Test Loop",
      "Review/Retro",
      "Release",
    ];
  if (model === SDLC_TYPES.SPIRAL)
    return [
      "Objectives",
      "Risk Analysis",
      "Engineering",
      "Planning Next Phase",
    ];

  // FIX: Moved this check UP, before the default return
  if (model === "V-Model")
    return [
      "Requirements",
      "System Design",
      "Arch. Design",
      "Module Design",
      "Coding",
      "Unit Test",
      "Integration Test",
      "System Test",
      "Acceptance Test",
    ];

  // Default / Fallback
  return ["Planning", "Execution", "Closing"];
};

module.exports = { estimateResources, getPhases };
