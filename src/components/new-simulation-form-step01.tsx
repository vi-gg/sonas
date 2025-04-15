import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewSimulationFormStep01Props {
  className?: string;
  onNext?: () => void;
  formData?: any;
  updateFormData?: (data: any) => void;
}

export function NewSimulationFormStep01({
  className,
  onNext,
  formData = { simulationName: "My New Simulation" },
  updateFormData,
}: NewSimulationFormStep01Props) {
  const [simulationName, setSimulationName] = useState(
    formData.simulationName || ""
  );

  // Update parent form data when simulation name changes
  useEffect(() => {
    if (updateFormData) {
      updateFormData({ simulationName });
    }
  }, [simulationName, updateFormData]);

  const handleNext = () => {
    if (onNext) {
      // Make sure the form data is updated before proceeding
      if (updateFormData) {
        updateFormData({ simulationName });
      }
      onNext();
    }
  };

  return (
    <CardContent className={cn("p-6 border rounded-lg w-[768px]", className)}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-black">
            Create simulation
          </h1>
        </div>
        <div className="space-y-2">
          <Label htmlFor="simulation-name" className="font-medium text-black">
            Simulation Name
          </Label>
          <Input
            id="simulation-name"
            placeholder="Name of your project"
            className="w-full"
            value={simulationName}
            onChange={(e) => setSimulationName(e.target.value)}
          />
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button
            className="bg-black text-white hover:bg-black/90"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </CardContent>
  );
}
