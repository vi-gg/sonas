"use client";

import { useState } from "react";

export default function TestPage() {
  const [output, setOutput] = useState("Output would come here");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          num_responses: "2",
          target_audience: {
            country: "United States",
            gender: "All",
            age_range: [18, 65],
            household_income_range: ["30k", "150k"],
            employment: {
              employment_status: ["employed"],
              industry: [
                "healthcare",
                "technology",
                "education",
                "retail",
                "finance",
              ],
            },
          },
          survey: [
            {
              question: "How often do you shop online?",
              choices: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
            },
            {
              question:
                "Which social media platform do you use most frequently?",
              choices: [
                "Facebook",
                "Instagram",
                "TikTok",
                "Twitter/X",
                "LinkedIn",
                "None",
              ],
            },
          ],
        }),
      });
      const data = await response.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (error) {
      setOutput("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Test Page</h1>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{ padding: "0.5rem 1rem", marginBottom: "1rem" }}
      >
        {loading ? "Loading..." : "Send Request"}
      </button>
      <pre style={{ background: "#f0f0f0", padding: "1rem" }}>{output}</pre>
    </div>
  );
}
