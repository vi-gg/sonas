# Styling Plan: Matching Application with Landing Page Visual Identity

## Overview

This document outlines the plan for styling the entire application using shadcn/ui components to match the landing page's visual identity. The goal is to create a seamless visual experience between the landing page and the application while making minimal breaking changes.

## Current Visual Identity Analysis

From the landing page (`src/app/page.tsx`), we've identified these key visual elements:

### Colors

- **Primary Blue**: `#0055FF` - Used for the main header, buttons, and accent elements
- **Black**: `#000000` - Used for buttons, text, and contrasting elements
- **White**: `#FFFFFF` - Used for text on dark backgrounds and UI elements
- **Light Blue Backgrounds**: `#E8F1FC`, `#f5f9fe` - Used for section backgrounds
- **Deep Blue**: `#0f0099` - Used for the footer

### Typography

- Headings use `tracking-tighter` and `leading-tight`
- Navigation and buttons use uppercase text
- Font: Geist (as seen in layout.tsx)

### UI Elements

- Buttons have clean, rectangular shapes (no border-radius)
- Dot indicators are small rounded elements
- Consistent padding and spacing patterns
- Hover animations with opacity and scale changes

## Implementation Plan

### 1. Update CSS Variables in globals.css

We'll update the CSS variables to match the landing page's color scheme, ensuring both light and dark modes use the same colors:

```css
@layer base {
  :root {
    /* Convert #0055FF to HSL: 217 100% 50% */
    --primary: 217 100% 50%;
    --primary-foreground: 0 0% 100%;

    /* Light blue background */
    --secondary: 214 80% 95%;
    --secondary-foreground: 217 100% 50%;

    /* Other variables */
    --background: 0 0% 100%;
    --foreground: 0 0% 0%;

    /* etc. */
  }

  .dark {
    /* Use the same colors in dark mode */
    --primary: 217 100% 50%;
    --primary-foreground: 0 0% 100%;

    /* etc. */
  }
}
```

### 2. Update Button Component Styling

The button component needs to match the landing page's button style:

- Rectangular shape (no border-radius)
- Uppercase text
- Hover animations
- Consistent padding

### 3. Update Card and Dialog Components

- Match border-radius with landing page elements
- Consistent padding and spacing
- Proper shadow effects

### 4. Update Form Elements

- Input fields
- Select dropdowns
- Checkboxes and radio buttons

### 5. Update Navigation Elements

- Sidebar styling
- Active state indicators
- Hover effects

### 6. Ensure Typography Consistency

- Update font sizes
- Update line heights
- Update letter spacing
- Ensure uppercase text where appropriate

## Testing Plan

1. Test all pages with the new styling
2. Verify both light and dark modes
3. Check responsive behavior
4. Ensure accessibility standards are met

## Implementation Steps

1. Update globals.css
2. Update component styles
3. Test across all application pages
4. Make adjustments as needed
