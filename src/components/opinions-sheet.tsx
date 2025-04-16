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

const OPINIONS_OPTIONS = [
  "Strongly supports sustainability",
  "Believes in work-life balance",
  "Values convenience over cost",
  "Prefers local products",
  "Trusts online reviews",
  "Prioritizes personal growth",
  "Questions traditional media",
];

interface OpinionsSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (opinions: string[]) => void;
  defaultValues?: string[];
}

export function OpinionsSheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValues = [],
}: OpinionsSheetProps) {
  const [selectedOpinions, setSelectedOpinions] =
    useState<string[]>(defaultValues);

  const handleOpinionSelect = (opinion: string) => {
    setSelectedOpinions((prev) =>
      prev.includes(opinion)
        ? prev.filter((o) => o !== opinion)
        : [...prev, opinion]
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Opinions</SheetTitle>
          <SheetDescription>
            Choose the opinions for your personas
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6 mb-8 max-h-[60vh] overflow-y-auto">
          {OPINIONS_OPTIONS.map((opinion) => (
            <div
              key={opinion}
              className="flex items-center cursor-pointer"
              onClick={() => handleOpinionSelect(opinion)}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded border border-primary flex items-center justify-center mr-3",
                  selectedOpinions.includes(opinion)
                    ? "bg-primary"
                    : "bg-transparent"
                )}
              >
                {selectedOpinions.includes(opinion) && (
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
              <span>{opinion}</span>
            </div>
          ))}
        </div>
        <SheetClose asChild>
          <Button
            className="w-full mt-6 bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 rounded"
            onClick={() => {
              if (onSave) {
                onSave(selectedOpinions);
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
