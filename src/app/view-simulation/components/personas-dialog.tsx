"use client";

import { useState } from "react";
import { Simulation, PersonaDetails } from "../types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChatWithPersona } from "./chat-with-persona";

interface PersonasDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  simulation: Simulation | null;
  personasList: PersonaDetails[];
}

export function PersonasDialog({
  isOpen,
  onOpenChange,
  simulation,
  personasList,
}: PersonasDialogProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaDetails | null>(
    null
  );
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!simulation) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-t-lg border-b">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-800">
                  {selectedPersona
                    ? `Persona: ${selectedPersona.name}`
                    : `Personas: ${simulation.simulation_name}`}
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

                    {/* Psychographics section */}
                    {selectedPersona.psychographics && (
                      <div className="mb-5">
                        <h4 className="text-base font-medium mb-3 text-slate-800 flex items-center">
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
                        </h4>
                        <div className="grid grid-cols-2 gap-y-2 text-sm bg-indigo-50 p-4 rounded-md">
                          {selectedPersona.psychographics.personality && (
                            <>
                              <div className="text-slate-600 font-medium flex items-center">
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
                              <div className="text-slate-800 font-semibold flex flex-wrap gap-1">
                                {selectedPersona.psychographics.personality.map(
                                  (trait: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs"
                                    >
                                      {trait}
                                    </span>
                                  )
                                )}
                              </div>
                            </>
                          )}

                          {selectedPersona.psychographics.attitudes && (
                            <>
                              <div className="text-slate-600 font-medium flex items-center">
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
                              <div className="text-slate-800 font-semibold flex flex-wrap gap-1">
                                {selectedPersona.psychographics.attitudes.map(
                                  (attitude: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs"
                                    >
                                      {attitude}
                                    </span>
                                  )
                                )}
                              </div>
                            </>
                          )}

                          {selectedPersona.psychographics.opinions && (
                            <>
                              <div className="text-slate-600 font-medium flex items-center">
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
                              <div className="text-slate-800 font-semibold flex flex-wrap gap-1">
                                {selectedPersona.psychographics.opinions.map(
                                  (opinion: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs"
                                    >
                                      {opinion}
                                    </span>
                                  )
                                )}
                              </div>
                            </>
                          )}

                          {selectedPersona.psychographics.socialClass && (
                            <>
                              <div className="text-slate-600 font-medium flex items-center">
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
                              <div className="text-slate-800 font-semibold flex flex-wrap gap-1">
                                {selectedPersona.psychographics.socialClass.map(
                                  (socialClass: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs"
                                    >
                                      {socialClass}
                                    </span>
                                  )
                                )}
                              </div>
                            </>
                          )}

                          {selectedPersona.psychographics.lifestyle && (
                            <>
                              <div className="text-slate-600 font-medium flex items-center">
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
                              <div className="text-slate-800 font-semibold flex flex-wrap gap-1">
                                {selectedPersona.psychographics.lifestyle.map(
                                  (lifestyle: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs"
                                    >
                                      {lifestyle}
                                    </span>
                                  )
                                )}
                              </div>
                            </>
                          )}

                          {selectedPersona.psychographics.interests && (
                            <>
                              <div className="text-slate-600 font-medium flex items-center">
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
                              <div className="text-slate-800 font-semibold flex flex-wrap gap-1">
                                {selectedPersona.psychographics.interests.map(
                                  (interest: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs"
                                    >
                                      {interest}
                                    </span>
                                  )
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

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
              onClick={() => onOpenChange(false)}
              className="bg-slate-800 text-white hover:bg-slate-700 border-none shadow-sm"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat with Persona Dialog */}
      <Dialog
        open={isChatOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsChatOpen(false);
          }
        }}
      >
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

              <ChatWithPersona
                persona={selectedPersona}
                onClose={() => setIsChatOpen(false)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
