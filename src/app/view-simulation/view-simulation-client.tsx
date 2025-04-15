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
              className="border border-border rounded-lg overflow-hidden"
            >
              <CardHeader className="pb-2 relative">
                <div className="absolute top-3 right-3">
                  <span
                    className={`flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                      simulation.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : simulation.status === "processing"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span
                      className={`mr-1 w-1.5 h-1.5 rounded-full ${
                        simulation.status === "completed"
                          ? "bg-green-500"
                          : simulation.status === "processing"
                            ? "bg-amber-500"
                            : "bg-gray-500"
                      }`}
                    ></span>
                    {simulation.status
                      ? simulation.status.charAt(0).toUpperCase() +
                        simulation.status.slice(1)
                      : "Completed"}
                  </span>
                </div>
                <CardTitle className="text-lg mt-1">
                  {simulation.simulation_name}
                </CardTitle>
                <CardDescription className="text-xs">
                  Simulation date: {formatDate(simulation.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="mt-1">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {simulation.response_count} Responses
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="pt-3 pb-3 px-3">
                <div className="grid grid-cols-3 w-full divide-x overflow-hidden rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(simulation)}
                    className="text-xs h-8 border-0 rounded-none flex-1"
                  >
                    Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewResults(simulation)}
                    className="text-xs h-8 border-0 rounded-none flex-1"
                  >
                    Results
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewPersonas(simulation)}
                    className="text-xs h-8 border-0 rounded-none flex-1"
                  >
                    Personas
                  </Button>
                </div>
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
                <DialogTitle className="text-lg font-semibold">
                  {currentSimulation.simulation_name}
                </DialogTitle>
                <DialogDescription className="text-sm opacity-70">
                  Simulation date: {formatDate(currentSimulation.created_at)}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-6">
                {/* Basic Information */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="text-base font-medium mb-3 text-slate-700">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-slate-500">Response Count:</div>
                    <div>{currentSimulation.response_count}</div>
                    <div className="text-slate-500">Last Updated:</div>
                    <div>{formatDate(currentSimulation.updated_at)}</div>
                  </div>
                </div>

                {/* Demographics */}
                {currentSimulation.demographics && (
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="text-base font-medium mb-3 text-slate-700">
                      Demographics
                    </h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-slate-500">Countries:</div>
                      <div>
                        {currentSimulation.demographics.countries?.join(", ")}
                      </div>
                      <div className="text-slate-500">Genders:</div>
                      <div>
                        {currentSimulation.demographics.genders?.join(", ")}
                      </div>
                      <div className="text-slate-500">Age Ranges:</div>
                      <div>
                        {currentSimulation.demographics.ageRanges?.join(", ")}
                      </div>
                      <div className="text-slate-500">Household Incomes:</div>
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
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-base font-medium mb-3 text-slate-700">
                        Questions
                      </h3>
                      <div className="space-y-3">
                        {currentSimulation.questions.map((q, index) => (
                          <div
                            key={index}
                            className="bg-white p-3 border border-slate-200 rounded-md"
                          >
                            <div className="font-medium text-sm mb-2 text-slate-800">
                              Question {index + 1}: {q.question}
                            </div>
                            <div className="ml-3">
                              <div className="text-xs font-medium mb-1 text-slate-600">
                                Options:
                              </div>
                              <ul className="list-disc list-inside text-sm">
                                {q.options.map((option, optIndex) => (
                                  <li key={optIndex} className="text-slate-700">
                                    {option}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setIsDetailsOpen(false)}
                  className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none"
                >
                  Close
                </Button>
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
                <DialogTitle className="text-lg font-semibold">
                  Results: {currentSimulation.simulation_name}
                </DialogTitle>
                <DialogDescription className="text-sm opacity-70">
                  Response analysis by question and option
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-6">
                {aggregatedResults.length > 0 ? (
                  aggregatedResults.map((result, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-base font-medium mb-3 text-slate-700">
                        {result.question}
                      </h3>

                      <div className="bg-white p-3 border border-slate-200 rounded-md">
                        <div className="space-y-3">
                          {Object.entries(result.options).map(
                            ([option, data], optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="font-medium">{option}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-blue-500 h-full"
                                      style={{ width: `${data.percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-slate-500 min-w-[90px] text-right">
                                    {data.count} ({data.percentage}%)
                                  </span>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 mt-3 text-right">
                        {result.totalResponses} total responses
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col justify-center items-center h-40 p-6 bg-slate-50 rounded-lg space-y-4">
                    <p className="text-slate-700">
                      No results available for this simulation.
                    </p>
                    <p className="text-xs text-slate-500 text-center">
                      The simulation data has been saved to Supabase, but the
                      results data is not available. In production, this will
                      display actual persona responses from the API.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setIsResultsOpen(false)}
                  className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none"
                >
                  Close
                </Button>
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
                <DialogTitle className="text-lg font-semibold">
                  {selectedPersona
                    ? `Persona: ${selectedPersona.name}`
                    : `Personas: ${currentSimulation.simulation_name}`}
                </DialogTitle>
                <DialogDescription className="text-sm opacity-70">
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
                <Button
                  onClick={() => setIsPersonasOpen(false)}
                  className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none"
                >
                  Close
                </Button>
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
                <DialogTitle className="text-lg font-semibold">
                  Chat with {selectedPersona.name}
                </DialogTitle>
                <DialogDescription className="text-sm opacity-70">
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
                <Button
                  onClick={() => setIsChatOpen(false)}
                  className="bg-slate-100 text-slate-800 hover:bg-slate-200 border-none"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppSidebar>
  );
}
