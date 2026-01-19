const { generatePlan } = require("../services/planner");

describe("Counterfactual Sensitivity Analysis", () => {
  test("Timeline Pressure: Flexible vs Short", () => {
    const baseParams = {
      size: "large",
      requirements: "fixed",
      teamSkill: "mixed",
      safetyCritical: false,
      budget: "flexible",
    };

    // Scenario A: Relaxed Timeline
    const planA = generatePlan({
      parameters: { ...baseParams, timeline: "flexible" },
    }).bestPlan;

    // Scenario B: Rush Job
    const planB = generatePlan({
      parameters: { ...baseParams, timeline: "short" },
    }).bestPlan;

    console.log(`Flexible Score: ${planA.score} | Short Score: ${planB.score}`);

    // Expectation 1: The score should DROP because short timelines are harder
    expect(planB.score).toBeLessThan(planA.score);

    // Expectation 2: Waterfall might survive Flexible, but suffer in Short
    // or checks for specific penalty triggers
    const hasRisk = planB.rationale.some(
      (r) => r.type === "RISK" || r.impactScore < 0
    );
    expect(hasRisk).toBe(true);
  });

  test("Budget Constraint: Tight Budget kills Agile Utility", () => {
    // Agile teams are expensive (seniority/overhead). Tight budget should lower its utility.
    const baseParams = {
      size: "medium",
      requirements: "dynamic",
      teamSkill: "senior",
      timeline: "flexible",
    };

    const flexible = generatePlan({
      parameters: { ...baseParams, budget: "flexible" },
    }).bestPlan;
    const tight = generatePlan({
      parameters: { ...baseParams, budget: "tight" },
    }).bestPlan;

    // Check Utility specifically (if you implemented step 2)
    // or check overall score
    expect(tight.score).toBeLessThan(flexible.score);
  });
});
