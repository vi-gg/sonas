"use client";

import { User } from "@supabase/supabase-js";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SupportClientProps {
  user: User;
}

export default function SupportClient({ user }: SupportClientProps) {
  // Updated FAQ data with the required changes
  const faqs = [
    {
      question: "How do I create a new simulation?",
      answer:
        "Navigate to the 'New Simulation' page from the sidebar and follow the step-by-step process to set up your simulation parameters.",
    },
    {
      question: "What is the maximum number of responses I can get?",
      answer:
        "We recommend to keep it under 20 responses per simulation for optimal results.",
    },
    {
      question: "How long does it take to get simulation results?",
      answer: "Most simulations can be done under 5 minutes.",
    },
    {
      question: "Can I export my simulation data?",
      answer:
        "Yes, you can export your data in CSV, JSON, or Excel formats from the simulation details page.",
    },
  ];

  return (
    <AppSidebar
      activePage="support"
      pageTitle="Support"
      userName={user.user_metadata?.name || "User"}
      userEmail={user.email || ""}
      userInitials={user.email?.substring(0, 2).toUpperCase() || "U"}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium mb-6 text-slate-800">
          Help Center
        </h1>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-slate-800">
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-slate-500">
              Find answers to common questions about using our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-slate-700">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                  {index < faqs.length - 1 && (
                    <Separator className="my-4 bg-slate-100" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-800">Contact Support</CardTitle>
            <CardDescription className="text-slate-500">
              Our support team is available to help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-md text-slate-700">
              <p className="text-sm">
                Support is currently unavailable through the ticketing system.
                Please check our FAQ for common questions.
              </p>
            </div>
            <form className="space-y-4 mt-4">
              <div className="space-y-2">
                <textarea
                  disabled
                  className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                  placeholder="Support message system currently unavailable..."
                />
              </div>
              <button
                disabled
                className="w-full py-2 px-4 rounded-md bg-slate-100 text-slate-500 border border-slate-200 disabled:opacity-70"
              >
                Submit
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppSidebar>
  );
}
