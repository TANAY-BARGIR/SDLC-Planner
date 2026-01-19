// backend/services/features.js

// 1. Define the Vocabulary (The "Universe" of possible features)
const VOCAB = [
  "size_small", "size_medium", "size_large",
  "req_fixed", "req_dynamic",
  "team_junior", "team_senior", "team_mixed",
  "timeline_short", "timeline_flexible",
  "safety_critical",
  // Methodologies we are scoring
  "model_waterfall", "model_agile", "model_spiral", "model_v_model"
];

// 2. The Converter Function
const toFeatureVector = (candidate, inputs) => {
  const p = inputs.parameters;
  const vector = {};

  // Initialize all to 0
  VOCAB.forEach(feature => vector[feature] = 0);

  // Set active features to 1
  if (p.size) vector[`size_${p.size}`] = 1;
  if (p.requirements) vector[`req_${p.requirements}`] = 1;
  if (p.teamSkill) vector[`team_${p.teamSkill}`] = 1;
  if (p.timeline) vector[`timeline_${p.timeline}`] = 1;
  if (p.safetyCritical) vector["safety_critical"] = 1;

  // Encode the Candidate Model (The one we are testing)
  let modelKey = "";
  if (candidate.model.includes("Waterfall")) modelKey = "model_waterfall";
  else if (candidate.model.includes("Agile")) modelKey = "model_agile";
  else if (candidate.model.includes("Spiral")) modelKey = "model_spiral";
  else if (candidate.model.includes("V-Model")) modelKey = "model_v_model";

  if (modelKey) vector[modelKey] = 1;

  return vector;
};

module.exports = { toFeatureVector, VOCAB };