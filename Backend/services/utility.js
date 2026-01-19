// backend/services/utility.js
const RULES = require("../data/rules");

const normalize = (val, max) => Math.min(val / max, 1);

// UPDATE THIS FUNCTION
const computeUtility = (
  candidate,
  estimates,
  riskPenalty,
  budgetConstraint
) => {
  const W_COST = 0.3;
  const W_TIME = 0.3;
  const W_RISK = 0.4;

  // 1. Cost Utility (Max Budget increased to 5M so Medium projects aren't 0)
  const costU = 1 - normalize(estimates.estimatedBudget, 5000000);

  // 2. Time Utility (Max Time increased to 36 months)
  const timeU = 1 - normalize(estimates.durationMonths, 36);

  // 3. Risk Utility
  const riskU = (100 + Math.max(riskPenalty, -100)) / 100;

  // 4. Weighted Sum
  let utilityScore = costU * W_COST + timeU * W_TIME + riskU * W_RISK;

  // --- STRONG PENALTY FOR TIGHT BUDGET ---
  // If budget is tight, we reduce the FINAL utility score
  if (budgetConstraint === "tight") {
    utilityScore = utilityScore * 0.8; // 20% penalty on total utility
  }

  return parseFloat(utilityScore.toFixed(3));
};
// --- Main Evaluation Function ---
const evaluateCandidate = (candidate, inputs) => {
  let score = 100; // Base Confidence Score
  const trace = [];
  let isValid = true;

  // Breakdown for analysis
  const breakdown = {
    RISK: 0,
    SUITABILITY: 0,
    TEAM: 0,
    COMPLIANCE: 0,
  };

  RULES.forEach((rule) => {
    // 1. HARD Constraints
    if (rule.type === "HARD") {
      const passed = rule.condition(candidate, inputs);
      if (!passed) {
        isValid = false;
        trace.push({
          id: rule.id,
          type: "VIOLATION",
          description: rule.description, // Unified field name
          category: rule.category,
          impactScore: -100, // Hard fail
        });
      }
    }
    // 2. SOFT Constraints
    else if (rule.type === "SOFT") {
      const impact = rule.impact(candidate, inputs);
      if (impact !== 0) {
        score += impact;

        // Track stats
        if (breakdown[rule.category] !== undefined) {
          breakdown[rule.category] += impact;
        }

        // Corrected Trace Push
        trace.push({
          id: rule.id,
          type: rule.category, // e.g., RISK, SUITABILITY
          description: rule.description,
          impactScore: impact,
        });
      }
    }
  });

  return { isValid, score, trace, breakdown };
};

module.exports = { evaluateCandidate, computeUtility };
