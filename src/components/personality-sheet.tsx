"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

const PERSONALITY_OPTIONS = [
  "Outgoing",
  "Introverted",
  "Adventurous",
  "Analytical",
  "Creative",
  "Pragmatic",
  "Empathetic",
];

interface PersonalitySheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (personalities: string[]) => void;
  defaultValues?: string[];
}

export function PersonalitySheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValues = [],
}: PersonalitySheetProps) {
  const [selectedPersonalities, setSelectedPersonalities] =
    useState<string[]>(defaultValues);

  const handlePersonalitySelect = (personality: string) => {
    setSelectedPersonalities((prev) =>
      prev.includes(personality)
        ? prev.filter((p) => p !== personality)
        : [...prev, personality]
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Personality</SheetTitle>
          <SheetDescription>
            Choose the personality traits for your personas
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6 mb-8 max-h-[60vh] overflow-y-auto">
          {PERSONALITY_OPTIONS.map((personality) => (
            <div
              key={personality}
              className="flex items-center cursor-pointer"
              onClick={() => handlePersonalitySelect(personality)}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded border border-primary flex items-center justify-center mr-3",
                  selectedPersonalities.includes(personality)
                    ? "bg-primary"
                    : "bg-transparent"
                )}
              >
                {selectedPersonalities.includes(personality) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span>{personality}</span>
            </div>
          ))}
        </div>
        <SheetClose asChild>
          <Button
            className="w-full mt-6 bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 rounded"
            onClick={() => {
              if (onSave) {
                onSave(selectedPersonalities);
              }
            }}
          >
            Save changes
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
