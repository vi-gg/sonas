"use client";

import * as React from "react";
import { buttonClasses } from "@/lib/theme-utils";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

/**
 * ThemedButton component that follows the Sonas visual identity
 * This component extends the base Button component with theme-specific styling
 */
export interface ThemedButtonProps extends ButtonProps {
  /**
   * The visual style of the button
   * - primary: Blue background with white text (default)
   * - black: Black background with white text
   * - white: White outline with white text, changes to white background with black text on hover
   */
  themeVariant?: "primary" | "black" | "white";
}

const ThemedButton = React.forwardRef<HTMLButtonElement, ThemedButtonProps>(
  (
    { className, themeVariant = "primary", variant, children, ...props },
    ref
  ) => {
    // Map theme variants to shadcn/ui button variants
    const variantMap = {
      primary: "default",
      black: "black",
      white: "white",
    };

    // Use the mapped variant or the explicitly provided one
    const buttonVariant = variant || variantMap[themeVariant];

    return (
      <Button
        ref={ref}
        variant={buttonVariant as any}
        rounded="none"
        className={cn(className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
ThemedButton.displayName = "ThemedButton";

/**
 * ThemedButtonLink component that follows the Sonas visual identity
 * This is a link styled as a button
 */
export interface ThemedButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  themeVariant?: "primary" | "black" | "white";
  asChild?: boolean;
}

const ThemedButtonLink = React.forwardRef<
  HTMLAnchorElement,
  ThemedButtonLinkProps
>(({ className, themeVariant = "primary", children, href, ...props }, ref) => {
  // Map theme variants to classes
  const variantClasses = {
    primary: buttonClasses("primary"),
    black: buttonClasses("black"),
    white: buttonClasses("white"),
  };

  return (
    <a
      ref={ref}
      href={href}
      className={cn(variantClasses[themeVariant], className)}
      {...props}
    >
      {children}
    </a>
  );
});
ThemedButtonLink.displayName = "ThemedButtonLink";

export { ThemedButton, ThemedButtonLink };
