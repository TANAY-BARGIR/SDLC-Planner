// backend/test_benchmark.js
const axios = require("axios"); // You might need to run: npm install axios

const testBenchmark = async () => {
  try {
    console.log("🔍 Testing Benchmarking Endpoint...");

    // Scenario: A new "Medium" size project with "Fixed" requirements
    const newProject = {
      parameters: {
        size: "medium",
        requirements: "fixed",
        teamSkill: "mixed",
        timeline: "flexible"
      }
    };

    const response = await axios.post("http://localhost:5000/api/cases/benchmark", newProject);
    
    if (response.data.success) {
      console.log(`✅ Success! Found ${response.data.similarCases.length} similar historical cases.`);
      
      console.log("\n--- The Advice based on History ---");
      response.data.similarCases.forEach((c, index) => {
        console.log(`[Case ${index + 1}] Used ${c.recommendedModel} (Confidence: ${c.confidenceScore}%)`);
      });
    } else {
      console.log("❌ Failed:", response.data.message);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("Make sure your server is running on port 5000!");
  }
};

testBenchmark();