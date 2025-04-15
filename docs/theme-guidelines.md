# Sonas Theme Guidelines

This document provides guidelines for maintaining a consistent visual identity across the Sonas application, ensuring a seamless transition between the landing page and the application interface.

## Color Palette

The Sonas color palette is based on the landing page's visual identity:

### Primary Colors

- **Primary Blue** (`#0055FF`): Used for primary actions, navigation, and key UI elements
- **Black** (`#000000`): Used for secondary actions, text, progress indicators, loading animations, and contrasting elements
- **White** (`#FFFFFF`): Used for text on dark backgrounds and UI elements

> **Important Note**: For progress indicators, loading animations, and similar UI elements, use black/blackish colors instead of blue to maintain visual consistency with the application's aesthetic.

### Background Colors

- **Light Blue** (`#E8F1FC`): Used for section backgrounds and cards
- **Lighter Blue** (`#f5f9fe`): Used for subtle backgrounds and hover states
- **Deep Blue** (`#0f0099`): Used for footer and special sections

## Typography

### Headings

- Font: Geist
- Tracking: `tracking-tighter`
- Leading: `leading-tight`
- Weight: `font-semibold` or `font-bold`

### Body Text

- Font: Geist
- Size: `text-sm` or `text-base`
- Leading: `leading-normal`

### Navigation & Buttons

- Text case: `uppercase`
- Tracking: `tracking-wide`
- Weight: `font-medium`

## Components

### Buttons

Buttons follow these guidelines:

- No border radius (rectangular shape with border-radius: 0)
- Uppercase text
- Consistent padding
- Hover effects with scale and opacity changes

**Primary Button:**

```jsx
<Button variant="default">Primary Action</Button>
```

**Black Button:**

```jsx
<Button variant="black">Secondary Action</Button>
```

**White Outline Button:**

```jsx
<Button variant="white">Tertiary Action</Button>
```

### Cards

Cards follow these guidelines:

- Subtle border
- Consistent padding
- Optional border radius (configurable)

```jsx
<Card rounded="lg">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

### Forms

Form elements follow these guidelines:

- Rectangular inputs (no border radius by default)
- Consistent padding
- Clear focus states

```jsx
<Input placeholder="Enter text" />
```

### Dialog

Dialogs follow these guidelines:

- Rectangular shape (no border radius by default)
- Consistent padding
- Clear header and footer separation

```jsx
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
  </DialogContent>
</Dialog>
```

## CSS Variables

The theme is implemented using CSS variables in `globals.css`. These variables are used by shadcn/ui components and can be referenced in custom components:

```css
/* Example of using CSS variables */
.custom-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
}
```

## Dark Mode

The application supports both light and dark modes, with the same color scheme maintained across both modes to ensure a consistent brand identity.

## Accessibility

All color combinations should meet WCAG AA standards for contrast. The primary blue (#0055FF) has been tested against white text to ensure readability.

## Implementation

The theme is implemented using:

1. CSS variables in `globals.css`
2. A theme configuration in `src/lib/theme.ts`
3. Component-specific styles in each shadcn/ui component

When creating new components or modifying existing ones, refer to this guide to maintain consistency with the landing page's visual identity.
