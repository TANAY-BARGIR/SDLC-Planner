// backend/tests/logic.test.js
const { generatePlan } = require("../services/planner");
const RULES = require("../data/rules");

describe("SDLC Logic Engine", () => {
  test("Should recommend Agile for Dynamic Requirements + Senior Team", () => {
    const inputs = {
      parameters: {
        size: "small",
        requirements: "dynamic",
        teamSkill: "senior",
        timeline: "flexible",
        budget: "flexible",
        safetyCritical: false,
      },
    };
    const { bestPlan } = generatePlan(inputs);
    expect(bestPlan.model).toBe("Agile (Scrum/Kanban)");
    expect(bestPlan.score).toBeGreaterThan(80);
  });

  test("Should recommend Waterfall for Safety-Critical Systems", () => {
    const inputs = {
      parameters: {
        size: "large",
        requirements: "fixed", // Safety usually implies fixed reqs
        teamSkill: "mixed",
        timeline: "flexible",
        budget: "flexible",
        safetyCritical: true, // The key trigger
      },
    };
    const { bestPlan } = generatePlan(inputs);

    // Safety critical often forces high docs, which aligns with Waterfall/V-Model
    // Check if the model is strictly structured
    const isStructured = ["Waterfall Model", "V-Model"].includes(
      bestPlan.model
    );
    expect(isStructured).toBe(true);
  });

  test("Should trigger 'DEATH MARCH' risk for Short Timeline + Large Project", () => {
    const inputs = {
      parameters: {
        size: "large",
        requirements: "fixed",
        teamSkill: "mixed",
        timeline: "short", // The trigger
        budget: "flexible",
        safetyCritical: false,
      },
    };
    const { bestPlan } = generatePlan(inputs);

    // Check if the Risk Rule was triggered in the rationale
    const deathMarch = bestPlan.rationale.find(
      (r) => r.description && r.description.includes("DEATH MARCH")
    );
    expect(deathMarch).toBeDefined();
    expect(deathMarch.impactScore).toBe(-40);
  });
});
