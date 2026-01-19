// backend/test_explanation.js
const { generatePlan } = require("./services/planner");

const testExplanation = () => {
  const inputs = {
    parameters: {
      size: "large", // Large projects struggle with Agile
      requirements: "dynamic", // Agile loves dynamic
      teamSkill: "junior", // Juniors struggle with Agile
      timeline: "flexible",
      budget: "flexible",
    },
  };

  const { bestPlan } = generatePlan(inputs);

  console.log(`\n🏆 Winner: ${bestPlan.model}`);
  console.log(`📊 Final Score: ${bestPlan.score}/100`);

  console.log("\n--- 🧠 The AI's Reasoning ---");
  bestPlan.rationale.forEach((r) => {
    console.log(`[${r.type}] ${r.description} (Impact: ${r.impactScore})`);
  });
};

testExplanation();
