# Sonas Theme System

This document provides an overview of the Sonas theme system and how to use it to maintain a consistent visual identity across the application.

## Overview

The Sonas theme system is designed to create a seamless visual experience between the landing page and the application. It uses shadcn/ui components with custom styling to match the landing page's visual identity.

## Key Files

- `src/app/globals.css`: Contains CSS variables for colors, typography, and other design tokens
- `src/lib/theme.ts`: Defines theme configuration (colors, typography, spacing, etc.)
- `src/lib/theme-utils.ts`: Provides utility functions for applying theme styles
- `docs/theme-guidelines.md`: Detailed guidelines for maintaining visual consistency
- `src/components/ui/themed-button.tsx`: Example of a themed component

## Quick Start

### 1. Use CSS Variables

The theme is implemented using CSS variables in `globals.css`. These variables are used by shadcn/ui components and can be referenced in custom components:

```css
.custom-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
}
```

### 2. Use Theme Utility Functions

The `theme-utils.ts` file provides utility functions for applying theme styles:

```tsx
import { heading, buttonClasses } from "@/lib/theme-utils";

// Apply heading styles
<h1 className={heading("h1")}>Page Title</h1>

// Apply button styles
<a href="#" className={buttonClasses("primary")}>
  Click Me
</a>
```

### 3. Use Themed Components

The theme system includes themed components that follow the Sonas visual identity:

```tsx
import { ThemedButton, ThemedButtonLink } from "@/components/ui/themed-button";

// Use themed button
<ThemedButton themeVariant="primary">
  Primary Action
</ThemedButton>

// Use themed button link
<ThemedButtonLink href="/dashboard" themeVariant="black">
  Go to Dashboard
</ThemedButtonLink>
```

### 4. Use shadcn/ui Components with Theme Props

The shadcn/ui components have been extended with theme-specific props:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Button with no border radius
<Button variant="default" rounded="none">
  Click Me
</Button>

// Card with medium border radius
<Card rounded="md">
  Card content
</Card>

// Input with no border radius
<Input rounded="none" placeholder="Enter text" />
```

## Theme Demo

Visit the theme demo page to see the theme system in action:

```
/theme-demo
```

This page demonstrates how to use the theme system to create a consistent visual identity across the application.

## Color Palette

The Sonas color palette is based on the landing page's visual identity:

- **Primary Blue** (`#0055FF`): Used for primary actions, navigation, and key UI elements
- **Black** (`#000000`): Used for secondary actions, text, progress indicators, and contrasting elements
- **White** (`#FFFFFF`): Used for text on dark backgrounds and UI elements

> **Important Note**: For progress indicators, loading animations, and similar UI elements, use black/blackish colors instead of blue to maintain visual consistency.

- **Light Blue** (`#E8F1FC`): Used for section backgrounds and cards
- **Lighter Blue** (`#f5f9fe`): Used for subtle backgrounds and hover states
- **Deep Blue** (`#0f0099`): Used for footer and special sections

## Border Radius

The Sonas design system uses square corners (border-radius: 0) by default for all UI elements to match the landing page's aesthetic. This applies to:

- Buttons
- Cards
- Input fields
- Dialogs
- Progress indicators

## Typography

The Sonas typography system uses the Geist font for both headings and body text:

- **Headings**: Use `tracking-tighter` and `leading-tight` with `font-semibold` or `font-bold`
- **Body Text**: Use `text-sm` or `text-base` with `leading-normal`
- **Navigation & Buttons**: Use `uppercase` with `tracking-wide` and `font-medium`

## Best Practices

1. **Use CSS Variables**: Always use CSS variables for colors, typography, and other design tokens
2. **Use Utility Functions**: Use the utility functions in `theme-utils.ts` for consistent styling
3. **Follow Guidelines**: Refer to `docs/theme-guidelines.md` for detailed guidelines
4. **Test Across Themes**: Ensure your components look good in both light and dark modes
5. **Maintain Accessibility**: Ensure all color combinations meet WCAG AA standards

## Contributing

When creating new components or modifying existing ones, refer to the theme guidelines to maintain consistency with the landing page's visual identity.

For more detailed information, see the [Theme Guidelines](docs/theme-guidelines.md).
