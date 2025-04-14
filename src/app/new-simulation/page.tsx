"use client";

import { useState } from "react";
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

export default function NewSimulationPage() {
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
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <GalleryVerticalEnd className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Acme Inc</span>
                      <span className="truncate text-xs">Enterprise</span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  sideOffset={4}
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Teams
                  </DropdownMenuLabel>
                  <DropdownMenuItem key="Acme Inc" className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <GalleryVerticalEnd className="size-4 shrink-0" />
                    </div>
                    Acme Inc
                    <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem key="Acme Corp." className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <AudioWaveform className="size-4 shrink-0" />
                    </div>
                    Acme Corp.
                    <DropdownMenuShortcut>⌘2</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem key="Evil Corp." className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <Command className="size-4 shrink-0" />
                    </div>
                    Evil Corp.
                    <DropdownMenuShortcut>⌘3</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add team
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Frame />
                    <span>New Simulation</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <Ellipsis />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-48 rounded-lg"
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <PieChart />
                    <span>View Simulations</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <Ellipsis />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-48 rounded-lg"
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Map />
                    <span>Support</span>
                  </a>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <Ellipsis />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-48 rounded-lg"
                  >
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Ellipsis className="text-sidebar-foreground/70" />
                  <span>Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        alt="monkeydluffy"
                        src="/images/avatar.jpeg"
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Monkey D. Luffy
                      </span>
                      <span className="truncate text-xs">
                        monkeydluffy@pirateking.com
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={4}
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          alt="monkeydluffy"
                          src="/images/avatar.jpeg"
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          Monkey D. Luffy
                        </span>
                        <span className="truncate text-xs">
                          monkeydluffy@pirateking.com
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-foreground" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Sonas</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>New Simulation</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col items-center h-full py-8">
          {renderProgressIndicator()}
          {renderCurrentStep()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
