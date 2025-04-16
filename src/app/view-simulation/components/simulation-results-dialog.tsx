"use client";

import { Simulation, AggregatedResponse } from "../types";
import { formatDate } from "../utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SimulationResultsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  simulation: Simulation | null;
  aggregatedResults: AggregatedResponse[];
}

export function SimulationResultsDialog({
  isOpen,
  onOpenChange,
  simulation,
  aggregatedResults,
}: SimulationResultsDialogProps) {
  if (!simulation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-lg border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-800">
                Results: {simulation.simulation_name}
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
              {simulation.response_count} Responses
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
            onClick={() => onOpenChange(false)}
            className="bg-slate-800 text-white hover:bg-slate-700 border-none shadow-sm"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
