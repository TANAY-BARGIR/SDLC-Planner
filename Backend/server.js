const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { generatePlan } = require("./services/planner");
const ProjectProfile = require("./models/ProjectProfile");
const CaseStudy = require("./models/CaseStudy");
const { generateNarrative } = require("./services/explainer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ Connection Error:", err));

app.get("/", (req, res) => {
  res.send(`SDLC Pro API is Running...`);
});

app.post("/api/inception", async (req, res) => {
  try {
    const { projectName, description, parameters } = req.body;

    if (!parameters) {
      return res
        .status(400)
        .json({ success: false, message: "Missing project parameters" });
    }

    // 1. Generate the Plan (The Calculation)
    const { bestPlan, alternatives } = generatePlan({ parameters });

    // 2. Retrieve Similar Cases (The Memory)
    // We look for "Twins" in the database
    const similarCases = await CaseStudy.find({
      "parameters.size": parameters.size,
      "parameters.requirements": parameters.requirements,
      "parameters.teamSkill": parameters.teamSkill,
    })
      .limit(3)
      .lean(); // .lean() converts Mongoose objects to plain JSON

    // 3. Generate Narrative (The Explanation)
    const narrative = generateNarrative(bestPlan, { parameters }, similarCases);

    // 4. Risk Categorization
    const riskPenalty = bestPlan.breakdown ? bestPlan.breakdown.RISK : 0;
    let calculatedRisk = "Low";
    if (riskPenalty <= -40) calculatedRisk = "Critical";
    else if (riskPenalty <= -20) calculatedRisk = "High";
    else if (riskPenalty < 0) calculatedRisk = "Medium";

    // 5. Save to Database
    const newProfile = new ProjectProfile({
      projectName,
      description,
      parameters,
      generatedPlan: {
        methodology: bestPlan.model,
        confidenceScore: bestPlan.score,
        phases: bestPlan.phases,
        riskAssessment: {
          level: calculatedRisk,
          rationale: bestPlan.rationale, // Structured Data
          narrative: narrative,
        },
        estimates: {
          cost: bestPlan.estimates.estimatedBudget,
          durationMonths: bestPlan.estimates.durationMonths,
          teamSize: bestPlan.estimates.personnel,
        },
      },
    });

    // Temporary Hack: Attach narrative to the response so we can see it
    // (Since Schema isn't updated yet, it won't save to DB, but we can test the API)
    const responseData = newProfile.toObject();
    responseData.generatedPlan.riskAssessment.narrative = narrative;

    await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Project Plan Generated Successfully",
      data: responseData,
      alternatives: alternatives,
    });
  } catch (error) {
    console.error("Inception Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});

// --- CASE LIBRARY ENDPOINTS ---

// GET: Retrieve all cases
app.get("/api/cases", async (req, res) => {
  try {
    const cases = await CaseStudy.find().limit(50);
    res.json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Benchmark (Find 4-Dimension Twin)
app.post("/api/cases/benchmark", async (req, res) => {
  try {
    const { parameters } = req.body;

    // Strict Matching on 4 Dimensions
    const query = {
      "parameters.size": parameters.size,
      "parameters.requirements": parameters.requirements,
      "parameters.teamSkill": parameters.teamSkill,
      "parameters.timeline": parameters.timeline,
    };

    const similarCases = await CaseStudy.find(query)
      .sort({ confidenceScore: -1 })
      .limit(5);

    res.json({
      success: true,
      matchCriteria: Object.keys(query),
      count: similarCases.length,
      similarCases,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: System-wide Metrics
app.get("/api/metrics/summary", async (req, res) => {
  try {
    const stats = await CaseStudy.aggregate([
      {
        $group: {
          _id: "$recommendedModel",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$confidenceScore" },
          highRiskCount: {
            $sum: {
              $cond: [{ $lt: ["$confidenceScore", 60] }, 1, 0],
            },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
