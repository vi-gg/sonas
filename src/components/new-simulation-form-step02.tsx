"use client";

import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AgeRangeSheet } from "@/components/age-range-sheet";
import { CountrySheet } from "@/components/country-sheet";
import { GenderSheet } from "@/components/gender-sheet";
import { HouseholdIncomeSheet } from "@/components/household-income-sheet";

interface NewSimulationFormStep02Props {
  className?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  formData?: any;
  updateFormData?: (data: any) => void;
}

export function NewSimulationFormStep02({
  className,
  onNext,
  onPrevious,
  formData = { responseCount: 20 },
  updateFormData,
}: NewSimulationFormStep02Props) {
  const [ageRangeOpen, setAgeRangeOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [householdIncomeOpen, setHouseholdIncomeOpen] = useState(false);
  const [responseCount, setResponseCount] = useState(formData.responseCount);

  // Update parent form data when response count changes
  const updateResponseCount = (value: number) => {
    setResponseCount(value);
    if (updateFormData) {
      updateFormData({ responseCount: value });
    }
  };

  // Initialize from form data
  useEffect(() => {
    if (formData?.responseCount) {
      setResponseCount(formData.responseCount);
    }
  }, [formData?.responseCount]);

  const handleAddMoreCriteria = () => {
    window.alert("Feature under development");
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
  };

  // Handle sheet saves
  const handleCountrySave = (selectedCountry: string) => {
    if (updateFormData && selectedCountry) {
      updateFormData({
        demographics: {
          ...formData.demographics,
          countries: [selectedCountry],
        },
      });
    }
  };

  const handleGenderSave = (selectedGenders: string[]) => {
    if (updateFormData) {
      updateFormData({
        demographics: {
          ...formData.demographics,
          genders: selectedGenders,
        },
      });
    }
  };

  const handleAgeRangeSave = (ageRange: string) => {
    if (updateFormData) {
      updateFormData({
        demographics: {
          ...formData.demographics,
          ageRanges: [ageRange],
        },
      });
    }
  };

  const handleIncomeSave = (income: string) => {
    if (updateFormData) {
      updateFormData({
        demographics: {
          ...formData.demographics,
          householdIncomes: [income],
        },
      });
    }
  };

  return (
    <div
      className={cn(
        "p-6 bg-white rounded-lg border border-border w-[768px]",
        className
      )}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Step 02</p>
          <h2 className="text-2xl font-heading font-semibold mt-1 text-black">
            Choose demographics
          </h2>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-black">
            How many responses do you want?
          </p>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={responseCount}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 5 && value <= 50) {
                  updateResponseCount(value);
                }
              }}
              className="w-24"
            />
            <div className="flex-1">
              <Slider
                value={[responseCount]}
                min={5}
                max={50}
                step={1}
                onValueChange={(value) => updateResponseCount(value[0])}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-black">
            What type of filtering criteria do you want?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="font-normal"
              onClick={() => setCountryOpen(true)}
            >
              Country
            </Button>
            <Button
              variant="outline"
              className="font-normal"
              onClick={() => setGenderOpen(true)}
            >
              Gender
            </Button>
            <Button
              variant="outline"
              className="font-normal"
              onClick={() => setAgeRangeOpen(true)}
            >
              Age Range
            </Button>
            <Button
              variant="outline"
              className="font-normal"
              onClick={() => setHouseholdIncomeOpen(true)}
            >
              Household Income
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full mt-2 justify-center"
            onClick={handleAddMoreCriteria}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add more filtering criteria
          </Button>
        </div>
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrevious}>
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

      <AgeRangeSheet
        open={ageRangeOpen}
        onOpenChange={setAgeRangeOpen}
        onSave={handleAgeRangeSave}
        defaultValue={formData?.demographics?.ageRanges?.[0] || "18-60"}
      />
      <CountrySheet
        open={countryOpen}
        onOpenChange={setCountryOpen}
        onSave={handleCountrySave}
        defaultValue={formData?.demographics?.countries?.[0] || "US"}
      />
      <GenderSheet
        open={genderOpen}
        onOpenChange={setGenderOpen}
        onSave={handleGenderSave}
        defaultValues={formData?.demographics?.genders || []}
      />
      <HouseholdIncomeSheet
        open={householdIncomeOpen}
        onOpenChange={setHouseholdIncomeOpen}
        onSave={handleIncomeSave}
        defaultValue={formData?.demographics?.householdIncomes?.[0] || "200k+"}
      />
    </div>
  );
}
