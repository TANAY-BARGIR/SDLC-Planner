// backend/test_rag.js
const axios = require("axios");

const testRAG = async () => {
  console.log("📝 Testing Narrative Engine...");

  const input = {
    projectName: "RAG Test Project",
    description: "Testing the explanation system",
    parameters: {
      size: "large",
      requirements: "dynamic",
      teamSkill: "junior",
      timeline: "flexible",
      budget: "flexible",
      safetyCritical: false
    }
  };

  try {
    const res = await axios.post("http://localhost:5000/api/inception", input);
    
    if (res.data.success) {
      const report = res.data.data.generatedPlan.riskAssessment.narrative;
      
      console.log("\n--- 📄 GENERATED CONSULTANT REPORT ---");
      console.log(`SUMMARY: ${report.summary}`);
      console.log(`\nEVIDENCE: ${report.evidence}`);
      console.log(`\nRISK ANALYSIS: ${report.riskAnalysis}`);
      console.log(`\nREFERENCE CASE: ${report.similarCasesParams[0]}`);
      console.log("--------------------------------------\n");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
};

testRAG();