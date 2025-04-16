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

const ATTITUDES_OPTIONS = [
  "Optimistic about technology",
  "Environmentally conscious",
  "Health-focused",
  "Brand-loyal",
  "Price-sensitive",
  "Open to new experiences",
  "Skeptical of advertising",
];

interface AttitudesSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (attitudes: string[]) => void;
  defaultValues?: string[];
}

export function AttitudesSheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValues = [],
}: AttitudesSheetProps) {
  const [selectedAttitudes, setSelectedAttitudes] =
    useState<string[]>(defaultValues);

  const handleAttitudeSelect = (attitude: string) => {
    setSelectedAttitudes((prev) =>
      prev.includes(attitude)
        ? prev.filter((a) => a !== attitude)
        : [...prev, attitude]
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Attitudes</SheetTitle>
          <SheetDescription>
            Choose the attitudes for your personas
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6 mb-8 max-h-[60vh] overflow-y-auto">
          {ATTITUDES_OPTIONS.map((attitude) => (
            <div
              key={attitude}
              className="flex items-center cursor-pointer"
              onClick={() => handleAttitudeSelect(attitude)}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded border border-primary flex items-center justify-center mr-3",
                  selectedAttitudes.includes(attitude)
                    ? "bg-primary"
                    : "bg-transparent"
                )}
              >
                {selectedAttitudes.includes(attitude) && (
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
              <span>{attitude}</span>
            </div>
          ))}
        </div>
        <SheetClose asChild>
          <Button
            className="w-full mt-6 bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 rounded"
            onClick={() => {
              if (onSave) {
                onSave(selectedAttitudes);
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
