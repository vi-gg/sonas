import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewSimulationFormStep03bProps {
  className?: string;
}

export function NewSimulationFormStep03b({ className }: NewSimulationFormStep03bProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-background p-8", className)}>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Step 03</p>
          <h2 className="text-2xl font-bold font-heading mt-1">
            Add questions which you want your personas to answer
          </h2>
        </div>
        <div className="space-y-3">
          <Button
            variant="default"
            className="w-full bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center justify-center py-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add a question
          </Button>
          <Button
            variant="outline"
            className="w-full bg-[#E5EAF2] text-[#0F172A] hover:bg-[#D1D9E6] flex items-center justify-center py-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Edit question 01
          </Button>
          <Button
            variant="outline"
            className="w-full bg-[#E5EAF2] text-[#0F172A] hover:bg-[#D1D9E6] flex items-center justify-center py-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Edit question 02
          </Button>
          <Button
            variant="outline"
            className="w-full bg-[#E5EAF2] text-[#0F172A] hover:bg-[#D1D9E6] flex items-center justify-center py-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Edit question 03
          </Button>
          <Button
            variant="outline"
            className="w-full bg-[#E5EAF2] text-[#0F172A] hover:bg-[#D1D9E6] flex items-center justify-center py-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Edit question 04
          </Button>
          <Button
            variant="outline"
            className="w-full bg-[#E5EAF2] text-[#0F172A] hover:bg-[#D1D9E6] flex items-center justify-center py-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Edit question 05
          </Button>
          <Button
            variant="outline"
            className="w-full bg-[#E5EAF2] text-[#0F172A] hover:bg-[#D1D9E6] flex items-center justify-center py-5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Edit question 06
          </Button>
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="outline" className="border border-border">
            Previous
          </Button>
          <Button className="bg-[#0F172A] text-white hover:bg-[#1E293B]">Next</Button>
        </div>
      </div>
    </div>
  );
}
