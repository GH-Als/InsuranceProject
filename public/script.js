document
  .getElementById("riskForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form refresh

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Clear previous results

    // Get user input values
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const bpSys = document.getElementById("bpSys").value;
    const bpDia = document.getElementById("bpDia").value;
    const familyHistory = document
      .getElementById("familyHistory")
      .value.split(",")
      .map((disease) => disease.trim());

    // Input validation - Only enforce minimum height
    if (height < 60) {
      resultDiv.innerHTML = `<div class="error">Height must be at least 60 cm.</div>`;
      return;
    }

    try {
      // Send data to backend
      const response = await fetch("/calculate-risk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age,
          height,
          weight,
          bpSys,
          bpDia,
          familyHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch risk assessment. Please try again.");
      }

      const data = await response.json();

      // Display result received from backend
      resultDiv.innerHTML = `
          <h2>Risk Score: ${data.riskscore}</h2>
          <p>Category: <strong>${data.category}</strong></p>
      `;
    } catch (error) {
      resultDiv.innerHTML = `<div class="error">${error.message}</div>`;
    }
  });
