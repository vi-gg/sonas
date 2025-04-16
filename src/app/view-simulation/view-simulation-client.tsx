"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { createClient } from "../../../utils/supabase/client";
import {
  Simulation,
  AggregatedResponse,
  PersonaDetails,
  ViewSimulationClientProps,
} from "./types";
import {
  extractPsychographicsFromResults,
  extractUniquePersonas,
  processResults,
  formatDate,
} from "./utils";
import { SimulationDetailsDialog } from "./components/simulation-details-dialog";
import { SimulationResultsDialog } from "./components/simulation-results-dialog";
import { PersonasDialog } from "./components/personas-dialog";
// Import mock data only for development environments
// import { addMockResultsToSimulations } from "./mock-data";

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
  const [personasList, setPersonasList] = useState<PersonaDetails[]>([]);

  // Handler for View Details button
  const handleViewDetails = (simulation: Simulation) => {
    let psychographics = simulation.psychographics || {
      personality: [],
      attitudes: [],
      opinions: [],
      socialClass: [],
      lifestyle: [],
      interests: [],
    };

    // If there are results, extract psychographics from them
    if (simulation.results && simulation.results.length > 0) {
      const extractedPsychographics = extractPsychographicsFromResults(
        simulation.results
      );

      // Merge any existing psychographics with extracted data
      psychographics = {
        personality:
          extractedPsychographics.personality.length > 0
            ? extractedPsychographics.personality
            : psychographics.personality,
        attitudes:
          extractedPsychographics.attitudes.length > 0
            ? extractedPsychographics.attitudes
            : psychographics.attitudes,
        opinions:
          extractedPsychographics.opinions.length > 0
            ? extractedPsychographics.opinions
            : psychographics.opinions,
        socialClass:
          extractedPsychographics.socialClass.length > 0
            ? extractedPsychographics.socialClass
            : psychographics.socialClass,
        lifestyle:
          extractedPsychographics.lifestyle.length > 0
            ? extractedPsychographics.lifestyle
            : psychographics.lifestyle,
        interests:
          extractedPsychographics.interests.length > 0
            ? extractedPsychographics.interests
            : psychographics.interests,
      };
    }

    const simulationWithPsychographics = {
      ...simulation,
      psychographics,
    };

    setCurrentSimulation(simulationWithPsychographics);
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
    } else {
      // Handle case where no results are available
      setPersonasList([]);
      setIsPersonasOpen(true);
    }
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

      {/* Global styles for dialogs */}
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

        /* Animation for smooth fade-in */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Typing indicator animation */
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 5px;
          width: 5px;
          margin: 0 1px;
          background-color: #a78bfa;
          border-radius: 50%;
          display: inline-block;
          opacity: 0.4;
        }
        .typing-indicator span:nth-of-type(1) {
          animation: pulse 1s infinite 0.1s;
        }
        .typing-indicator span:nth-of-type(2) {
          animation: pulse 1s infinite 0.2s;
        }
        .typing-indicator span:nth-of-type(3) {
          animation: pulse 1s infinite 0.3s;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.4);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.4;
          }
        }

        /* Smooth message transition */
        .ChatWithPersona p {
          transition: opacity 0.3s ease-in-out;
        }
      `}</style>

      {/* Dialogs */}
      <SimulationDetailsDialog
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        simulation={currentSimulation}
      />

      <SimulationResultsDialog
        isOpen={isResultsOpen}
        onOpenChange={setIsResultsOpen}
        simulation={currentSimulation}
        aggregatedResults={aggregatedResults}
      />

      <PersonasDialog
        isOpen={isPersonasOpen}
        onOpenChange={setIsPersonasOpen}
        simulation={currentSimulation}
        personasList={personasList}
      />
    </AppSidebar>
  );
}
