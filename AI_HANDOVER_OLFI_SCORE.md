# AI Handover: OLFi Score Feature (Landing Page)

## Context & Current State
We are building **OLFi**, the UAE's first AI-driven debt consolidation platform. 
So far, we have built the initial marketing landing page (`v1-glassmorphism-fintech` inside `web` directory) which includes:
- A responsive, glassmorphism-styled Tailwind UI.
- Full internationalization (English and Arabic natively supported via `next-intl`).
- A fully integrated Supabase Waitlist functionality that collects `email` and `full_name`.
- An Admin panel (`admin` folder) connected to the same Supabase database.

## Your Goal: The "OLFi Score" Segment
The founders are introducing the **OLFi Score**, an alternative soft credit score reporting mechanism. To do this, OLFi analyzes data from multiple non-traditional reporting lines like Buy Now Pay Later (BNPL) platforms, utility bills, and credit cards.

**Important Note:** OLFi will also offer the official **AECB (Al Etihad Credit Bureau) credit score** as a paid integration, so the distinction between the free OLFi soft score and the paid AECB score should be clear in the product, but the immediate landing page focus is the OLFi Score.

### Landing Page Requirements for You

1. **New "OLFi Score" Feature Section**
   - We are adding the **OLFi Score** as a main highlight under the "Features" grid area (or seamlessly integrated as a standalone showcase feature). 
   - **Research & Animations:** Before building, please do some research and figure out the *absolute best* way to showcase this section. We want a premium feel, so implement high-quality animations and motion elements (e.g., Framer Motion or advanced Tailwind transitions).
   - **Logos needed:** You must display logos (or styled text labels if logos are missing) of alternative credit sources we analyze. Mention specifically: **Tabby**, **Tamara**, **DEWA** (Dubai Electricity and Water Authority), and generic tags for "Credit Cards" & "Banks".
   - State clearly that we partner/integrate with these platforms to calculate this soft score.

2. **The Phone Mockup (Visualizing the Feature)**
   - As the visual element for this exact feature point, design an empty/blank iPhone mockup (a sleek mobile frame) that sits alongside the feature text. 
   - Leave the screen of this iPhone completely empty for now. The team will provide a real screenshot of the application later to place inside it.

## Instructions to get started:
1. Review the existing `page.tsx` and i18n JSON files (`messages/en.json`, `messages/ar.json`).
2. Add the necessary Arabic & English translations for the new OLFi Score section and the new feature bullet.
3. Build the UI components (the logo cloud, the content, and the empty iPhone mockup).
4. Run locally to verify responsiveness and i18n switching.
