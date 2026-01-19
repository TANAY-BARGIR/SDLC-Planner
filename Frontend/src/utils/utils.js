// frontend/src/utils.js

const DICTIONARY = {
  // Sizes
  size_large: "Large Scale Project",
  size_medium: "Medium Scale Project",
  size_small: "Small Scale Project",

  // Teams
  team_junior: "Inexperienced Team",
  team_senior: "Expert Team",
  team_mixed: "Mixed Skill Team",

  // Models
  model_agile: "Agile Methodology",
  model_waterfall: "Waterfall Methodology",

  // Risks/Factors
  "short timelines penalize heavy process models":
    "Timeline too short for heavy process",
  "dynamic requirements strongly favor agile iterations":
    "Dynamic scope needs Agile",
  "junior teams require structure": "Juniors need structured workflow",
};

export const formatRisk = (rawString) => {
  // Example Input: "team_junior (-15)" or "size_large (-20)"

  // 1. Check if it's an ML factor (contains underscore usually)
  Object.keys(DICTIONARY).forEach((key) => {
    if (rawString.includes(key)) {
      rawString = rawString.replace(key, DICTIONARY[key]);
    }
  });

  // 2. Clean up "Impact: AI Pattern Detected"
  if (rawString.includes("AI Pattern Detected")) {
    return `🤖 AI Insight: ${rawString.split(" (Impact")[0]}`;
  }

  return rawString;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  }).format(amount);
};
