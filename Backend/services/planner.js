// backend/services/planner.js
const { evaluateCandidate, computeUtility } = require("./utility");
const { estimateResources, getPhases } = require("./estimator");
const { SDLC_TYPES } = require("../data/constants");
const { scoreCandidate } = require("./ranker"); // ✅ Correct Import

// Expanded Dimensions
const MODELS = Object.values(SDLC_TYPES);
const DOC_LEVELS = ["Low", "Medium", "High"];
const TEST_STRATEGIES = [
  "Manual Testing",
  "Automated Unit Tests",
  "TDD (Test Driven Dev)",
];

const generatePlan = (inputs) => {
  let validCandidates = [];

  // 1. Generate Combinations
  MODELS.forEach((model) => {
    DOC_LEVELS.forEach((docLevel) => {
      TEST_STRATEGIES.forEach((testStrat) => {
        let candidate = {
          model: model,
          documentationLevel: docLevel,
          testingStrategy: testStrat,
        };

        // 2. Evaluate (Rules)
        const evaluation = evaluateCandidate(candidate, inputs);

        if (evaluation.isValid) {
          // Hydrate Data
          candidate.estimates = estimateResources(inputs.parameters);
          candidate.phases = getPhases(model);

          if (testStrat === "TDD (Test Driven Dev)") {
            candidate.phases = candidate.phases.map((p) =>
              p === "Coding" ? "Coding (TDD Cycle)" : p
            );
          }

          candidate.score = evaluation.score; // Base Rule Score
          candidate.rationale = evaluation.trace;
          candidate.breakdown = evaluation.breakdown;

          // 3. Calculate Utility (Economics)
          const riskPenalty = evaluation.breakdown
            ? evaluation.breakdown.RISK
            : 0;
          candidate.utility = computeUtility(
            candidate,
            candidate.estimates,
            riskPenalty,
            inputs.parameters.budget
          );

          // 4. Calculate ML Score (Pattern Matching)
          const mlResult = scoreCandidate(candidate, inputs);
          candidate.mlScore = mlResult.score;

          // 5. Final Composite Score (The "Hybrid" Logic)
          // 40% Rules (Safety) + 30% Utility (Economics) + 30% ML (Pattern Matching)
          // We assume Utility is 0-1, so we multiply by 100
          candidate.score =
            candidate.score * 0.4 +
            candidate.utility * 100 * 0.3 +
            candidate.mlScore * 0.3;

          // 6. Explain the AI Decision
          if (mlResult.mlExplanation.length > 0) {
            candidate.rationale.push({
              id: "AI001",
              type: "AI_FACTOR",
              description:
                "Machine Learning Adjustment: " +
                mlResult.mlExplanation.slice(0, 2).join(", "),
              impactScore: 0, // Score impact is already calculated above
            });
          }

          validCandidates.push(candidate);
        }
      });
    });
  });

  // 7. Sort by Score
  validCandidates.sort((a, b) => b.score - a.score);

  // 8. Calibrate & Round
  const calibratedCandidates = validCandidates.map((c) => {
    let calibrated = c.score;
    if (calibrated > 100) calibrated = 100;
    if (calibrated < 0) calibrated = 0;
    return { ...c, score: Math.round(calibrated) };
  });

  return {
    bestPlan: calibratedCandidates[0],
    alternatives: calibratedCandidates.slice(1, 3),
  };
};

module.exports = { generatePlan };
