"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { LoaderCircle } from "lucide-react";
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
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
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
      {/* Remove X (close) buttons from all dialogs */}
      <style jsx global>{`
        /* Target specific X button elements by exact class and properties */
        button.absolute.right-4.top-4,
        button[type="button"].absolute.right-4.top-4,
        .DialogContent button[type="button"][class*="absolute"],
        [data-radix-dialog-close],
        button[aria-label="Close"],
        button:has(.lucide-x),
        button:has(svg[stroke="currentColor"]) {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
          transform: scale(0) !important;
        }
      `}</style>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {currentSimulation && (
            <>
              <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-lg border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl font-semibold text-slate-800">
                      {currentSimulation.simulation_name}
                    </DialogTitle>
                    <DialogDescription className="text-sm mt-1 flex items-center text-slate-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {formatDate(currentSimulation.created_at)}
                    </DialogDescription>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      currentSimulation.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : currentSimulation.status === "processing"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {currentSimulation.status || "Completed"}
                  </span>
                </div>
              </DialogHeader>

              <div className="py-6 px-6 space-y-6">
                {/* Basic Information */}
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <h3 className="text-base font-medium mb-3 text-slate-800 flex items-center border-b pb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div className="text-slate-500 font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-blue-400"
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
                      Response Count:
                    </div>
                    <div className="font-semibold text-slate-700">
                      {currentSimulation.response_count}
                    </div>

                    <div className="text-slate-500 font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Last Updated:
                    </div>
                    <div className="font-semibold text-slate-700">
                      {formatDate(currentSimulation.updated_at)}
                    </div>
                  </div>
                </div>

                {/* Demographics */}
                {currentSimulation.demographics && (
                  <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <h3 className="text-base font-medium mb-3 text-slate-800 flex items-center border-b pb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Demographics
                    </h3>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <div className="text-slate-500 font-medium flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-purple-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Countries:
                      </div>
                      <div className="font-semibold text-slate-700">
                        <div className="flex flex-wrap gap-1">
                          {currentSimulation.demographics.countries?.map(
                            (country, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs"
                              >
                                {country}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="text-slate-500 font-medium flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-purple-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Genders:
                      </div>
                      <div className="font-semibold text-slate-700">
                        <div className="flex flex-wrap gap-1">
                          {currentSimulation.demographics.genders?.map(
                            (gender, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs"
                              >
                                {gender}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="text-slate-500 font-medium flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-purple-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        Age Ranges:
                      </div>
                      <div className="font-semibold text-slate-700">
                        <div className="flex flex-wrap gap-1">
                          {currentSimulation.demographics.ageRanges?.map(
                            (age, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs"
                              >
                                {age}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="text-slate-500 font-medium flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-purple-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Household Incomes:
                      </div>
                      <div className="font-semibold text-slate-700">
                        <div className="flex flex-wrap gap-1">
                          {currentSimulation.demographics.householdIncomes?.map(
                            (income, idx) => (
                              <span
                                key={idx}
                                className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs"
                              >
                                {income}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Questions */}
                {currentSimulation.questions &&
                  currentSimulation.questions.length > 0 && (
                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                      <h3 className="text-base font-medium mb-3 text-slate-800 flex items-center border-b pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Questions
                      </h3>
                      <div className="space-y-4">
                        {currentSimulation.questions.map((q, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 border border-slate-200 rounded-md shadow-sm hover:border-green-200 transition-colors"
                          >
                            <div className="font-medium text-sm mb-3 text-slate-800 flex items-center">
                              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-700 text-xs mr-2">
                                {index + 1}
                              </span>
                              {q.question}
                            </div>
                            <div className="ml-7">
                              <div className="text-xs font-medium mb-2 text-slate-600 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 mr-1 text-green-500"
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
                                Options:
                              </div>
                              <ul className="space-y-1">
                                {q.options.map((option, optIndex) => (
                                  <li
                                    key={optIndex}
                                    className="text-slate-700 text-sm flex items-start"
                                  >
                                    <span className="inline-block w-4 h-4 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs flex items-center justify-center mr-2 mt-0.5">
                                      {String.fromCharCode(65 + optIndex)}
                                    </span>
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

              <DialogFooter className="px-6 pb-6">
                <Button
                  onClick={() => setIsDetailsOpen(false)}
                  className="bg-slate-800 text-white hover:bg-slate-700 border-none shadow-sm"
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
              <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-lg border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl font-semibold text-slate-800">
                      Results: {currentSimulation.simulation_name}
                    </DialogTitle>
                    <DialogDescription className="text-sm mt-1 flex items-center text-slate-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Response analysis by question and option
                    </DialogDescription>
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                    {currentSimulation.response_count} Responses
                  </div>
                </div>
              </DialogHeader>

              <div className="py-6 px-6 space-y-6">
                {aggregatedResults.length > 0 ? (
                  aggregatedResults.map((result, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
                    >
                      <h3 className="text-base font-medium mb-4 text-slate-800 flex items-center border-b pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-indigo-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="flex-1">{result.question}</span>
                        <span className="text-xs font-normal text-slate-500">
                          {result.totalResponses} responses
                        </span>
                      </h3>

                      <div className="space-y-4">
                        {Object.entries(result.options).map(
                          ([option, data], optIndex) => (
                            <div key={optIndex} className="relative">
                              <div className="flex items-center justify-between mb-1 text-sm">
                                <span className="font-medium flex items-center">
                                  <span className="inline-block w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center mr-2">
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  {option}
                                </span>
                                <span className="font-semibold text-slate-700">
                                  {data.percentage}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    data.percentage > 75
                                      ? "bg-indigo-500"
                                      : data.percentage > 50
                                        ? "bg-indigo-400"
                                        : data.percentage > 25
                                          ? "bg-indigo-300"
                                          : "bg-indigo-200"
                                  }`}
                                  style={{ width: `${data.percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-slate-500 mt-1 text-right">
                                {data.count} responses
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 py-6">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-700 font-medium">
                        No results available for this simulation
                      </p>
                      <p className="text-xs text-slate-500 max-w-md text-center">
                        The simulation data has been saved to Supabase, but the
                        results data is not available. In production, this will
                        display actual persona responses from the API.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="px-6 pb-6">
                <Button
                  onClick={() => setIsResultsOpen(false)}
                  className="bg-slate-800 text-white hover:bg-slate-700 border-none shadow-sm"
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
              <DialogHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-t-lg border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl font-semibold text-slate-800">
                      {selectedPersona
                        ? `Persona: ${selectedPersona.name}`
                        : `Personas: ${currentSimulation.simulation_name}`}
                    </DialogTitle>
                    <DialogDescription className="text-sm mt-1 flex items-center text-slate-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      {selectedPersona
                        ? "Detailed information about this persona"
                        : "List of all personas in this simulation"}
                    </DialogDescription>
                  </div>
                  {!selectedPersona && (
                    <div className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      {personasList.length} Personas
                    </div>
                  )}
                </div>
              </DialogHeader>

              <div className="py-6 px-6">
                {personasList.length > 0 ? (
                  selectedPersona ? (
                    // Detailed persona view
                    <div className="space-y-5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPersona(null)}
                        className="mb-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        ← Back to persona list
                      </Button>

                      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-start mb-4 border-b pb-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-semibold mr-4">
                              {selectedPersona.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800">
                                {selectedPersona.name}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {selectedPersona.demographics.age} years old •{" "}
                                {selectedPersona.demographics.gender} •{" "}
                                {selectedPersona.demographics.industry}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => setIsChatOpen(true)}
                            className="bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                            size="sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Chat with Persona
                          </Button>
                        </div>

                        {/* Demographics section */}
                        <div className="mb-5">
                          <h4 className="text-base font-medium mb-3 text-slate-800 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-purple-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Demographics
                          </h4>
                          <div className="grid grid-cols-2 gap-y-2 text-sm bg-purple-50 p-4 rounded-md">
                            <div className="text-slate-600 font-medium flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-purple-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Country:
                            </div>
                            <div className="text-slate-800 font-semibold">
                              {selectedPersona.demographics.country || "N/A"}
                            </div>

                            <div className="text-slate-600 font-medium flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-purple-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Gender:
                            </div>
                            <div className="text-slate-800 font-semibold">
                              {selectedPersona.demographics.gender || "N/A"}
                            </div>

                            <div className="text-slate-600 font-medium flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-purple-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Age:
                            </div>
                            <div className="text-slate-800 font-semibold">
                              {selectedPersona.demographics.age || "N/A"}
                            </div>

                            <div className="text-slate-600 font-medium flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-purple-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Income:
                            </div>
                            <div className="text-slate-800 font-semibold">
                              {selectedPersona.demographics.income || "N/A"}
                            </div>

                            <div className="text-slate-600 font-medium flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 text-purple-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Industry:
                            </div>
                            <div className="text-slate-800 font-semibold">
                              {selectedPersona.demographics.industry || "N/A"}
                            </div>
                          </div>
                        </div>

                        {/* Responses section */}
                        {selectedPersona.responses.length > 0 && (
                          <div>
                            <h4 className="text-base font-medium mb-3 text-slate-800 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-green-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                  clipRule="evenodd"
                                />
                              </svg>
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
                                    className="p-4 border border-slate-200 rounded-md hover:border-green-200 transition-all bg-white shadow-sm"
                                  >
                                    <div className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                                      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-green-100 text-green-700 text-xs mr-2">
                                        {index + 1}
                                      </span>
                                      {response.question}
                                    </div>
                                    <div className="ml-7 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                                      {response.answer}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Personas list view
                    <div className="grid gap-3">
                      {personasList.map((persona, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-purple-200 hover:shadow-sm transition-all bg-white"
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-semibold mr-3">
                              {persona.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-800">
                                {persona.name}
                              </h4>
                              <p className="text-sm text-slate-500 mt-0.5">
                                {persona.demographics.age} years •{" "}
                                {persona.demographics.gender} •{" "}
                                {persona.demographics.country}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPersona(persona)}
                            className="border-purple-200 text-purple-600 hover:text-purple-600 hover:bg-purple-50"
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 py-8">
                      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-700 font-medium text-lg">
                        No personas available
                      </p>
                      <p className="text-sm text-slate-500 max-w-md">
                        The simulation data has been saved to Supabase, but the
                        personas data is not available. In production, this will
                        display actual persona data from the API.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="px-6 pb-6">
                <Button
                  onClick={() => setIsPersonasOpen(false)}
                  className="bg-slate-800 text-white hover:bg-slate-700 border-none shadow-sm"
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
              <DialogHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-t-lg border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Chat with {selectedPersona.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm mt-1 flex items-center text-slate-600">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {selectedPersona.demographics.age} years old •{" "}
                        {selectedPersona.demographics.gender} •{" "}
                        {selectedPersona.demographics.industry}
                      </div>
                    </DialogDescription>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-semibold">
                    {selectedPersona.name.charAt(0)}
                  </div>
                </div>
              </DialogHeader>

              <div className="py-6 px-6 space-y-4">
                {/* Chat history */}
                <div className="border border-slate-200 rounded-md p-4 h-[320px] overflow-y-auto flex flex-col space-y-4 bg-slate-50 shadow-inner">
                  {/* Example message from persona */}
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {selectedPersona.name.charAt(0)}
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 max-w-[85%] relative">
                      <div className="absolute left-[-8px] top-3 w-4 h-4 bg-white border-l border-t border-slate-200 transform rotate-45"></div>
                      <p className="text-sm text-slate-700 relative z-10">
                        Hello! I'm {selectedPersona.name}, a{" "}
                        {selectedPersona.demographics.age}-year-old{" "}
                        {selectedPersona.demographics.gender} working in the{" "}
                        {selectedPersona.demographics.industry} industry. How
                        can I help you?
                      </p>
                    </div>
                  </div>

                  {/* Example user message */}
                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-purple-100 p-3 rounded-lg max-w-[85%] relative">
                      <div className="absolute right-[-8px] top-3 w-4 h-4 bg-purple-100 transform rotate-45"></div>
                      <p className="text-sm text-purple-800 relative z-10">
                        Can you tell me about your typical shopping habits?
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      U
                    </div>
                  </div>

                  {/* Second example message from persona */}
                  <div className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {selectedPersona.name.charAt(0)}
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 max-w-[85%] relative">
                      <div className="absolute left-[-8px] top-3 w-4 h-4 bg-white border-l border-t border-slate-200 transform rotate-45"></div>
                      <p className="text-sm text-slate-700 relative z-10">
                        I typically shop online for convenience. I prefer brands
                        that offer quality products with good value. I'm willing
                        to spend more on items that will last longer, especially
                        electronics and clothing. I usually research products
                        thoroughly before making purchases over $100.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat input */}
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      className="w-full p-3 pr-10 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Send
                  </Button>
                </div>

                <div className="bg-slate-50 p-3 rounded-md text-center text-xs text-slate-500 border border-slate-200">
                  <p className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-slate-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    This chat is a demonstration of the persona concept. In
                    production, it would connect to a large language model to
                    simulate conversation.
                  </p>
                </div>
              </div>

              <DialogFooter className="px-6 pb-6">
                <Button
                  onClick={() => setIsChatOpen(false)}
                  className="bg-slate-800 text-white hover:bg-slate-700 border-none shadow-sm"
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
