# OLFi Design System & Brand Rules

This document sets in stone the rules for all future UI, UX, and copy development in the OLFi project. 

**Mandatory Reading:** 
Before making any design changes, you must review the canonical design document: `docs/design/OLFi_Brand_Identity.html`.

## 1. Visual Rules
- **No glow or blur effects.** Avoid `box-shadow` glows, `backdrop-blur` on cards, and `animate-ping` indicators. All surfaces stay flat, intentional, and brutalist.
- **Use opacity for transitions.** State changes (hover, press, disabled) are communicated through opacity shifts or subtle background color steps, never movement.
- **No float or bounce animations.** Interactive elements must not lift, scale up, or float on hover. Motion is reserved for meaningful navigation transitions.
- **Maintain contrast strictly.** Dark text never appears on dark surfaces. Light text never appears on light surfaces. WCAG AA compliance is the minimum bar.
- **No unsanctioned colors.** Introduce new colors only via design token updates in `app/lib/constants.ts` or `web/src/app/globals.css`. Ad-hoc hex values in components are not permitted.
- **Brand Teal:** The definitive brand teal is `#4FD1C5`. Do not use legacy versions (e.g., `#14B8A6`).

## 2. Terminology & Copy Rules
- **Use Sharia-compliant terms.** Write "Profit Rate" not "Interest Rate". Write "Financing Amount" not "Loan Amount". Write "Total Profit Paid" not "Financing Cost".
- **Prefer plain financial language.** Write "Monthly Instalment" not "EMI" unless a tooltip is present to define the abbreviation.
- **No em-dashes.** The em-dash (—) is not part of OLFi's typographic voice. Use a period, a colon, or restructure the sentence.
- **No filler phrases.** Eliminate AI-inflected phrases such as "Absolutely!", "Great question!", "Certainly!", or "It's worth noting that". Every sentence must carry weight.
- **No vague reassurances.** Do not write "We take your privacy seriously" or "We're here to help" without actionable context. Say what you will do, not how you feel about it.

## 3. Implementation Guidelines
- **Tokens:** Always use Tailwind classes or the tokens from `app/lib/constants.ts`.
- **Fonts:** The project uses `Inter` (Latin) and `Cairo` (Arabic). Do not fallback to generic `sans` or `roboto` unless explicitly needed.
- **Consistency:** New components must match the aesthetic of existing marketing and mobile components. Check `OLFi_Brand_Identity.html` to confirm alignment.
