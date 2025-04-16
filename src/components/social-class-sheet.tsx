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

const SOCIAL_CLASS_OPTIONS = [
  "Upper class",
  "Upper-middle class",
  "Middle class",
  "Working class",
  "Aspiring class",
];

interface SocialClassSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (socialClasses: string[]) => void;
  defaultValues?: string[];
}

export function SocialClassSheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValues = [],
}: SocialClassSheetProps) {
  const [selectedSocialClasses, setSelectedSocialClasses] =
    useState<string[]>(defaultValues);

  const handleSocialClassSelect = (socialClass: string) => {
    setSelectedSocialClasses((prev) =>
      prev.includes(socialClass)
        ? prev.filter((sc) => sc !== socialClass)
        : [...prev, socialClass]
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Social Class</SheetTitle>
          <SheetDescription>
            Choose the social classes for your personas
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6 mb-8 max-h-[60vh] overflow-y-auto">
          {SOCIAL_CLASS_OPTIONS.map((socialClass) => (
            <div
              key={socialClass}
              className="flex items-center cursor-pointer"
              onClick={() => handleSocialClassSelect(socialClass)}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded border border-primary flex items-center justify-center mr-3",
                  selectedSocialClasses.includes(socialClass)
                    ? "bg-primary"
                    : "bg-transparent"
                )}
              >
                {selectedSocialClasses.includes(socialClass) && (
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
              <span>{socialClass}</span>
            </div>
          ))}
        </div>
        <SheetClose asChild>
          <Button
            className="w-full mt-6 bg-[#0f172a] hover:bg-[#1e293b] text-white py-3 rounded"
            onClick={() => {
              if (onSave) {
                onSave(selectedSocialClasses);
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
