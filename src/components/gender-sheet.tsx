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

interface GenderSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (genders: string[]) => void;
  defaultValues?: string[];
}

export function GenderSheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValues = [],
}: GenderSheetProps) {
  const [selectedGenders, setSelectedGenders] = useState<string[]>(defaultValues);

  const handleGenderSelect = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender],
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Gender</SheetTitle>
          <SheetDescription>Choose the gender you want your personas to have</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-12 mb-8">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleGenderSelect("female")}
          >
            <div
              className={cn(
                "h-5 w-5 rounded border border-primary flex items-center justify-center mr-3",
                selectedGenders.includes("female") ? "bg-primary" : "bg-transparent",
              )}
            >
              {selectedGenders.includes("female") && (
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
            <span>Female</span>
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleGenderSelect("male")}
          >
            <div
              className={cn(
                "h-5 w-5 rounded border border-primary flex items-center justify-center mr-3",
                selectedGenders.includes("male") ? "bg-primary" : "bg-transparent",
              )}
            >
              {selectedGenders.includes("male") && (
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
            <span>Male</span>
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleGenderSelect("others")}
          >
            <div
              className={cn(
                "h-5 w-5 rounded border border-primary flex items-center justify-center mr-3",
                selectedGenders.includes("others") ? "bg-primary" : "bg-transparent",
              )}
            >
              {selectedGenders.includes("others") && (
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
            <span>Others</span>
          </div>
        </div>
        <SheetClose asChild>
          <Button
            className="w-full mt-6 bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 rounded"
            onClick={() => {
              if (onSave) {
                onSave(selectedGenders);
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
