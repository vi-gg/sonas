"use client";

import React from "react";
import { ThemedButton, ThemedButtonLink } from "@/components/ui/themed-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { heading, sectionClasses } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";

export default function ThemeDemoPage() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Similar to landing page */}
      <section
        className={cn(
          sectionClasses("primary"),
          "min-h-[60vh] flex flex-col justify-center"
        )}
      >
        <div className="container mx-auto px-4 md:px-8">
          <h1 className={heading("h1", "max-w-4xl mb-6")}>Theme System Demo</h1>
          <p className="text-sm md:text-base max-w-md mb-8">
            This page demonstrates how to use the Sonas theme system to create a
            consistent visual identity across the application.
          </p>
          <div className="flex flex-wrap gap-4">
            <ThemedButton themeVariant="black">Primary Action</ThemedButton>
            <ThemedButtonLink href="#buttons" themeVariant="white">
              Learn More
            </ThemedButtonLink>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section id="buttons" className={sectionClasses("light")}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className={heading("h2", "mb-8")}>Buttons</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className={heading("h3", "mb-2")}>Primary</h3>
              <ThemedButton themeVariant="primary">Primary Button</ThemedButton>
              <ThemedButtonLink href="#" themeVariant="primary">
                Primary Link
              </ThemedButtonLink>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className={heading("h3", "mb-2")}>Black</h3>
              <ThemedButton themeVariant="black">Black Button</ThemedButton>
              <ThemedButtonLink href="#" themeVariant="black">
                Black Link
              </ThemedButtonLink>
            </div>

            <div className="flex flex-col gap-4 bg-black p-4">
              <h3 className={heading("h3", "mb-2 text-white")}>White</h3>
              <ThemedButton themeVariant="white">White Button</ThemedButton>
              <ThemedButtonLink href="#" themeVariant="white">
                White Link
              </ThemedButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section id="cards" className={sectionClasses("lighter")}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className={heading("h2", "mb-8")}>Cards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card rounded="none">
              <CardHeader>
                <CardTitle>No Border Radius</CardTitle>
                <CardDescription>
                  This card has no border radius
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This matches the rectangular aesthetic of the landing page
                  buttons.
                </p>
              </CardContent>
              <CardFooter>
                <ThemedButton themeVariant="primary" className="w-full">
                  Action
                </ThemedButton>
              </CardFooter>
            </Card>

            <Card rounded="md">
              <CardHeader>
                <CardTitle>Medium Border Radius</CardTitle>
                <CardDescription>
                  This card has medium border radius
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>For UI elements that need a softer appearance.</p>
              </CardContent>
              <CardFooter>
                <ThemedButton themeVariant="black" className="w-full">
                  Action
                </ThemedButton>
              </CardFooter>
            </Card>

            <Card rounded="lg">
              <CardHeader>
                <CardTitle>Large Border Radius</CardTitle>
                <CardDescription>
                  This card has large border radius
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>For UI elements that need a more rounded appearance.</p>
              </CardContent>
              <CardFooter>
                <ThemedButton themeVariant="primary" className="w-full">
                  Action
                </ThemedButton>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section id="forms" className={sectionClasses("light")}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className={heading("h2", "mb-8")}>Forms</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>
                  Input fields with different styles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default">
                    Default Input (No Border Radius)
                  </Label>
                  <Input id="default" placeholder="Enter text here" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rounded">Rounded Input</Label>
                  <Input
                    id="rounded"
                    placeholder="Enter text here"
                    rounded="md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Input</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <ThemedButton themeVariant="primary" className="w-full">
                  Submit
                </ThemedButton>
              </CardFooter>
            </Card>

            <div className="flex flex-col gap-4">
              <h3 className={heading("h3", "mb-2")}>Dialog</h3>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <ThemedButton themeVariant="primary">
                    Open Dialog
                  </ThemedButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      This dialog follows the Sonas visual identity with
                      rectangular styling.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>
                      Dialog content goes here. Notice the typography and
                      spacing are consistent with the rest of the application.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ThemedButton
                      themeVariant="black"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </ThemedButton>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Typography Section */}
      <section id="typography" className={sectionClasses("lighter")}>
        <div className="container mx-auto px-4 md:px-8">
          <h2 className={heading("h2", "mb-8")}>Typography</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h1 className={heading("h1")}>Heading 1</h1>
                <p className="text-sm text-muted-foreground">
                  tracking-tighter leading-tight font-semibold
                </p>
              </div>

              <div>
                <h2 className={heading("h2")}>Heading 2</h2>
                <p className="text-sm text-muted-foreground">
                  tracking-tighter leading-tight font-semibold
                </p>
              </div>

              <div>
                <h3 className={heading("h3")}>Heading 3</h3>
                <p className="text-sm text-muted-foreground">
                  tracking-tighter leading-tight font-semibold
                </p>
              </div>

              <div>
                <h4 className={heading("h4")}>Heading 4</h4>
                <p className="text-sm text-muted-foreground">
                  tracking-tighter leading-tight font-semibold
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-base">
                  This is regular body text. The Sonas theme uses Geist font for
                  both headings and body text, ensuring a consistent look and
                  feel across the application.
                </p>
              </div>

              <div>
                <p className="text-sm">
                  This is small body text, used for less important information
                  or UI elements.
                </p>
              </div>

              <div>
                <p className="uppercase tracking-wide text-sm">
                  This is uppercase text with wider tracking, used for
                  navigation and buttons.
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">
                  This is muted text, used for secondary information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={sectionClasses("black")}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
              <h2 className={heading("h2", "mb-4")}>
                Ready to implement the theme?
              </h2>
              <p className="text-gray-300 mb-6">
                Use the theme system to create a consistent visual identity
                across your application. Follow the guidelines in the
                documentation to ensure a seamless experience for your users.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <ThemedButtonLink
                href="/docs/theme-guidelines.md"
                themeVariant="primary"
              >
                View Guidelines
              </ThemedButtonLink>
              <ThemedButtonLink href="/" themeVariant="white">
                Back to Home
              </ThemedButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
