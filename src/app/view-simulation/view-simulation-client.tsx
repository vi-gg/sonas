"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClient } from "../../../utils/supabase/client";
// Import mock data only for development environments
// import { addMockResultsToSimulations } from "./mock-data";

interface Simulation {
  id: string;
  simulation_name: string;
  response_count: number;
  created_at: string;
  updated_at: string;
  demographics: {
    countries: string[];
    genders: string[];
    ageRanges: string[];
    householdIncomes: string[];
  };
  questions: Array<{
    question: string;
    options: string[];
  }>;
  formatted_data: any;
  results?: any[];
  status?: string;
}

interface PersonaResponse {
  answer: string;
  persona: string;
  question: string;
  persona_backstory: string;
}

interface AggregatedResponse {
  question: string;
  options: {
    [option: string]: {
      count: number;
      percentage: number;
    };
  };
  totalResponses: number;
}

interface ViewSimulationClientProps {
  user: User;
}

export default function ViewSimulationClient({
  user,
}: ViewSimulationClientProps) {
  const router = useRouter();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentSimulation, setCurrentSimulation] = useState<Simulation | null>(
    null
  );
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [aggregatedResults, setAggregatedResults] = useState<
    AggregatedResponse[]
  >([]);
  const [isPersonasOpen, setIsPersonasOpen] = useState(false);
  const [personasList, setPersonasList] = useState<any[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<any | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Handler for View Details button
  const handleViewDetails = (simulation: Simulation) => {
    setCurrentSimulation(simulation);
    setIsDetailsOpen(true);
  };

  // Handler for View Results button
  const handleViewResults = (simulation: Simulation) => {
    setCurrentSimulation(simulation);

    // Process results if they exist
    if (simulation.results && simulation.results.length > 0) {
      const processed = processResults(simulation.results);
      setAggregatedResults(processed);
      setIsResultsOpen(true);
    } else {
      // Handle case where no results are available
      setAggregatedResults([]);
      setIsResultsOpen(true);
    }
  };

  // Handler for View Personas button
  const handleViewPersonas = (simulation: Simulation) => {
    setCurrentSimulation(simulation);

    // Process results if they exist
    if (simulation.results && simulation.results.length > 0) {
      const personas = extractUniquePersonas(simulation.results);
      setPersonasList(personas);
      setIsPersonasOpen(true);
      setSelectedPersona(null); // Reset any selected persona
    } else {
      // Handle case where no results are available
      setPersonasList([]);
      setIsPersonasOpen(true);
    }
  };

  // Extract unique personas from simulation results
  const extractUniquePersonas = (results: PersonaResponse[]) => {
    const personaMap = new Map();

    results.forEach((response) => {
      // Remove the "Persona: " prefix if it exists
      const personaName = response.persona.replace("Persona: ", "");

      if (!personaMap.has(personaName)) {
        // Parse the backstory to extract demographic information
        const backstory = response.persona_backstory;

        // Extract demographic details using regex
        const nameMatch = backstory.match(/name\s*:\s*([^,]+)/i);
        const countryMatch = backstory.match(/country\s*:\s*([^,]+)/i);
        const genderMatch = backstory.match(/gender\s*:\s*([^,]+)/i);
        const ageMatch = backstory.match(/age\s*:\s*(\d+)/i);
        const incomeMatch = backstory.match(/household_income\s*:\s*([^,]+)/i);
        const industryMatch = backstory.match(/industry\s*:\s*([^,]+)/i);

        personaMap.set(personaName, {
          name: nameMatch ? nameMatch[1].trim() : personaName,
          demographics: {
            country: countryMatch ? countryMatch[1].trim() : "",
            gender: genderMatch ? genderMatch[1].trim() : "",
            age: ageMatch ? parseInt(ageMatch[1]) : null,
            income: incomeMatch ? incomeMatch[1].trim() : "",
            industry: industryMatch ? industryMatch[1].trim() : "",
          },
          backstory: backstory,
          responses: [],
        });
      }

      // Add this response to the persona's responses
      const persona = personaMap.get(personaName);
      persona.responses.push({
        question: response.question.replace("Answer : ", ""),
        answer: response.answer,
      });
      personaMap.set(personaName, persona);
    });

    // Convert map to array
    return Array.from(personaMap.values());
  };

  // Process the results to get aggregated data
  const processResults = (results: PersonaResponse[]): AggregatedResponse[] => {
    // Group responses by question
    const questionMap: { [key: string]: PersonaResponse[] } = {};

    results.forEach((response) => {
      // Clean up the question string to remove "Answer : " prefix if it exists
      const cleanQuestion = response.question.replace("Answer : ", "");

      if (!questionMap[cleanQuestion]) {
        questionMap[cleanQuestion] = [];
      }
      questionMap[cleanQuestion].push(response);
    });

    // Convert the grouped data to our aggregated format
    return Object.keys(questionMap).map((questionText) => {
      const responses = questionMap[questionText];
      const totalResponses = responses.length;

      // Count occurrences of each answer
      const optionCounts: { [option: string]: number } = {};
      responses.forEach((response) => {
        if (!optionCounts[response.answer]) {
          optionCounts[response.answer] = 0;
        }
        optionCounts[response.answer]++;
      });

      // Convert counts to our final format with percentages
      const options: {
        [option: string]: { count: number; percentage: number };
      } = {};
      Object.keys(optionCounts).forEach((option) => {
        options[option] = {
          count: optionCounts[option],
          percentage: Math.round((optionCounts[option] / totalResponses) * 100),
        };
      });

      return {
        question: questionText,
        options,
        totalResponses,
      };
    });
  };

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("simulations")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        // Use actual data from Supabase in production
        setSimulations(data || []);

        // For development/testing, uncomment below to use mock data:
        // const simulationsWithMockData = addMockResultsToSimulations(data || []);
        // setSimulations(simulationsWithMockData);
      } catch (err) {
        console.error("Error fetching simulations:", err);
        setError("Failed to load simulations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimulations();
  }, []);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AppSidebar
      activePage="view-simulation"
      pageTitle="View Simulations"
      userName={user.user_metadata?.name || "User"}
      userEmail={user.email || ""}
      userInitials={user.email?.substring(0, 2).toUpperCase() || "U"}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Simulations</h1>
        <Button onClick={() => router.push("/new-simulation")}>
          Create New Simulation
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading simulations...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : simulations.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p>You haven't created any simulations yet.</p>
          <Button onClick={() => router.push("/new-simulation")}>
            Create Your First Simulation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulations.map((simulation) => (
            <Card
              key={simulation.id}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{simulation.simulation_name}</CardTitle>
                <CardDescription>
                  Created on {formatDate(simulation.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Responses:</span>
                    <span className="font-medium">
                      {simulation.response_count}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span
                      className={`font-medium ${
                        simulation.status === "completed"
                          ? "text-green-600"
                          : simulation.status === "processing"
                            ? "text-amber-600"
                            : "text-gray-600"
                      }`}
                    >
                      {simulation.status
                        ? simulation.status.charAt(0).toUpperCase() +
                          simulation.status.slice(1)
                        : "Completed"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-between pt-4 flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(simulation)}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewResults(simulation)}
                >
                  View Results
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewPersonas(simulation)}
                  className="w-full mt-2"
                >
                  View Personas
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Simulation Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {currentSimulation && (
            <>
              <DialogHeader>
                <DialogTitle>{currentSimulation.simulation_name}</DialogTitle>
                <DialogDescription>
                  Created on {formatDate(currentSimulation.created_at)}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Response Count:</div>
                    <div>{currentSimulation.response_count}</div>
                    <div>Last Updated:</div>
                    <div>{formatDate(currentSimulation.updated_at)}</div>
                  </div>
                </div>

                {/* Demographics */}
                {currentSimulation.demographics && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Demographics</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Countries:</div>
                      <div>
                        {currentSimulation.demographics.countries?.join(", ")}
                      </div>
                      <div>Genders:</div>
                      <div>
                        {currentSimulation.demographics.genders?.join(", ")}
                      </div>
                      <div>Age Ranges:</div>
                      <div>
                        {currentSimulation.demographics.ageRanges?.join(", ")}
                      </div>
                      <div>Household Incomes:</div>
                      <div>
                        {currentSimulation.demographics.householdIncomes?.join(
                          ", "
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Questions */}
                {currentSimulation.questions &&
                  currentSimulation.questions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Questions</h3>
                      <div className="space-y-4">
                        {currentSimulation.questions.map((q, index) => (
                          <div key={index} className="p-3 border rounded-md">
                            <div className="font-medium mb-2">
                              Question {index + 1}: {q.question}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium mb-1">Options:</div>
                              <ul className="list-disc list-inside">
                                {q.options.map((option, optIndex) => (
                                  <li key={optIndex}>{option}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Raw Formatted Data section removed */}
              </div>

              <DialogFooter>
                <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Simulation Results Dialog */}
      <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {currentSimulation && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Results: {currentSimulation.simulation_name}
                </DialogTitle>
                <DialogDescription>
                  Response analysis by question and option
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-6">
                {aggregatedResults.length > 0 ? (
                  aggregatedResults.map((result, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <h3 className="text-lg font-semibold mb-3">
                        Question: {result.question}
                      </h3>

                      <div className="ml-4 mb-2">
                        <h4 className="font-medium">Responses:</h4>
                        <div className="space-y-1 mt-2">
                          {Object.entries(result.options).map(
                            ([option, data], optIndex) => (
                              <div
                                key={optIndex}
                                className="flex justify-between"
                              >
                                <span>{option}:</span>
                                <span>
                                  {data.count} responses ({data.percentage}%)
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground mt-4">
                        {result.totalResponses} total responses
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col justify-center items-center h-40 space-y-4">
                    <p>No results available for this simulation.</p>
                    <p className="text-sm text-muted-foreground">
                      The simulation data has been saved to Supabase, but the
                      results data is not available. In production, this will
                      display actual persona responses from the API.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setIsResultsOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Personas Dialog */}
      <Dialog open={isPersonasOpen} onOpenChange={setIsPersonasOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {currentSimulation && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedPersona
                    ? `Persona: ${selectedPersona.name}`
                    : `Personas: ${currentSimulation.simulation_name}`}
                </DialogTitle>
                <DialogDescription>
                  {selectedPersona
                    ? "Detailed information about this persona"
                    : "List of all personas in this simulation"}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                {personasList.length > 0 ? (
                  selectedPersona ? (
                    // Detailed persona view
                    <div className="space-y-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPersona(null)}
                        className="mb-2"
                      >
                        ← Back to persona list
                      </Button>

                      <Card className="border shadow-sm">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{selectedPersona.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {selectedPersona.demographics.age} years old •{" "}
                                {selectedPersona.demographics.gender} •{" "}
                                {selectedPersona.demographics.industry}
                              </CardDescription>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsChatOpen(true)}
                              className="text-primary"
                            >
                              Chat with Persona
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Demographics section */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2">
                              Demographics
                            </h4>
                            <div className="grid grid-cols-2 gap-y-1 text-sm">
                              <div className="text-muted-foreground">
                                Country:
                              </div>
                              <div>{selectedPersona.demographics.country}</div>

                              <div className="text-muted-foreground">
                                Gender:
                              </div>
                              <div>{selectedPersona.demographics.gender}</div>

                              <div className="text-muted-foreground">Age:</div>
                              <div>{selectedPersona.demographics.age}</div>

                              <div className="text-muted-foreground">
                                Income:
                              </div>
                              <div>{selectedPersona.demographics.income}</div>

                              <div className="text-muted-foreground">
                                Industry:
                              </div>
                              <div>{selectedPersona.demographics.industry}</div>
                            </div>
                          </div>

                          {/* Responses section */}
                          {selectedPersona.responses.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">
                                Responses
                              </h4>
                              <div className="space-y-3">
                                {selectedPersona.responses.map(
                                  (
                                    response: {
                                      question: string;
                                      answer: string;
                                    },
                                    index: number
                                  ) => (
                                    <div
                                      key={index}
                                      className="p-3 bg-muted/50 rounded-md"
                                    >
                                      <div className="text-sm font-medium">
                                        {response.question}
                                      </div>
                                      <div className="mt-1 text-sm">
                                        {response.answer}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    // Personas list view
                    <div className="space-y-2">
                      {personasList.map((persona, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/10"
                        >
                          <div>
                            <h4 className="font-medium">{persona.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {persona.demographics.age} years •{" "}
                              {persona.demographics.gender} •{" "}
                              {persona.demographics.industry}
                            </p>
                          </div>
                          <Button
                            variant="link"
                            onClick={() => setSelectedPersona(persona)}
                          >
                            View More
                          </Button>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="flex flex-col justify-center items-center h-40 space-y-4">
                    <p>No personas available for this simulation.</p>
                    <p className="text-sm text-muted-foreground">
                      The simulation data has been saved to Supabase, but the
                      personas data is not available. In production, this will
                      display actual persona data from the API.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setIsPersonasOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat with Persona Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedPersona && (
            <>
              <DialogHeader>
                <DialogTitle>Chat with {selectedPersona.name}</DialogTitle>
                <DialogDescription>
                  Have a conversation with this persona based on their
                  demographic profile
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                {/* Chat history would go here */}
                <div className="border rounded-md p-4 h-[300px] overflow-y-auto flex flex-col space-y-4">
                  {/* Example message from persona */}
                  <div className="flex items-start space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                      {selectedPersona.name.charAt(0)}
                    </div>
                    <div className="bg-muted p-3 rounded-md max-w-[80%]">
                      <p className="text-sm">
                        Hello! I'm {selectedPersona.name}, a{" "}
                        {selectedPersona.demographics.age}-year-old{" "}
                        {selectedPersona.demographics.gender} working in the{" "}
                        {selectedPersona.demographics.industry} industry. How
                        can I help you?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your message here..."
                    className="flex-1 p-2 border rounded-md"
                  />
                  <Button>Send</Button>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  This chat is a demonstration of the persona concept. In
                  production, it would connect to a large language model to
                  simulate conversation.
                </p>
              </div>

              <DialogFooter>
                <Button onClick={() => setIsChatOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppSidebar>
  );
}
