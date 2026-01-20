// backend/models/CaseStudy.js
const mongoose = require("mongoose");

const CaseStudySchema = new mongoose.Schema({
  // 1. The Source Type (NEW)
  type: {
    type: String,
    enum: ["SYNTHETIC", "REAL"],
    default: "REAL",
    index: true, // Faster lookups
  },

  // 2. The Scenario (The Problem)
  title: { type: String, required: true },
  domain: { type: String, default: "General" },
  parameters: {
    requirements: String,
    teamSkill: String,
    size: String,
    timeline: String,
    budget: String,
    safetyCritical: Boolean,
  },

  // 3. The Solution
  recommendedModel: String,
  confidenceScore: Number,

  // 4. The Rationale
  keyFactors: [String],

  // 5. Outcomes (Expanded for Real Feedback)
  outcomes: {
    success: { type: Boolean, default: true },
    userRating: { type: Number, min: 1, max: 5 }, // NEW: User satisfaction
    actualDuration: Number,
    comment: String, // NEW: User's retrospective
  },

  createdAt: { type: Date, default: Date.now },
});

// Compound Index: Search by Params, but Sort by Type (Real first)
CaseStudySchema.index({
  "parameters.size": 1,
  "parameters.requirements": 1,
  type: -1, // -1 means Z->A (Real comes before Synthetic if alphabetical, or custom sort)
});

module.exports = mongoose.model("CaseStudy", CaseStudySchema);
