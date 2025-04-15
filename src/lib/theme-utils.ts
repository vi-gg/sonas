import { theme } from "./theme";
import { cn } from "./utils";

/**
 * Utility functions for applying theme styles consistently across the application
 */

/**
 * Apply heading styles based on the theme
 * @param size - The size of the heading (h1, h2, h3, h4, h5, h6)
 * @param className - Additional classes to apply
 * @returns A string of Tailwind classes
 */
export function heading(
  size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
  className?: string
) {
  const baseClasses = `${theme.typography.heading.tracking} ${theme.typography.heading.leading} font-semibold`;

  const sizeClasses = {
    h1: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    h2: "text-3xl sm:text-4xl md:text-5xl",
    h3: "text-2xl sm:text-3xl",
    h4: "text-xl sm:text-2xl",
    h5: "text-lg sm:text-xl",
    h6: "text-base sm:text-lg",
  };

  return cn(baseClasses, sizeClasses[size], className);
}

/**
 * Apply button styles based on the theme
 * @param variant - The button variant (primary, black, white)
 * @param className - Additional classes to apply
 * @returns A string of Tailwind classes
 */
export function buttonClasses(
  variant: "primary" | "black" | "white",
  className?: string
) {
  const baseClasses =
    "py-2 px-8 uppercase text-sm transition-all hover:scale-105";

  const variantClasses = {
    primary: `bg-[${theme.colors.primary.DEFAULT}] text-white hover:bg-[${theme.colors.primary.hover}]`,
    black: `bg-black text-white hover:bg-[${theme.colors.black.hover}]`,
    white: "border border-white text-white hover:bg-white hover:text-black",
  };

  return cn(baseClasses, variantClasses[variant], className);
}

/**
 * Apply card styles based on the theme
 * @param rounded - The border radius to apply
 * @param className - Additional classes to apply
 * @returns A string of Tailwind classes
 */
export function cardClasses(
  rounded: keyof typeof theme.borderRadius = "lg",
  className?: string
) {
  const baseClasses =
    "border bg-card text-card-foreground shadow-sm transition-all";
  const roundedClass = `rounded-${rounded}`;

  return cn(baseClasses, roundedClass, className);
}

/**
 * Apply input styles based on the theme
 * @param rounded - The border radius to apply
 * @param className - Additional classes to apply
 * @returns A string of Tailwind classes
 */
export function inputClasses(
  rounded: keyof typeof theme.borderRadius = "none",
  className?: string
) {
  const baseClasses =
    "flex h-10 w-full border border-input bg-background px-3 py-2 text-sm transition-colors";
  const roundedClass = `rounded-${rounded}`;

  return cn(
    baseClasses,
    roundedClass,
    "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary",
    "focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
    className
  );
}

/**
 * Apply navigation link styles based on the theme
 * @param active - Whether the link is active
 * @param className - Additional classes to apply
 * @returns A string of Tailwind classes
 */
export function navLinkClasses(active: boolean = false, className?: string) {
  const baseClasses =
    "uppercase text-sm hover:opacity-80 hover:underline transition-all";
  const activeClass = active ? "font-medium" : "";

  return cn(baseClasses, activeClass, className);
}

/**
 * Apply section styles based on the theme
 * @param variant - The section variant (primary, light, lighter, dark)
 * @param className - Additional classes to apply
 * @returns A string of Tailwind classes
 */
export function sectionClasses(
  variant: "primary" | "light" | "lighter" | "dark" | "black",
  className?: string
) {
  const baseClasses = "w-full py-12 md:py-16";

  const variantClasses = {
    primary: `bg-[${theme.colors.primary.DEFAULT}] text-white`,
    light: `bg-[${theme.colors.background.light}]`,
    lighter: `bg-[${theme.colors.background.lighter}]`,
    dark: `bg-[${theme.colors.deepBlue.DEFAULT}] text-white`,
    black: "bg-black text-white",
  };

  return cn(baseClasses, variantClasses[variant], className);
}

export default {
  heading,
  buttonClasses,
  cardClasses,
  inputClasses,
  navLinkClasses,
  sectionClasses,
};
