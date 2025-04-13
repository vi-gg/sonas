"use client";

import { useState, useEffect } from "react";
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

interface Country {
  name: {
    common: string;
  };
  cca2: string;
}

interface CountrySheetProps {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (countryCode: string) => void;
  defaultValue?: string;
}

export function CountrySheet({
  className,
  open,
  onOpenChange,
  onSave,
  defaultValue = "US",
}: CountrySheetProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultValue);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");
        const data = await response.json();
        // Sort alphabetically by name
        data.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn("sm:max-w-md", className)}>
        <SheetHeader>
          <SheetTitle>Country</SheetTitle>
          <SheetDescription>Choose the country where your personas live</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading countries...
                    </SelectItem>
                  ) : countries.length > 0 ? (
                    countries.map((country) => (
                      <SelectItem key={country.cca2} value={country.cca2}>
                        {country.name.common}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="not-found" disabled>
                      No countries found
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <SheetClose asChild>
            <Button
              className="w-full bg-primary text-primary-foreground"
              onClick={() => {
                if (onSave && selectedCountry) {
                  onSave(selectedCountry);
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
