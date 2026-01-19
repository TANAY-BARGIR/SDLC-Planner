// backend/services/explainer.js

const generateNarrative = (plan, inputs, similarCases) => {
  // SAFETY CHECK
  if (!plan || !plan.rationale) {
    return {
      summary: "Plan generated, but detailed rationale is unavailable.",
      riskAnalysis: "N/A",
      similarCasesParams: ["No data available"],
    };
  }

  const { model, score, rationale } = plan;
  const p = inputs.parameters || {};

  let narrative = {
    summary: "",
    riskAnalysis: "",
    evidence: "", // Ensure this field exists
    similarCasesParams: [],
  };

  // 1. Executive Summary
  narrative.summary = `Based on the ${p.size || "project"} size and ${
    p.teamSkill || "team"
  } composition, we recommend the **${model}** methodology. This plan carries a confidence score of **${score}%**.`;

  // 2. Risk & Factor Analysis (Split Good vs Bad)
  // Risks: Negative scores OR AI Factors with 0 or negative impact
  const risks = rationale.filter(
    (r) =>
      (r.impactScore < 0 || (r.type === "AI_FACTOR" && r.impactScore <= 0)) &&
      r.description,
  );

  // Bonuses: Positive scores (including AI bonuses)
  const bonuses = rationale.filter((r) => r.impactScore > 0 && r.description);

  // Generate Risk Text
  if (risks.length > 0) {
    const riskPoints = risks.map((r) => {
      let desc = r.description.replace("Machine Learning Adjustment: ", "");
      const impactLabel =
        r.impactScore === 0 ? "AI Pattern Detected" : `${r.impactScore}%`;
      return `${desc} (Impact: ${impactLabel})`;
    });
    narrative.riskAnalysis = `Key risk factors: ${riskPoints.join("; ")}.`;
  } else {
    narrative.riskAnalysis = "No significant methodology risks were detected.";
  }

  // Append Bonuses to Risk Analysis (or create a new field if UI supported it)
  if (bonuses.length > 0) {
    const bonusPoints = bonuses.map((r) => {
      let desc = r.description.replace("Machine Learning Adjustment: ", "");
      return `${desc} (Bonus: +${r.impactScore}%)`;
    });
    // We append this to the analysis so the user sees the good news too
    narrative.riskAnalysis += ` \n\n✅ Success Factors: ${bonusPoints.join(
      "; ",
    )}.`;
  }

  // 3. Grounding (Smarter Evidence Logic)
  if (similarCases && similarCases.length > 0) {
    const agreement = similarCases.filter(
      (c) => c.recommendedModel === model,
    ).length;

    // FIX: Change text based on agreement count
    if (agreement > 0) {
      narrative.evidence = `We analyzed ${similarCases.length} similar past projects. ${agreement} of them also used ${model}, validating this choice.`;
    } else {
      // If history disagrees
      const otherModel = similarCases[0].recommendedModel;
      narrative.evidence = `We analyzed ${similarCases.length} similar past projects. Most used ${otherModel}, but we recommend ${model} for your specific constraints.`;
    }

    const example = similarCases[0];
    const lesson =
      example.keyFactors && example.keyFactors.length > 0
        ? example.keyFactors[0]
        : "Standard implementation";

    narrative.similarCasesParams = [
      `Reference Case: "${example.title}"`,
      `Outcome: Successful using ${example.recommendedModel}`,
      `Key Lesson: ${lesson}`,
    ];
  } else {
    narrative.evidence =
      "This appears to be a unique scenario with few historical precedents.";
    narrative.similarCasesParams = ["No direct historical matches found."];
  }

  return narrative;
};

module.exports = { generateNarrative };
