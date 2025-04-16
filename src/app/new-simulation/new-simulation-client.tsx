"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { AppSidebar } from "@/components/app-sidebar";
import { createClient } from "../../../utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NewSimulationFormStep01 } from "@/components/new-simulation-form-step01";
import { NewSimulationFormStep02 } from "@/components/new-simulation-form-step02";
import { NewSimulationFormStep03 } from "@/components/new-simulation-form-step03";
import { NewSimulationFormStep04 } from "@/components/new-simulation-form-step04";

interface NewSimulationClientProps {
  user: User;
}

export default function NewSimulationClient({
  user,
}: NewSimulationClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

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
    psychographics: {
      personality: [], // Personality traits
      attitudes: [], // Attitudes
      opinions: [], // Opinions
      socialClass: [], // Social class
      lifestyle: [], // Lifestyle
      interests: [], // Interests
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

  // Storing the target path when trying to navigate away
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);

  // Navigation warning effect
  useEffect(() => {
    if (isSimulationRunning) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue =
          "Simulation in progress. Leaving now will lose your results.";
        return e.returnValue;
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [isSimulationRunning]);

  // Final submission handler
  const handleSubmit = async () => {
    setIsSimulationRunning(true);
    // Transform the form data into the required JSON format
    const formattedData = {
      simulation_name: formData.simulationName,
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
        // Psychographics
        personality: formData.psychographics.personality,
        attitudes: formData.psychographics.attitudes,
        opinions: formData.psychographics.opinions,
        social_class: formData.psychographics.socialClass,
        lifestyle: formData.psychographics.lifestyle,
        interests: formData.psychographics.interests,
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
      const supabase = createClient();
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
        setIsSimulationRunning(false);
        return;
      }

      const result = await response.json();
      console.log("Simulation submitted successfully:", result);
      setSimulationResult(result);

      // Update the Supabase entry with the results from the API
      if (result.personas) {
        const { error: updateError } = await supabase
          .from("simulations")
          .update({
            results: result.personas,
            status: "completed",
          })
          .eq("id", result.simulation.id);

        if (updateError) {
          console.error("Error updating simulation results:", updateError);
        }
      }

      setIsSimulationRunning(false);

      // Redirect to view simulations page
      router.push("/view-simulation");
    } catch (error) {
      console.error("Error submitting simulation:", error);
      setIsSimulationRunning(false);
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
    } else if (incomeStr === "100-200k" || incomeStr === "100k-200k") {
      return ["100k", "200k"];
    } else if (incomeStr === "60-100k" || incomeStr === "50k-100k") {
      return ["60k", "100k"];
    } else if (incomeStr === "40-60k") {
      return ["40k", "60k"];
    } else if (incomeStr === "20-40k") {
      return ["20k", "40k"];
    } else if (incomeStr === "10-20k") {
      return ["10k", "20k"];
    } else {
      return ["30k", "150k"]; // Default range
    }
  };

  // Progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="flex w-[768px] mx-auto mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1 px-1">
            <div className="text-xs text-center mb-1 text-gray-700">
              Step {step}
            </div>
            <div
              className={`h-0.5 ${step <= currentStep ? "bg-black" : "bg-gray-200"}`}
            />
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

  // Enhanced useEffect to handle clicks on navigation links
  useEffect(() => {
    if (!isSimulationRunning) return;

    // Function to handle clicks on links
    const handleClick = (e: MouseEvent) => {
      // Check if the click is on an anchor tag
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        !anchor.href.includes("#") &&
        !anchor.target
      ) {
        // Prevent default navigation
        e.preventDefault();

        // Store the URL for later use
        setNavigationTarget(anchor.href);

        // Show confirmation dialog
        setShowWarningDialog(true);
      }
    };

    // Add the event listener
    document.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isSimulationRunning]);

  return (
    <AppSidebar
      activePage="new-simulation"
      pageTitle="New Simulation"
      userName={user.user_metadata?.name || "User"}
      userEmail={user.email || ""}
      userInitials={user.email?.substring(0, 2).toUpperCase() || "U"}
    >
      <div className="flex flex-col items-center h-full">
        {renderProgressIndicator()}
        {renderCurrentStep()}
      </div>

      {/* Navigation warning dialog */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Simulation in Progress</DialogTitle>
          <DialogDescription>
            Your simulation is still running. If you leave this page now, the
            results won't be saved. Are you sure you want to leave?
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setShowWarningDialog(false)}
            >
              Stay on Page
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowWarningDialog(false);
                setIsSimulationRunning(false);
                // Allow navigation to proceed to the stored path or default to view-simulation
                if (navigationTarget) {
                  window.location.href = navigationTarget;
                } else {
                  router.push("/view-simulation");
                }
              }}
            >
              Leave Anyway
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading overlay when simulation is running */}
      {isSimulationRunning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Simulation Running</h3>
            <p className="mb-4">
              Please don't close or navigate away from this page until the
              simulation completes.
            </p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-black animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </AppSidebar>
  );
}
