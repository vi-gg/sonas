"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ViewSimulationClientProps {
  user: User;
}

export default function ViewSimulationClient({
  user,
}: ViewSimulationClientProps) {
  const router = useRouter();

  // Dummy simulation data
  const simulations = [
    {
      id: 1,
      name: "Product Market Fit Analysis",
      date: "2025-04-10",
      responses: 50,
      status: "Completed",
    },
    {
      id: 2,
      name: "User Experience Survey",
      date: "2025-04-05",
      responses: 100,
      status: "Completed",
    },
    {
      id: 3,
      name: "Feature Prioritization",
      date: "2025-03-28",
      responses: 75,
      status: "Completed",
    },
    {
      id: 4,
      name: "Brand Perception Study",
      date: "2025-03-15",
      responses: 200,
      status: "Completed",
    },
  ];

  return (
    <AppSidebar
      activePage="view-simulation"
      pageTitle="View Simulations"
      userName={user.user_metadata?.name || "User"}
      userEmail={user.email || ""}
      userInitials={user.email?.substring(0, 2).toUpperCase() || "U"}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Simulations</h1>
        <Button onClick={() => router.push("/new-simulation")}>
          Create New Simulation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations.map((simulation) => (
          <Card
            key={simulation.id}
            className="shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle>{simulation.name}</CardTitle>
              <CardDescription>Created on {simulation.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Responses:</span>
                  <span className="font-medium">{simulation.responses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="font-medium text-green-600">
                    {simulation.status}
                  </span>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button variant="outline" size="sm">
                Export Data
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </AppSidebar>
  );
}
