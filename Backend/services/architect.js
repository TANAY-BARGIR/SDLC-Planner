// backend/services/architect.js
const { ARCH_TYPES } = require("../data/constants");

const evaluateArchitecture = (inputs) => {
  const p = inputs.parameters;

  // Initialize scores
  const scores = [
    { type: ARCH_TYPES.MONOLITHIC, score: 0, reason: [] },
    { type: ARCH_TYPES.LAYERED, score: 0, reason: [] },
    { type: ARCH_TYPES.MICROSERVICES, score: 0, reason: [] },
    { type: ARCH_TYPES.EVENT_DRIVEN, score: 0, reason: [] },
  ];

  // Helper to update scores
  const update = (type, points, reason) => {
    const arch = scores.find((a) => a.type === type);
    if (arch) {
      arch.score += points;
      arch.reason.push(reason);
    }
  };

  // --- LOGIC RULES ---

  // 1. Size Constraints
  if (p.size === "small") {
    update(
      ARCH_TYPES.MONOLITHIC,
      10,
      "Ideal for small, self-contained applications.",
    );
    update(
      ARCH_TYPES.MICROSERVICES,
      -20,
      "Overkill: Introduces massive overhead for small apps.",
    ); // Increased penalty
  } else if (p.size === "large") {
    update(
      ARCH_TYPES.MONOLITHIC,
      -10,
      "Difficult to maintain for large codebases.",
    );
    update(ARCH_TYPES.MICROSERVICES, 10, "Enables independent scaling.");
    update(ARCH_TYPES.EVENT_DRIVEN, 5, "Handles high complexity effectively.");
  }

  // 2. Team Skill Constraints
  if (p.teamSkill === "junior") {
    update(ARCH_TYPES.MONOLITHIC, 5, "Easy to develop, test, and deploy.");
    update(ARCH_TYPES.LAYERED, 5, "Standard structure is easy to learn.");
    update(
      ARCH_TYPES.MICROSERVICES,
      -15,
      "Requires advanced DevOps and distributed tracing skills.",
    );
  } else if (p.teamSkill === "senior") {
    update(
      ARCH_TYPES.MICROSERVICES,
      5,
      "Team can handle distributed complexity.",
    );
    update(ARCH_TYPES.EVENT_DRIVEN, 5, "Team can manage async data flows.");
  }

  // 3. Requirements Flexibility
  if (p.requirements === "dynamic") {
    update(
      ARCH_TYPES.MICROSERVICES,
      10,
      "Services can be deployed independently.",
    ); // Slight boost
    update(
      ARCH_TYPES.MONOLITHIC,
      -5,
      "Full redeployment needed for every change.",
    );
  }

  // 4. Budget Constraints (THE FIX IS HERE)
  if (p.budget === "tight") {
    update(
      ARCH_TYPES.MONOLITHIC,
      15,
      "Cost-effective: Single server deployment.",
    ); // Boosted Bonus
    update(
      ARCH_TYPES.MICROSERVICES,
      -25,
      "Rejected: High infrastructure/orchestration costs exceed budget.",
    ); // Massive Penalty
    update(
      ARCH_TYPES.EVENT_DRIVEN,
      -10,
      "Complex infrastructure often exceeds tight budgets.",
    ); // New Penalty
  }

  // 5. Safety Critical
  if (p.safetyCritical) {
    update(
      ARCH_TYPES.LAYERED,
      10,
      "Strict separation of concerns aids verification.",
    );
    update(ARCH_TYPES.EVENT_DRIVEN, -5, "Async flows are harder to validate.");
  }

  // --- SELECTION ---
  scores.sort((a, b) => b.score - a.score);
  const bestFit = scores[0];

  // Determine Diagram Type for Phase 6
  let diagramType = "simple";
  if (bestFit.type === ARCH_TYPES.MICROSERVICES) diagramType = "distributed";
  if (bestFit.type === ARCH_TYPES.EVENT_DRIVEN) diagramType = "async";

  // Normalize Score (0-100)
  let normalizedScore = 50 + bestFit.score * 2;
  normalizedScore = Math.min(Math.max(normalizedScore, 0), 100);

  return {
    model: bestFit.type,
    score: normalizedScore,
    rationale: bestFit.reason,
    diagramType: diagramType,
  };
};

module.exports = { evaluateArchitecture };
