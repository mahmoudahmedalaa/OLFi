# OLFi - AI Agent Handover Document

## Project State Summary 
The objective of the previous session was to massively expand the OLFi application's documentation to a "production-grade" standard. This has been completed. 
The repository now possesses an exhaustive, 9-pillar knowledge base inside `/docs`, which has also been fully synchronized into the **OLFi HQ Notion workspace**.

## Core Architecture & Stack
*   **Framework:** React Native (Expo Bare Workflow)
*   **Backend & DB:** Supabase (PostgreSQL, GoTrue Auth, Edge Functions)
*   **State Management:** Hybrid (Zustand for client UI state, Supabase for server state)
*   **Styling:** NativeWind (Tailwind CSS) & gluestack-ui.

## The Immediate Next Priority: "Tenure Adjustment Slider"

The primary development goal for the incoming AI agent is to implement the **Tenure Adjustment Slider**.

### What is the Tenure Slider?
It is a core interactive UI component used by the user when they are viewing a `bank_product` (Consolidation Offer). The slider allows the user to dynamically increase or decrease the term length of the proposed loan (e.g., sliding between 12, 24, 36, and 48 months). 

### Where does it go?
*   **UI Location:** It belongs on the **Offer Details Screen** (or the final Apply Screen). When the user selects a specific bank offer to review, this slider should be prominently displayed below the new calculated EMI.
*   **Interactive Behavior:** As the user drags the slider, the "Projected Monthly EMI" and "Total Savings" numbers on the screen must recalculate and update in **real-time**.

### Technical Implementation Details
1.  **State Management:** The current selected tenure must be managed globally via **Zustand** (store it as `selectedTenure` or similar inside the debt/offer slice). This ensures that if the user backs out and clicks a different offer, their preferred tenure is remembered.
2.  **Native Module Constraints:** The component relies on the `@react-native-community/slider` library. Because this is a native module, it requires Expo's bare workflow. The `ios` folder has been prebuilt to accommodate this, but if the module is newly added, the incoming agent must run `npx expo prebuild --clean` and `pod install` in the iOS folder.
3.  **Algorithmic Engine:** Changing the slider means the app must re-calculate the EMI based on the specific bank's interest rate and the new `targetTenureMonths`. Refer to `/docs/calculations/consolidation-engine-logic.md` and `/docs/calculations/mathematical-edge-cases.md` (no-float rule, basis points) to ensure the math is pixel-perfect before rendering.

## Incoming Agent Directives
1. Read the provided `/docs` to understand the architectural and UI constraints (specifically `component-architecture.md` and `state-management.md`).
2. Build the `TenureSlider` UI component following the dark-mode aesthetic.
3. Hook the slider up to the Zustand store and the Real-time EMI calculation logic.
4. Test thoroughly inside the iOS simulator to ensure performance and avoid UI thread blockages during rapid sliding.
