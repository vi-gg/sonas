"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SupportClient() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the message to your backend
    console.log("Support message submitted:", message);
    setSubmitted(true);
    setMessage("");
  };

  // Dummy FAQ data
  const faqs = [
    {
      question: "How do I create a new simulation?",
      answer:
        "Navigate to the 'New Simulation' page from the sidebar and follow the step-by-step process to set up your simulation parameters.",
    },
    {
      question: "What is the maximum number of responses I can get?",
      answer:
        "The free tier allows up to 100 responses per simulation. Upgrade to Pro for unlimited responses.",
    },
    {
      question: "How long does it take to get simulation results?",
      answer:
        "Most simulations complete within 24 hours, depending on the complexity and number of responses requested.",
    },
    {
      question: "Can I export my simulation data?",
      answer:
        "Yes, you can export your data in CSV, JSON, or Excel formats from the simulation details page.",
    },
  ];

  return (
    <AppSidebar activePage="support" pageTitle="Support">
      <h1 className="text-2xl font-bold mb-6">Support Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium text-lg">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                    {index < faqs.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Need more help? Send us a message
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="bg-green-50 p-4 rounded-md text-green-800">
                  <p className="font-medium">Message sent!</p>
                  <p className="text-sm mt-1">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Describe your issue or question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <p className="text-sm text-gray-500">You can also reach us at:</p>
              <p className="text-sm font-medium">support@sonas.ai</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppSidebar>
  );
}
