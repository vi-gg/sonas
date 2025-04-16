"use client";

import { signup } from "./actions";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [retypePassword, setRetypePassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & {
      password: { value: string };
    };
    const password = target.password.value;
    if (password !== retypePassword) {
      e.preventDefault();
      setPasswordMatch(false);
    }
  };

  const handleRetypePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRetypePassword(e.target.value);
    const form = e.target.form as HTMLFormElement;
    const password = form?.password as HTMLInputElement;
    if (password && password.value === e.target.value) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex">
        <div className="w-full h-full p-4">
          <div className="w-full h-full bg-gray-200" />
        </div>
        <div className="w-full h-full flex items-center gap-0 justify-center">
          <form
            className="border border-gray-300 p-8 w-[26rem] shadow-none"
            action={signup}
            onSubmit={handleSubmit}
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
                Create your account
              </h1>
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
                <div className="flex items-center">
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <label
                    htmlFor="retypePassword"
                    className="font-medium text-sm text-gray-700"
                  >
                    Retype Password
                  </label>
                </div>
                <input
                  id="retypePassword"
                  type="password"
                  required
                  placeholder="******"
                  onChange={handleRetypePasswordChange}
                  className={`flex h-11 w-full border ${!passwordMatch && retypePassword ? "border-red-500" : "border-gray-300"} bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary focus-visible:border-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors`}
                />
                {!passwordMatch && retypePassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 py-2 w-full transition-colors mt-2"
              >
                Sign up
              </button>
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Login here
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
