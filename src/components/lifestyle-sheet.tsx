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

const LIFESTYLE_OPTIONS = [
  "Minimalist",
  "Fitness-oriented",
  "Travel enthusiast",
  "Tech-savvy",
  "Family-focused",
  "Luxury-driven",
  "DIY/creative",
];

interface LifestyleSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (lifestyles: string[]) => void;
  defaultValues?: string[];
}

export function LifestyleSheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValues = [],
}: LifestyleSheetProps) {
  const [selectedLifestyles, setSelectedLifestyles] =
    useState<string[]>(defaultValues);

  const handleLifestyleSelect = (lifestyle: string) => {
    setSelectedLifestyles((prev) =>
      prev.includes(lifestyle)
        ? prev.filter((l) => l !== lifestyle)
        : [...prev, lifestyle]
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Lifestyle</SheetTitle>
          <SheetDescription>
            Choose the lifestyles for your personas
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6 mb-8 max-h-[60vh] overflow-y-auto">
          {LIFESTYLE_OPTIONS.map((lifestyle) => (
            <div
              key={lifestyle}
              className="flex items-center cursor-pointer"
              onClick={() => handleLifestyleSelect(lifestyle)}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded border border-primary flex items-center justify-center mr-3",
                  selectedLifestyles.includes(lifestyle)
                    ? "bg-primary"
                    : "bg-transparent"
                )}
              >
                {selectedLifestyles.includes(lifestyle) && (
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
              <span>{lifestyle}</span>
            </div>
          ))}
        </div>
        <SheetClose asChild>
          <Button
            className="w-full mt-6 bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 rounded"
            onClick={() => {
              if (onSave) {
                onSave(selectedLifestyles);
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
