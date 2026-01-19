// backend/services/ranker.js
const { toFeatureVector } = require("./features");
const MODEL = require("../data/model_v1.json");

const scoreCandidate = (candidate, inputs) => {
  // 1. Convert to Numbers
  const features = toFeatureVector(candidate, inputs);

  // 2. Start with Base Bias
  let mlScore = MODEL.bias;
  const explanation = [];

  // 3. Linear Weights (Base Features)
  // Formula: Score += Weight * FeatureValue
  for (const [key, value] of Object.entries(features)) {
    if (value === 1 && MODEL.weights[key]) {
      const w = MODEL.weights[key];
      mlScore += w;
      if (Math.abs(w) > 5) {
        // Only explain significant factors
        explanation.push(`${key} (${w > 0 ? "+" : ""}${w})`);
      }
    }
  }

  // 4. Interaction Terms (The Contextual Logic)
  // e.g., "Agile is good, BUT Agile + Safety Critical is bad"
  MODEL.weights.interaction_terms.forEach((term) => {
    // Check if ALL features in this term are active (1)
    const isActive = term.features.every((f) => features[f] === 1);

    if (isActive) {
      mlScore += term.weight;
      explanation.push(
        `${term.features.join(" + ")} (${term.weight > 0 ? "+" : ""}${
          term.weight
        })`
      );
    }
  });

  // 5. Clamp Result (0 - 100)
  return {
    score: Math.min(Math.max(mlScore, 0), 100),
    mlExplanation: explanation,
  };
};

module.exports = { scoreCandidate };
