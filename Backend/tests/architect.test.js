// backend/tests/architect.test.js
const { evaluateArchitecture } = require("../services/architect");
const { ARCH_TYPES } = require("../data/constants");

describe("Phase 5: Architecture Advisor", () => {
  
  test("Should recommend Monolithic for Junior Team + Small Project", () => {
    const inputs = {
      parameters: {
        size: "small",
        teamSkill: "junior",
        budget: "tight",
        requirements: "fixed"
      }
    };
    const result = evaluateArchitecture(inputs);
    expect(result.model).toBe(ARCH_TYPES.MONOLITHIC);
  });

  test("Should recommend Microservices for Large Scale + Dynamic Reqs", () => {
    const inputs = {
      parameters: {
        size: "large",
        teamSkill: "senior",
        requirements: "dynamic",
        budget: "flexible"
      }
    };
    const result = evaluateArchitecture(inputs);
    expect(result.model).toBe(ARCH_TYPES.MICROSERVICES);
  });

  test("Should avoid Microservices if Budget is Tight", () => {
    const inputs = {
      parameters: {
        size: "medium",
        teamSkill: "senior",
        budget: "tight", // The Constraint
        requirements: "dynamic"
      }
    };
    const result = evaluateArchitecture(inputs);
    // Even if team is senior, tight budget penalizes microservices
    expect(result.model).not.toBe(ARCH_TYPES.MICROSERVICES);
  });
});