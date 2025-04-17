"use client";

import { login } from "./actions";
import { Section3 } from "@/components/section-3";
import { useState } from "react";
import { useFormStatus } from "react-dom";

// Create a client component for the submit button
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 py-2 w-full transition-colors mt-2"
    >
      {pending ? "Logging in..." : "Continue"}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle form submission and error handling
  async function handleSubmit(formData: FormData) {
    setErrorMessage(null);

    try {
      const result = await login(formData);

      // If login returns an error, display it
      if (result && result.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    }
  }

  return (
    <>
      <div className="w-screen h-screen flex">
        <div className="w-full h-full p-4">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/images/login2.png')" }}
          />
        </div>
        <div className="w-full h-full flex items-center gap-0 justify-center">
          <form
            className="border border-gray-300 p-8 w-[26rem] shadow-none"
            action={handleSubmit}
          >
            {/* SONAS Logo */}
            <div className="flex justify-center mb-8">
              <div
                className="border border-gray-200 flex items-center justify-center"
                style={{
                  aspectRatio: "1 / 1",
                  width: "120px",
                  height: "120px",
                  padding: "0.75rem",
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="logo-dot w-4 h-4 bg-black rounded-full"></div>
                  <div className="logo text-2xl text-black tracking-tight uppercase font-medium">
                    SONAS
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 text-center mb-8">
              <h1 className="text-2xl font-bold tracking-tight">
                Login to your account
              </h1>
              {errorMessage && (
                <div className="mt-2 text-red-600 text-sm">{errorMessage}</div>
              )}
            </div>

            <div className="grid gap-6">
              <div className="grid gap-2">
                <label
                  htmlFor="email"
                  className="font-medium text-sm text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="flex h-11 w-full border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:border-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="font-medium text-sm text-gray-700"
                  >
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="******"
                  className="flex h-11 w-full border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:border-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                />
              </div>
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
