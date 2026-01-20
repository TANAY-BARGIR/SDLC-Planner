// backend/models/ProjectProfile.js
const mongoose = require("mongoose");

// Define the Rationale Sub-Schema explicitly
const RationaleSchema = new mongoose.Schema(
  {
    id: String,
    type: String, // "RISK", "BONUS", "AI_FACTOR"
    description: String,
    impactScore: Number,
  },
  { _id: false },
); // Disable auto-ID for sub-documents to keep it clean

const ProjectProfileSchema = new mongoose.Schema({
  // --- User Inputs ---
  projectName: { type: String, required: true },
  description: String,
  parameters: {
    requirements: { type: String, enum: ["fixed", "dynamic"], required: true },
    teamSkill: {
      type: String,
      enum: ["junior", "senior", "mixed"],
      default: "mixed",
    },
    size: { type: String, enum: ["small", "medium", "large"], required: true },
    timeline: {
      type: String,
      enum: ["short", "flexible"],
      default: "flexible",
    },
    budget: { type: String, enum: ["tight", "flexible"], default: "flexible" },
    safetyCritical: { type: Boolean, default: false },
  },

  // --- AI Generated Charter (The Results) ---
  generatedPlan: {
    methodology: String,
    confidenceScore: Number,
    phases: [String],
    architecture: {
      model: String,
      score: Number,
      rationale: [String],
      diagramType: String,
    },
    blueprints: {
      processDiagram: String, // Stores Mermaid code for SDLC
      systemDiagram: String, // Stores Mermaid code for Architecture
    },
    riskAssessment: {
      level: String, // "High", "Medium", "Low", "Critical"

      // FIX: Use the explicit Sub-Schema here
      rationale: [RationaleSchema],

      // The Narrative Section (Phase 4)
      narrative: {
        summary: String,
        riskAnalysis: String,
        evidence: String,
        similarCasesParams: [String],
      },
    },

    estimates: {
      cost: Number,
      durationMonths: Number,
      teamSize: Number,
    },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProjectProfile", ProjectProfileSchema);
