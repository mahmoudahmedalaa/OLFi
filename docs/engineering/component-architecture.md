# OLFi Component Architecture & UI Guidelines

OLFi maintains a strict, highly reusable component architecture to ensure consistency, speed up development, and provide a premium "Apple-like" feel across the application. We leverage **gluestack-ui v2** combined with **NativeWind v4** (Tailwind CSS) for our design system.

## Core Principles

1.  **Dumb vs. Smart Components:** UI primitives (`Button`, `Card`, `InputField`) should be purely presentational ("dumb"). They receive data via props and emit events via callbacks (`onPress`, `onChange`). Screen-level components (`profile.tsx`, `apply-offer.tsx`) are "smart"—they connect to the global Zustand store, execute Supabase queries, and orchestrate the UI.
2.  **Tailwind Utility-First:** We prefer styling via NativeWind utility classes (e.g., `className="flex-1 items-center justify-center p-4 bg-background-light"`) over custom `StyleSheet.create`.
3.  **Absolute Theme Consistency:** Never hardcode colors (e.g., `#FF0000`). Always use semantic design tokens defined in `tailwind.config.js` (e.g., `text-error`, `bg-brand-primary`).

---

## The Component Inventory

Our core components are located in `app/components/ui`. If a UI element is used on more than one screen, it belongs here.

### 1. Structure & Layout

*   **`Box`, `HStack`, `VStack`:** The foundational building blocks for layout. Use `VStack` for vertical stacking and `HStack` for horizontal rows. They accept Tailwind classes seamlessly.

### 2. Typography

*   **`Text` & `Heading`:** Standardized text rendering. Use `Heading` for page titles and major segment headers. Use `Text` for body content.
    *   *Prop Guidelines:* Use `size` props (e.g., `size="xl"`) to maintain consistent hierarchy. Combine with Font-Weight classes (e.g., `font-bold`).

### 3. Interactive Elements

*   **`Button`:** The primary call-to-action component.
    *   *Variants:* `solid` (primary actions), `outline` (secondary actions), `link` (tertiary/text-only actions).
    *   *States:* Always implement visual feedback for `isPressed`, `isDisabled`, and `isLoading`.
*   **`Input` (TextField):** Used for all text entry (email, numbers, passwords).
    *   *Features:* Supports left/right slots (for icons), secure text entry (passwords), and floating labels.
    *   *Validation:* Should visually indicate `isInvalid` state (red borders, error text below).

### 4. Specialized OLFi Components

While gluestack provides the primitives, we compose them into complex, domain-specific components:

*   **`SavingsWidget` (Example):** A card that displays the user's projected saving.
    *   *Props:* `totalSavings` (number), `monthlySavings` (number), `currency` (string, default "AED").
    *   *Styling:* Requires a glassmorphism effect (if available) or a solid subtle background (`bg-background-muted`) with a soft shadow.
*   **`OfferCard`:** Displays a standardized bank offer (Interest rate, EMI, Tenure).
    *   *Interactivity:* Must support an `onSelect` callback. Should highlight when it is the `selected` offer.

---

## Anatomy of a OLFi Component

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 1. Precise Prop Interface exported for consumers
export interface CustomButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

// 2. Functional Component with clear default props
export const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
}) => {
  // 3. Dynamic Tailwind classes based on variant state
  const baseClasses = "flex flex-row items-center justify-center rounded-xl py-4 px-6";
  const variantClasses = variant === 'primary' ? "bg-brand-blue" : "bg-transparent border border-brand-blue";
  const textClasses = variant === 'primary' ? "text-white font-bold" : "text-brand-blue font-bold";

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses} ${isLoading ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={isLoading}
    >
      <Text className={textClasses}>
        {isLoading ? 'Processing...' : label}
      </Text>
    </TouchableOpacity>
  );
};
```

## Styling Rules & Tailwind Strategy

*   **Dark Mode First:** We default to dark mode styles or ensure absolute parity. We use the Gluestack theming engine combined with specific Tailwind color tokens.
*   **Spacing System:** Rely exclusively on the 4pt grid system (e.g., `p-2` = 8px, `p-4` = 16px, `p-6` = 24px).
*   **Border Radii:** Use rounded corners aggressively for a friendly, modern feel. `rounded-xl` (12px) or `rounded-2xl` (16px) are standard for cards and buttons.
