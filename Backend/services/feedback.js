// backend/services/feedback.js
const CaseStudy = require("../models/CaseStudy");
const ProjectProfile = require("../models/ProjectProfile");

const saveProjectOutcome = async (profileId, feedback) => {
  // 1. Find original plan
  const profile = await ProjectProfile.findById(profileId);
  if (!profile) throw new Error("Project Profile not found");

  // 2. Construct the Real Case Study
  const newCase = new CaseStudy({
    type: "REAL", // The Golden Flag
    title: `Post-Mortem: ${profile.projectName}`,
    domain: "User Submission",

    // Copy parameters from the original request
    parameters: profile.parameters,

    // Copy the logic we recommended
    recommendedModel: profile.generatedPlan.methodology,
    confidenceScore: profile.generatedPlan.confidenceScore,
    keyFactors: profile.generatedPlan.riskAssessment.rationale.map(
      (r) => r.description,
    ),

    // Save the User's Reality
    outcomes: {
      success: feedback.success,
      userRating: feedback.rating,
      actualDuration: feedback.actualDuration,
      comment: feedback.comment,
    },
  });

  await newCase.save();
  return newCase;
};

module.exports = { saveProjectOutcome };
