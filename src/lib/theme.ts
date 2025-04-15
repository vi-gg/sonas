/**
 * Theme configuration for the Sonas application
 * This file defines the colors, typography, and other design tokens
 * based on the landing page's visual identity.
 */

// Primary colors from landing page
export const colors = {
  // Primary blue: #0055FF
  primary: {
    DEFAULT: "#0055FF",
    foreground: "#FFFFFF",
    hover: "#0044CC",
  },

  // Black: #000000
  black: {
    DEFAULT: "#000000",
    foreground: "#FFFFFF",
    hover: "#333333",
  },

  // Light blue backgrounds
  background: {
    light: "#E8F1FC",
    lighter: "#f5f9fe",
  },

  // Deep blue (footer): #0f0099
  deepBlue: {
    DEFAULT: "#0f0099",
    foreground: "#FFFFFF",
  },
};

// Typography styles from landing page
export const typography = {
  // Headings
  heading: {
    fontFamily: "var(--font-heading)",
    tracking: "tracking-tighter",
    leading: "leading-tight",
  },

  // Body text
  body: {
    fontFamily: "var(--font-sans)",
    tracking: "tracking-normal",
    leading: "leading-normal",
  },

  // Navigation and buttons
  nav: {
    fontFamily: "var(--font-sans)",
    tracking: "tracking-wide",
    case: "uppercase",
  },
};

// Border radius values
export const borderRadius = {
  none: "0",
  sm: "0.125rem",
  md: "0.25rem",
  lg: "0.5rem",
  xl: "1rem",
  full: "9999px",
};

// Animation values
export const animations = {
  hover: {
    scale: "hover:scale-105",
    opacity: "hover:opacity-80",
  },
  transition: {
    DEFAULT: "transition-all duration-200",
    fast: "transition-all duration-100",
    slow: "transition-all duration-300",
  },
};

// Spacing values
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "4rem",
};

// Export the theme object
export const theme = {
  colors,
  typography,
  borderRadius,
  animations,
  spacing,
};

export default theme;
