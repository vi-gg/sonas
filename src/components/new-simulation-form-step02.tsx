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
import { PersonalitySheet } from "@/components/personality-sheet";
import { AttitudesSheet } from "@/components/attitudes-sheet";
import { OpinionsSheet } from "@/components/opinions-sheet";
import { SocialClassSheet } from "@/components/social-class-sheet";
import { LifestyleSheet } from "@/components/lifestyle-sheet";
import { InterestsSheet } from "@/components/interests-sheet";

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
  const [personalityOpen, setPersonalityOpen] = useState(false);
  const [attitudesOpen, setAttitudesOpen] = useState(false);
  const [opinionsOpen, setOpinionsOpen] = useState(false);
  const [socialClassOpen, setSocialClassOpen] = useState(false);
  const [lifestyleOpen, setLifestyleOpen] = useState(false);
  const [interestsOpen, setInterestsOpen] = useState(false);
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
    window.alert(
      "You can select different criteria from the available options."
    );
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

  // Handle psychographics sheet saves
  const handlePersonalitySave = (personalities: string[]) => {
    if (updateFormData) {
      updateFormData({
        psychographics: {
          ...formData.psychographics,
          personality: personalities,
        },
      });
    }
  };

  const handleAttitudesSave = (attitudes: string[]) => {
    if (updateFormData) {
      updateFormData({
        psychographics: {
          ...formData.psychographics,
          attitudes: attitudes,
        },
      });
    }
  };

  const handleOpinionsSave = (opinions: string[]) => {
    if (updateFormData) {
      updateFormData({
        psychographics: {
          ...formData.psychographics,
          opinions: opinions,
        },
      });
    }
  };

  const handleSocialClassSave = (socialClasses: string[]) => {
    if (updateFormData) {
      updateFormData({
        psychographics: {
          ...formData.psychographics,
          socialClass: socialClasses,
        },
      });
    }
  };

  const handleLifestyleSave = (lifestyles: string[]) => {
    if (updateFormData) {
      updateFormData({
        psychographics: {
          ...formData.psychographics,
          lifestyle: lifestyles,
        },
      });
    }
  };

  const handleInterestsSave = (interests: string[]) => {
    if (updateFormData) {
      updateFormData({
        psychographics: {
          ...formData.psychographics,
          interests: interests,
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
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium text-black">Demographics</p>
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
          </div>

          <div className="space-y-2">
            <p className="font-medium text-black">Psychographics</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="font-normal"
                onClick={() => setPersonalityOpen(true)}
              >
                Personality
              </Button>
              <Button
                variant="outline"
                className="font-normal"
                onClick={() => setAttitudesOpen(true)}
              >
                Attitudes
              </Button>
              <Button
                variant="outline"
                className="font-normal"
                onClick={() => setOpinionsOpen(true)}
              >
                Opinions
              </Button>
              <Button
                variant="outline"
                className="font-normal"
                onClick={() => setSocialClassOpen(true)}
              >
                Social Class
              </Button>
              <Button
                variant="outline"
                className="font-normal"
                onClick={() => setLifestyleOpen(true)}
              >
                Lifestyle
              </Button>
              <Button
                variant="outline"
                className="font-normal"
                onClick={() => setInterestsOpen(true)}
              >
                Interests
              </Button>
            </div>
          </div>
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

      {/* Demographics Sheets */}
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

      {/* Psychographics Sheets */}
      <PersonalitySheet
        open={personalityOpen}
        onOpenChange={setPersonalityOpen}
        onSave={handlePersonalitySave}
        defaultValues={formData?.psychographics?.personality || []}
      />
      <AttitudesSheet
        open={attitudesOpen}
        onOpenChange={setAttitudesOpen}
        onSave={handleAttitudesSave}
        defaultValues={formData?.psychographics?.attitudes || []}
      />
      <OpinionsSheet
        open={opinionsOpen}
        onOpenChange={setOpinionsOpen}
        onSave={handleOpinionsSave}
        defaultValues={formData?.psychographics?.opinions || []}
      />
      <SocialClassSheet
        open={socialClassOpen}
        onOpenChange={setSocialClassOpen}
        onSave={handleSocialClassSave}
        defaultValues={formData?.psychographics?.socialClass || []}
      />
      <LifestyleSheet
        open={lifestyleOpen}
        onOpenChange={setLifestyleOpen}
        onSave={handleLifestyleSave}
        defaultValues={formData?.psychographics?.lifestyle || []}
      />
      <InterestsSheet
        open={interestsOpen}
        onOpenChange={setInterestsOpen}
        onSave={handleInterestsSave}
        defaultValues={formData?.psychographics?.interests || []}
      />
    </div>
  );
}
