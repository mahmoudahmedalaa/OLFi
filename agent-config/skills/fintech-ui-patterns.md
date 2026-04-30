---
description: 'FinTech UI Patterns & Best Practices'
---
# FinTech UI Patterns & Best Practices

This document serves as the design knowledge hub for building modern, trustworthy, and aesthetically premium financial interfaces for the BuyOut project.

## Core Principles

1.  **Trust Through Simplicity:** 
    *   Minimize cognitive load. Financial forms are stressful; break them down into single-action screens.
    *   Large, legible typography (Inter).
    *   Use familiar visual cues for security (lock icons, verification badges) without cluttering the UI.
2.  **Premium Aesthetics:**
    *   Avoid generic colors. Stick strictly to the defined hex codes in `figma-brand-assets.md` (`#1A1D21`, `#2A2D32`, `#3B82F6`, `#10B981`).
    *   Use depth purposefully. Utilize `.ultraThinMaterial` on iOS for floating elements (tab bars, bottom sheets) to create spatial hierarchy.
    *   Ensure perfect alignment and consistent padding (e.g., standard `p-4` or `p-6`).
3.  **Dynamic Data Visualization:**
    *   Numbers alone aren't enough. Use skeleton loaders that match data shapes instead of basic spinners during loading states.
    *   Use animated charts or progress rings for concepts like "Savings Generated" or "Debt Progress."
4.  **Sharia-Compliant Trust Markers:**
    *   Prominently but elegantly display "Sharia Compliant" or "Fatwa Approved" badges on product offer screens to reassure users.
    *   Avoid visual metaphors related to aggressive speculation, high-risk trading, or conventional debt (e.g., avoid heavy red 'debt' imagery, prefer transition and growth metaphors). Ethos is stability and ethical finance.

## Structural Templates

### 1. The "Single Action" Form
Used for collecting sensitive data (e.g., salary, EID).
*   **Layout:** Full screen, heavy top padding.
*   **Header:** Large, conversational Title Case statement (e.g., "What is your monthly salary?").
*   **Input:** Massive font size, centered or left-aligned with a currency prefix if applicable.
*   **Action:** A sticky, full-width primary CTA at the bottom, above the keyboard.

### 2. The Financial Dashboard
Used for the home screen or summary views.
*   **Hero Section:** A prominent 'Total Balance' or 'Total Savings' number, often accompanied by a subtle background gradient or chart.
*   **Quick Actions:** a horizontal pill-shaped or grid layout for frequent actions (e.g., "Withdraw", "Transfer").
*   **Recent Activity:** A list view using standard list items. Keep timestamps secondary (`#9CA3AF`).

### 3. Loading & State Transitions
*   **Avoid:** Generic text like "Loading..." or endless circular spinners taking up the whole screen.
*   **Prefer:** Contextual phrasing specific to BuyOut (e.g., "Analyzing top consolidation offers...") and skeleton screens that fade in and out.
