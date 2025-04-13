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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HouseholdIncomeSheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (incomeId: string) => void;
  defaultValue?: string;
}

const incomeRanges = [
  { id: "10-20k", label: "$10,000 — $20,000" },
  { id: "20-40k", label: "$20,000 — $40,000" },
  { id: "40-60k", label: "$40,000 — $60,000" },
  { id: "60-100k", label: "$60,000 — $100,000" },
  { id: "100-200k", label: "$100,000 — $200,000" },
  { id: "200k+", label: "$200,000+" },
];

export function HouseholdIncomeSheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValue = "200k+",
}: HouseholdIncomeSheetProps) {
  const [selectedIncome, setSelectedIncome] = useState(defaultValue);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Household income</SheetTitle>
          <SheetDescription>Choose the household income range</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3">Select income range</h3>
            <Select value={selectedIncome} onValueChange={setSelectedIncome}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {incomeRanges.map((range) => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <SheetClose asChild>
            <Button
              className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => {
                if (onSave && selectedIncome) {
                  onSave(selectedIncome);
                }
              }}
            >
              Save changes
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
