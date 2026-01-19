// backend/services/explainer.js

const generateNarrative = (plan, inputs, similarCases) => {
  // SAFETY CHECK: If plan is missing or malformed, return default
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
    similarCasesParams: [],
  };

  // 1. Generate Executive Summary
  narrative.summary = `Based on the ${p.size || "project"} size and ${
    p.teamSkill || "team"
  } composition, we recommend the **${model}** methodology. This plan carries a confidence score of **${score}%**.`;

  // 2. Translate Rationale (The Fix)
  // We explicitly include items with negative impact OR items tagged as 'AI_FACTOR'
  const risks = rationale.filter(
    (r) => (r.impactScore < 0 || r.type === "AI_FACTOR") && r.description
  );

  let riskText = "";
  if (risks.length > 0) {
    riskText = "Key risk factors identified include: ";
    const points = risks.map((r) => {
      // Clean up the description text
      let desc = r.description.replace("Machine Learning Adjustment: ", "");

      // Handle the label: if impact is 0 (like AI factors), label it clearly
      const impactLabel =
        r.impactScore === 0 ? "AI Pattern Detected" : `${r.impactScore}%`;

      return `${desc} (Impact: ${impactLabel})`;
    });
    riskText += points.join("; ") + ".";
  } else {
    riskText = "No significant methodology risks were detected.";
  }

  narrative.riskAnalysis = riskText;

  // 3. Grounding (RAG - Retrieval Augmented Generation)
  if (similarCases && similarCases.length > 0) {
    const agreement = similarCases.filter(
      (c) => c.recommendedModel === model
    ).length;
    narrative.evidence = `We analyzed ${similarCases.length} similar past projects. ${agreement} of them also used ${model}, validating this choice.`;

    const example = similarCases[0];
    // Safety check for keyFactors
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