"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { createClient } from "../../../utils/supabase/client";
import { Button } from "@/components/ui/button";
import { NewSimulationFormStep01 } from "@/components/new-simulation-form-step01";
import { NewSimulationFormStep02 } from "@/components/new-simulation-form-step02";
import { NewSimulationFormStep03 } from "@/components/new-simulation-form-step03";
import { NewSimulationFormStep04 } from "@/components/new-simulation-form-step04";

export default function NewSimulationClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // State to store form data across steps
  const [formData, setFormData] = useState({
    simulationName: "My New Simulation",
    responseCount: 20,
    demographics: {
      countries: ["US"], // Default country is USA
      genders: ["male", "female", "others"], // All genders selected by default
      ageRanges: ["18-60"], // Default age range is 18 to 60
      householdIncomes: ["200k+"], // Default is household income over 200k
    },
    questions: [], // No default questions
  });

  // Navigate between steps
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update form data
  const updateFormData = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  // Final submission handler
  const handleSubmit = async () => {
    // Transform the form data into the required JSON format
    const formattedData = {
      num_responses: formData.responseCount.toString(),
      target_audience: {
        country:
          formData.demographics.countries[0] === "US"
            ? "United States"
            : formData.demographics.countries[0],
        gender:
          formData.demographics.genders.length === 3
            ? "All"
            : formData.demographics.genders.join(", "),
        age_range: parseAgeRange(formData.demographics.ageRanges[0]),
        household_income_range: parseIncomeRange(
          formData.demographics.householdIncomes[0]
        ),
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
      survey: formData.questions.map(
        (q: { question: string; options: string[] }) => ({
          question: q.question,
          choices: q.options,
        })
      ),
    };

    // Log the formatted JSON to the console
    console.log(JSON.stringify(formattedData, null, 2));

    try {
      // Send the formatted data to the personas endpoint via our API
      const response = await fetch("/api/simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting simulation:", errorData);
        // You could add toast notification or alert here to show the error
        return;
      }

      const result = await response.json();
      console.log("Simulation submitted successfully:", result);
      // You could add toast notification or redirect here upon success
    } catch (error) {
      console.error("Error submitting simulation:", error);
      // You could add toast notification or alert here to show the error
    }
  };

  // Helper function to parse age range string into array of numbers
  const parseAgeRange = (ageRangeStr: string): [number, number] => {
    const [min, max] = ageRangeStr.split("-").map(Number);
    return [min, max || 65]; // Default max to 65 if not specified
  };

  // Helper function to parse income range string
  const parseIncomeRange = (incomeStr: string): [string, string] => {
    if (incomeStr === "200k+") {
      return ["150k", "200k+"];
    } else if (incomeStr === "100k-200k") {
      return ["100k", "200k"];
    } else if (incomeStr === "50k-100k") {
      return ["50k", "100k"];
    } else {
      return ["30k", "150k"]; // Default range
    }
  };

  // Progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="flex w-full max-w-md mx-auto mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1 px-1">
            <div
              className={`h-2 rounded-full ${step <= currentStep ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div className="text-xs text-center mt-1">Step {step}</div>
          </div>
        ))}
      </div>
    );
  };

  // Render the appropriate form component based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <NewSimulationFormStep01
            className="max-w-3xl mx-auto"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <NewSimulationFormStep02
            className="max-w-3xl mx-auto"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 3:
        return (
          <NewSimulationFormStep03
            className="max-w-3xl mx-auto"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 4:
        return (
          <NewSimulationFormStep04
            className="max-w-3xl mx-auto"
            formData={formData}
            onSubmit={handleSubmit}
            onPrevious={goToPreviousStep}
          />
        );
      default:
        return (
          <NewSimulationFormStep01
            className="max-w-3xl mx-auto"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
          />
        );
    }
  };

  return (
    <AppSidebar activePage="new-simulation" pageTitle="New Simulation">
      <div className="flex flex-col items-center h-full">
        {renderProgressIndicator()}
        {renderCurrentStep()}
      </div>
    </AppSidebar>
  );
}
