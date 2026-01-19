// backend/scripts/seedCases.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { generatePlan } = require("../services/planner");
const CaseStudy = require("../models/CaseStudy");

// Load Environment Variables
dotenv.config({ path: "../.env" }); // Adjust path if running from root or scripts folder

// --- Configuration ---
const SIZES = ["small", "medium", "large"];
const REQUIREMENTS = ["fixed", "dynamic"];
const TEAMS = ["junior", "senior", "mixed"];
const TIMELINES = ["short", "flexible"];
const BUDGETS = ["tight", "flexible"];

// --- Logic ---
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB for Seeding...");

    // Clear existing cases (optional, helps prevent duplicates during dev)
    await CaseStudy.deleteMany({});
    console.log("🗑️  Cleared existing Case Studies.");

    const casesToInsert = [];

    // Brute-force generate combinations
    // (In a real scenario, we might use probabilistic generation)
    let count = 0;

    for (const size of SIZES) {
      for (const req of REQUIREMENTS) {
        for (const team of TEAMS) {
          for (const timeline of TIMELINES) {
            // Construct Input
            const inputs = {
              parameters: {
                size,
                requirements: req,
                teamSkill: team,
                timeline,
                budget: "flexible", // Keeping constant for simplicity or loop it
                safetyCritical: size === "large", // Arbitrary rule for diversity
              },
            };

            // Run the Simulation Engine
            const { bestPlan } = generatePlan(inputs);

            // Create the Case Entry
            casesToInsert.push({
              title: `Synthetic Case #${++count}: ${size} project, ${team} team`,
              domain: "Software Eng",
              parameters: inputs.parameters,
              recommendedModel: bestPlan.model,
              confidenceScore: bestPlan.score,
              keyFactors: bestPlan.rationale.map((r) => r.desc), // Storing the "Why"
            });
          }
        }
      }
    }

    // Bulk Insert
    await CaseStudy.insertMany(casesToInsert);
    console.log(
      `🚀 Successfully seeded ${casesToInsert.length} synthetic case studies!`
    );

    process.exit();
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
