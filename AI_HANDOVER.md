# Session Handover: Renalta-Style UI Polish

**To the next AI Agent:** The user is currently refining the "BuyOut" marketing site to strictly match the "Renalta" aesthetic (renalta.com). The site uses Next.js 15, Tailwind v4, and Framer Motion. 

The previous agent ran out of context and reached the end of the session. **Follow these instructions exactly** to complete the final frontend UI polish.

## User's Explicit Comments / Pending Tasks

1.  **Comparison Table Horizontal Lines**: 
    > *"The horizontal lines on the compare section are all messed up, they are too big and far apart and distracting, you need to reference what I showed you from renata, its small gaps consistent and not too many anyways. The current one is weird so its clashing with the comparison table itself which is wrong."*
    *   **Action Needed:** Go to `ComparisonTable.tsx` and fix the background styling. Look at renalta.com's grid/line background. It needs to be much finer, tighter grid/lines that are extremely subtle and don't clash with the table content.

2.  **Real Stories Section Background**:
    > *"Can you make the real stories section background light"*
    *   **Action Needed:** Go to the Testimonials or "Real Stories" component and change its background color to the light variant (presumably `bg-[#e9e6d9]` or similar beige), instead of dark. Remember to invert text colors (dark text on light bg) if necessary!

3.  **Footer Background**:
    > *"Then the footer slightly darker than what it is now, similar to what renata does."*
    *   **Action Needed:** Go to `Footer.tsx`. It's currently in `bg-base-dark` (`#011819`). You need to make it even darker, perhaps pure black (`#000000`) or an extremely deep teal/black.

4.  **Hero Border Beam Animation (Dropped/Optional)**:
    > *"I dont thnk you are getting the beam right, this is it here you can spot it in this screenshot of renata. This is how it should look like, use animation and motion to get it spinning around the square like that. If its too hard then drop it and forget about it."*
    *   **Action Needed:** The previous agent removed the broken attempt. If you are confident you can do a CSS border-image with a spinning conic-gradient (or SVG path animation) that looks EXACTLY like the screenshot provided in the user's chat, go for it. Otherwise, **leave it dropped**.

## Context / What's Been Done

*   **Vercel Deployment:** Fixed git email blocker (using `mahmoudahmedalaa@users.noreply.github.com`).
*   **Text Brightness:** Brightened most text across Hero, ShariaBanner, SavingsCalculator, WaitlistCTA from very dim (40/50%) to brighter (60/80%).
*   **Glow Effects:** Eliminated basically all `blur`, `backdrop-blur`, and `shadow-2xl` glow effects (particularly in IslamicFinanceQA) to adhere to the flat, brutalist "no glow" Renalta style.
*   **Phone Features UI:** The phone background side of `FeaturesAccordion.tsx` was restored to its light color (`#e9e6d9`) as requested in the final prompt.

**Next Steps**: Acknowledge this handover, read the relevant files (`ComparisonTable.tsx`, `Footer.tsx`, and the Testimonials component), and execute those specific remaining changes.
