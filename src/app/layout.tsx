import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

const fontSans = localFont({
  variable: "--font-sans",
  src: "./geist.ttf",
  display: "swap",
});

const fontHeading = localFont({
  variable: "--font-heading",
  src: "./geist.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sonas",
  description: "Explore simulations and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
