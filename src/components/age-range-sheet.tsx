"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface AgeRangeSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (ageRange: string) => void;
  defaultValue?: string;
}

export function AgeRangeSheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValue = "18-60",
}: AgeRangeSheetProps) {
  const [lowerLimit, setLowerLimit] = useState(() => {
    if (defaultValue && defaultValue.includes("-")) {
      return defaultValue.split("-")[0] || "18";
    }
    return "18";
  });

  const [upperLimit, setUpperLimit] = useState(() => {
    if (defaultValue && defaultValue.includes("-")) {
      return defaultValue.split("-")[1] || "60";
    }
    return "60";
  });
  const handleSave = () => {
    const ageRange = `${lowerLimit}-${upperLimit}`;
    if (onSave) {
      onSave(ageRange);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Age range</SheetTitle>
          <SheetDescription>Choose the age range for your personas</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <label htmlFor="lower-limit" className="block font-medium">
              Lower limit
            </label>
            <Input
              id="lower-limit"
              type="number"
              placeholder="Eg. 18"
              className="w-full"
              min="0"
              max="100"
              value={lowerLimit}
              onChange={(e) => setLowerLimit(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="upper-limit" className="block font-medium">
              Upper limit
            </label>
            <Input
              id="upper-limit"
              type="number"
              placeholder="Eg. 60"
              className="w-full"
              min="0"
              max="100"
              value={upperLimit}
              onChange={(e) => setUpperLimit(e.target.value)}
            />
          </div>
          <SheetClose asChild>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSave}
            >
              Save changes
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
