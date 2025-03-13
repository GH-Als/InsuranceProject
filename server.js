const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html when accessing the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Function to calculate risk
function getBMICategory(bmi) {
  if (bmi < 25) return { category: "normal", points: 0 };
  if (bmi < 30) return { category: "overweight", points: 30 };
  return { category: "obese", points: 75 };
}

function getBloodPressureCategory(systolic, diastolic) {
  if (systolic < 120 && diastolic < 80)
    return { category: "normal", points: 0 };
  if (systolic < 130 && diastolic < 80)
    return { category: "elevated", points: 15 };
  if (systolic < 140 || diastolic < 90)
    return { category: "stage 1", points: 30 };
  if (systolic < 180 || diastolic < 120)
    return { category: "stage 2", points: 75 };
  return { category: "crisis", points: 100 };
}

function calculateRisk({ age, height, weight, bpSys, bpDia, familyHistory }) {
  let riskscore = 0;

  // Calculate age risk points
  if (age >= 60) riskscore += 30;
  else if (age >= 45) riskscore += 20;
  else if (age >= 30) riskscore += 10;

  // Calculate BMI risk points
  const bmi = weight / (height / 100) ** 2;
  riskscore += getBMICategory(bmi).points;
  riskscore += getBloodPressureCategory(bpSys, bpDia).points;

  // Family history risk points
  const diseasePoints = { diabetes: 10, cancer: 10, alzheimers: 10 };
  if (Array.isArray(familyHistory)) {
    familyHistory.forEach((disease) => {
      if (diseasePoints[disease]) riskscore += diseasePoints[disease];
    });
  }

  let category = "low risk";
  if (riskscore > 75) category = "uninsurable";
  else if (riskscore > 50) category = "high risk";
  else if (riskscore > 20) category = "moderate risk";

  return { riskscore, category };
}

// API Endpoint for risk calculation
app.post("/calculate-risk", (req, res) => {
  const result = calculateRisk(req.body);
  res.json(result);
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
