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

const INTERESTS_OPTIONS = [
  "Gaming",
  "Travel",
  "Music",
  "Sports",
  "Cooking",
  "Reading",
  "Technology",
  "Fashion",
  "Arts & Crafts",
  "Photography",
];

interface InterestsSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (interests: string[]) => void;
  defaultValues?: string[];
}

export function InterestsSheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValues = [],
}: InterestsSheetProps) {
  const [selectedInterests, setSelectedInterests] =
    useState<string[]>(defaultValues);

  const handleInterestSelect = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Interests</SheetTitle>
          <SheetDescription>
            Choose the interests for your personas
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6 mb-8 max-h-[60vh] overflow-y-auto">
          {INTERESTS_OPTIONS.map((interest) => (
            <div
              key={interest}
              className="flex items-center cursor-pointer"
              onClick={() => handleInterestSelect(interest)}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded border border-primary flex items-center justify-center mr-3",
                  selectedInterests.includes(interest)
                    ? "bg-primary"
                    : "bg-transparent"
                )}
              >
                {selectedInterests.includes(interest) && (
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
              <span>{interest}</span>
            </div>
          ))}
        </div>
        <SheetClose asChild>
          <Button
            className="w-full mt-6 bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 rounded"
            onClick={() => {
              if (onSave) {
                onSave(selectedInterests);
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
