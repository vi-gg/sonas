"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface NewSimulationFormStep04Props {
  className?: string;
  onPrevious?: () => void;
  onSubmit?: () => void;
  formData?: any;
}

export function NewSimulationFormStep04({
  className,
  onPrevious,
  onSubmit,
  formData = {
    simulationName: "My New Simulation",
    responseCount: 20,
    demographics: {
      countries: ["United States", "United Kingdom", "India"],
      genders: ["Male", "Female", "Non-binary"],
      ageRanges: ["18-24", "25-34", "35-44"],
      householdIncomes: ["$0-$25,000", "$25,001-$50,000", "$50,001-$75,000"],
    },
    questions: [
      {
        id: "1",
        question: "What features are most important to you?",
        options: ["Quality", "Price", "Design", "Support"],
      },
      {
        id: "2",
        question: "How likely are you to recommend our product?",
        options: [
          "Very likely",
          "Somewhat likely",
          "Neutral",
          "Unlikely",
          "Very unlikely",
        ],
      },
    ],
  },
}: NewSimulationFormStep04Props) {
  const [isLoading, setIsLoading] = useState(false);

  // Validate that there is at least one question and each question has at least two options
  const hasValidQuestions = (data: any): boolean => {
    // Check if questions array exists and has at least one question
    if (
      !data?.questions ||
      !Array.isArray(data.questions) ||
      data.questions.length === 0
    ) {
      return false;
    }

    // Check that each question has at least 2 options
    for (const question of data.questions) {
      if (
        !question.options ||
        !Array.isArray(question.options) ||
        question.options.length < 2
      ) {
        return false;
      }
    }

    return true;
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
  };

  const handleRunSimulation = async () => {
    if (onSubmit) {
      setIsLoading(true);
      try {
        await onSubmit();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-8 w-[768px]",
        className
      )}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Step 04</p>
          <h2 className="text-2xl font-bold font-heading mt-1 text-black">
            Review and run your simulation
          </h2>
        </div>

        <div className="space-y-5">
          <div className="p-5 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Simulation Details</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-1">
                  Simulation Name
                </h4>
                <p className="font-medium">{formData.simulationName}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-1">
                  Response Count
                </h4>
                <p className="font-medium">
                  {formData.responseCount} responses
                </p>
              </div>

              <Separator className="my-2" />

              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">
                  Demographics
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Countries</p>
                    <div className="space-y-1">
                      {(formData?.demographics?.countries || []).map(
                        (countryCode: string, index: number) => {
                          // Convert country code to country name
                          const countryNames: Record<string, string> = {
                            US: "United States",
                            UK: "United Kingdom",
                            IN: "India",
                            CA: "Canada",
                            AU: "Australia",
                          };
                          return (
                            <div
                              key={index}
                              className="bg-white px-2 py-1 rounded border text-sm"
                            >
                              {countryNames[countryCode] || countryCode}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Genders</p>
                    <div className="space-y-1">
                      {(formData?.demographics?.genders || []).map(
                        (gender: string, index: number) => {
                          // Format gender correctly
                          const genderLabels: Record<string, string> = {
                            male: "Male",
                            female: "Female",
                            others: "Others",
                          };
                          return (
                            <div
                              key={index}
                              className="bg-white px-2 py-1 rounded border text-sm"
                            >
                              {genderLabels[gender] || gender}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Age Ranges</p>
                    <div className="space-y-1">
                      {(formData?.demographics?.ageRanges || []).map(
                        (ageRange: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white px-2 py-1 rounded border text-sm"
                          >
                            {ageRange}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Household Incomes</p>
                    <div className="space-y-1">
                      {(formData?.demographics?.householdIncomes || []).map(
                        (incomeCode: string, index: number) => {
                          // Convert income code to proper label
                          const incomeLabels: Record<string, string> = {
                            "10-20k": "$10,000 — $20,000",
                            "20-40k": "$20,000 — $40,000",
                            "40-60k": "$40,000 — $60,000",
                            "60-100k": "$60,000 — $100,000",
                            "100-200k": "$100,000 — $200,000",
                            "200k+": "$200,000+",
                          };
                          return (
                            <div
                              key={index}
                              className="bg-white px-2 py-1 rounded border text-sm"
                            >
                              {incomeLabels[incomeCode] || incomeCode}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">
                  Psychographics
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Personality</p>
                    <div className="space-y-1">
                      {(formData?.psychographics?.personality || []).map(
                        (personality: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white px-2 py-1 rounded border text-sm"
                          >
                            {personality}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Attitudes</p>
                    <div className="space-y-1">
                      {(formData?.psychographics?.attitudes || []).map(
                        (attitude: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white px-2 py-1 rounded border text-sm"
                          >
                            {attitude}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Opinions</p>
                    <div className="space-y-1">
                      {(formData?.psychographics?.opinions || []).map(
                        (opinion: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white px-2 py-1 rounded border text-sm"
                          >
                            {opinion}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Social Class</p>
                    <div className="space-y-1">
                      {(formData?.psychographics?.socialClass || []).map(
                        (socialClass: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white px-2 py-1 rounded border text-sm"
                          >
                            {socialClass}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Lifestyle</p>
                    <div className="space-y-1">
                      {(formData?.psychographics?.lifestyle || []).map(
                        (lifestyle: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white px-2 py-1 rounded border text-sm"
                          >
                            {lifestyle}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Interests</p>
                    <div className="space-y-1">
                      {(formData?.psychographics?.interests || []).map(
                        (interest: string, index: number) => (
                          <div
                            key={index}
                            className="bg-white px-2 py-1 rounded border text-sm"
                          >
                            {interest}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-2">
                  Questions ({formData.questions.length})
                </h4>
                <div className="space-y-3">
                  {(formData?.questions || []).map(
                    (question: any, index: number) => (
                      <div
                        key={question.id}
                        className="bg-white p-3 rounded border"
                      >
                        <p className="font-medium mb-2">
                          Q{index + 1}: {question.question}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.map(
                            (option: string, optionIndex: number) => (
                              <div
                                key={optionIndex}
                                className="text-sm py-1 px-2 bg-gray-50 rounded"
                              >
                                {option}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-center text-gray-500">
              When you run the simulation, we'll generate responses based on the
              demographics and questions you've defined. Please check the view
              simulations in 5 minutes.
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            className="border border-border"
            onClick={handlePrevious}
          >
            Previous
          </Button>
          <Button
            className="bg-black text-white hover:bg-black/90"
            onClick={handleRunSimulation}
            disabled={isLoading || !hasValidQuestions(formData)}
          >
            {isLoading
              ? "Processing..."
              : !hasValidQuestions(formData)
                ? "Add Questions to Run Simulation"
                : "Run Simulation"}
          </Button>
        </div>
      </div>
    </div>
  );
}
