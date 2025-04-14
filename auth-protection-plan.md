# Authentication Protection Plan for `/new-simulation` Route

## Overview

This plan outlines the steps to protect the `/new-simulation` route with Supabase authentication, similar to how the `/private` route is protected. We'll use a server component wrapper approach to minimize changes and reduce the risk of errors.

## Current Implementation

- The `/private` route uses server-side authentication with `createClient` from `utils/supabase/server.ts`
- The `/new-simulation` route uses client-side authentication with `createClient` from `utils/supabase/client.ts`
- The middleware should be protecting routes, but there might be issues with the client-side implementation

## Solution: Server Component Wrapper

We'll create a server component wrapper that:

1. Checks authentication using server-side Supabase client
2. Redirects to login if not authenticated
3. Renders the existing client component if authenticated

## Implementation Steps

### Step 1: Move the Current Client Component

Create a new file `src/app/new-simulation/new-simulation-client.tsx` and move the current client component there:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarFooter,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { NewSimulationFormStep01 } from "@/components/new-simulation-form-step01";
import { NewSimulationFormStep02 } from "@/components/new-simulation-form-step02";
import { NewSimulationFormStep03 } from "@/components/new-simulation-form-step03";
import { NewSimulationFormStep04 } from "@/components/new-simulation-form-step04";
import {
  GalleryVerticalEnd,
  ChevronsUpDown,
  AudioWaveform,
  Command,
  Plus,
  Frame,
  Ellipsis,
  Folder,
  Forward,
  Trash2,
  PieChart,
  Map,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";

export default function NewSimulationClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // State to store form data across steps
  const [formData, setFormData] = useState({
    simulationName: "My New Simulation",
    responseCount: 20,
    demographics: {
      countries: ["US"], // Default country is USA
      genders: ["male", "female", "others"], // All genders selected by default
      ageRanges: ["18-60"], // Default age range is 18 to 60
      householdIncomes: ["200k+"], // Default is household income over 200k
    },
    questions: [], // No default questions
  });

  // IMPORTANT: Remove the authentication check useEffect since it will be handled by the server component

  // Navigate between steps
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update form data
  const updateFormData = (newData: any) => {
    setFormData({ ...formData, ...newData });
  };

  // Final submission handler
  const handleSubmit = async () => {
    // Transform the form data into the required JSON format
    const formattedData = {
      num_responses: formData.responseCount.toString(),
      target_audience: {
        country:
          formData.demographics.countries[0] === "US"
            ? "United States"
            : formData.demographics.countries[0],
        gender:
          formData.demographics.genders.length === 3
            ? "All"
            : formData.demographics.genders.join(", "),
        age_range: parseAgeRange(formData.demographics.ageRanges[0]),
        household_income_range: parseIncomeRange(
          formData.demographics.householdIncomes[0]
        ),
        employment: {
          employment_status: ["employed"],
          industry: [
            "healthcare",
            "technology",
            "education",
            "retail",
            "finance",
          ],
        },
      },
      survey: formData.questions.map(
        (q: { question: string; options: string[] }) => ({
          question: q.question,
          choices: q.options,
        })
      ),
    };

    // Log the formatted JSON to the console
    console.log(JSON.stringify(formattedData, null, 2));

    try {
      // Send the formatted data to the personas endpoint via our API
      const response = await fetch("/api/simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting simulation:", errorData);
        // You could add toast notification or alert here to show the error
        return;
      }

      const result = await response.json();
      console.log("Simulation submitted successfully:", result);
      // You could add toast notification or redirect here upon success
    } catch (error) {
      console.error("Error submitting simulation:", error);
      // You could add toast notification or alert here to show the error
    }
  };

  // Helper function to parse age range string into array of numbers
  const parseAgeRange = (ageRangeStr: string): [number, number] => {
    const [min, max] = ageRangeStr.split("-").map(Number);
    return [min, max || 65]; // Default max to 65 if not specified
  };

  // Helper function to parse income range string
  const parseIncomeRange = (incomeStr: string): [string, string] => {
    if (incomeStr === "200k+") {
      return ["150k", "200k+"];
    } else if (incomeStr === "100k-200k") {
      return ["100k", "200k"];
    } else if (incomeStr === "50k-100k") {
      return ["50k", "100k"];
    } else {
      return ["30k", "150k"]; // Default range
    }
  };

  // Progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="flex w-full max-w-md mx-auto mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1 px-1">
            <div
              className={`h-2 rounded-full ${step <= currentStep ? "bg-blue-600" : "bg-gray-200"}`}
            />
            <div className="text-xs text-center mt-1">Step {step}</div>
          </div>
        ))}
      </div>
    );
  };

  // Render the appropriate form component based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <NewSimulationFormStep01
            className="max-w-3xl mx-auto"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <NewSimulationFormStep02
            className="max-w-3xl mx-auto"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 3:
        return (
          <NewSimulationFormStep03
            className="max-w-3xl mx-auto"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 4:
        return (
          <NewSimulationFormStep04
            className="max-w-3xl mx-auto"
            formData={formData}
            onSubmit={handleSubmit}
            onPrevious={goToPreviousStep}
          />
        );
      default:
        return (
          <NewSimulationFormStep01
            className="max-w-3xl mx-auto"
            formData={formData}
            updateFormData={updateFormData}
            onNext={goToNextStep}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* Keep all the existing sidebar code */}
        <SidebarHeader>
          {/* ... existing sidebar header code ... */}
        </SidebarHeader>
        <SidebarContent>
          {/* ... existing sidebar content code ... */}
        </SidebarContent>
        <SidebarFooter>
          {/* ... existing sidebar footer code ... */}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          {/* ... existing header code ... */}
        </header>
        <div className="flex flex-col items-center h-full py-8">
          {renderProgressIndicator()}
          {renderCurrentStep()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### Step 2: Create a Server Component Wrapper

Replace the current `src/app/new-simulation/page.tsx` with a server component that checks authentication:

```tsx
import { redirect } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";
import NewSimulationClient from "./new-simulation-client";

export default async function NewSimulationPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <NewSimulationClient />;
}
```

## Key Changes

1. **Authentication Check**: Moved from client-side to server-side
2. **Component Structure**: Split into server and client components
3. **Removed Client-Side Auth Check**: Eliminated the useEffect that checked authentication

## Benefits of This Approach

1. **Minimal Changes**: We're preserving most of the existing code
2. **Proven Pattern**: Using the same authentication pattern as the `/private` route
3. **Secure**: Authentication is checked server-side before any client code is sent to the browser
4. **No Flash of Content**: Users won't see the page content before being redirected
5. **Low Risk**: The changes are isolated and straightforward

## Testing

After implementation, test by:

1. Logging in and verifying access to the `/new-simulation` route
2. Logging out and verifying redirect to login when trying to access `/new-simulation`
3. Ensuring all functionality in the simulation form still works correctly

## Implementation Notes

- The client component should be a direct copy of the current page.tsx file with the authentication useEffect removed
- The server component should be minimal, focusing only on authentication and rendering the client component
- No changes to the middleware are needed as the server component will handle authentication
