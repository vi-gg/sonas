"use client";

import { Simulation } from "../types";
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

interface SimulationDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  simulation: Simulation | null;
}

export function SimulationDetailsDialog({
  isOpen,
  onOpenChange,
  simulation,
}: SimulationDetailsDialogProps) {
  if (!simulation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-lg border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-slate-800">
                {simulation.simulation_name}
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
                {formatDate(simulation.created_at)}
              </DialogDescription>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                simulation.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : simulation.status === "processing"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
              }`}
            >
              {simulation.status || "Completed"}
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
                {simulation.response_count}
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
                {formatDate(simulation.updated_at)}
              </div>
            </div>
          </div>

          {/* Demographics */}
          {simulation.demographics && (
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
                    {simulation.demographics.countries?.map((country, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs"
                      >
                        {country}
                      </span>
                    ))}
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
                    {simulation.demographics.genders?.map((gender, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs"
                      >
                        {gender}
                      </span>
                    ))}
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
                    {simulation.demographics.ageRanges?.map((age, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs"
                      >
                        {age}
                      </span>
                    ))}
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
                    {simulation.demographics.householdIncomes?.map(
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

          {/* Psychographics */}
          {simulation.psychographics && (
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
              <h3 className="text-base font-medium mb-3 text-slate-800 flex items-center border-b pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-indigo-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Psychographics
              </h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-slate-500 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-indigo-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Personality:
                </div>
                <div className="font-semibold text-slate-700">
                  <div className="flex flex-wrap gap-1">
                    {simulation.psychographics.personality?.map(
                      (trait, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs"
                        >
                          {trait}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="text-slate-500 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-indigo-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Attitudes:
                </div>
                <div className="font-semibold text-slate-700">
                  <div className="flex flex-wrap gap-1">
                    {simulation.psychographics.attitudes?.map(
                      (attitude, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs"
                        >
                          {attitude}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="text-slate-500 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-indigo-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Opinions:
                </div>
                <div className="font-semibold text-slate-700">
                  <div className="flex flex-wrap gap-1">
                    {simulation.psychographics.opinions?.map((opinion, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs"
                      >
                        {opinion}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-slate-500 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-indigo-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Social Class:
                </div>
                <div className="font-semibold text-slate-700">
                  <div className="flex flex-wrap gap-1">
                    {simulation.psychographics.socialClass?.map(
                      (socialClass, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs"
                        >
                          {socialClass}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="text-slate-500 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-indigo-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Lifestyle:
                </div>
                <div className="font-semibold text-slate-700">
                  <div className="flex flex-wrap gap-1">
                    {simulation.psychographics.lifestyle?.map(
                      (lifestyle, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs"
                        >
                          {lifestyle}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="text-slate-500 font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-indigo-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Interests:
                </div>
                <div className="font-semibold text-slate-700">
                  <div className="flex flex-wrap gap-1">
                    {simulation.psychographics.interests?.map(
                      (interest, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs"
                        >
                          {interest}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Questions */}
          {simulation.questions && simulation.questions.length > 0 && (
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
                {simulation.questions.map((q, index) => (
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
