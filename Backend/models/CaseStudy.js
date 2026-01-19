// backend/models/CaseStudy.js
const mongoose = require("mongoose");

const CaseStudySchema = new mongoose.Schema({
  // 1. The Scenario (The Problem)
  title: { type: String, required: true },
  domain: { type: String, default: "General" }, // e.g., FinTech, Healthcare
  parameters: {
    requirements: String,
    teamSkill: String,
    size: String,
    timeline: String,
    budget: String,
    safetyCritical: Boolean,
  },

  // 2. The Solution (The Logic Output)
  recommendedModel: String, // e.g., "Agile"
  confidenceScore: Number,

  // 3. The Rationale (Why?)
  keyFactors: [String], // e.g., ["High Risk due to Junior Team", "Short Timeline"]

  // 4. Outcomes (For future expansion - "What actually happened")
  outcomes: {
    success: { type: Boolean, default: true },
    actualDuration: Number, // Variance from estimate
  },

  createdAt: { type: Date, default: Date.now },
});

// Indexing for faster retrieval in later phases
CaseStudySchema.index({ "parameters.size": 1, "parameters.requirements": 1 });

module.exports = mongoose.model("CaseStudy", CaseStudySchema);
