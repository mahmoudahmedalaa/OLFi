# OLFi - Brand Identity & Visual Reference

**Version:** V1.0  
**Date:** April 2026

---

## 01 Brand Colors
The signature palette. Brutalist-minimalist fintech aesthetic emphasizing trust and clarity.

- **Base Dark:** `#011819` (Primary background, app chrome, headers.)
- **Base Beige:** `#E1DED1` (Primary text (dark mode), light-mode backgrounds.)
- **Brand Emerald:** `#10B981` (Primary CTA, success states, score indicators.)
- **Brand Teal:** `#4FD1C5` (Secondary accent, the clover icon, charts.)

---

## 02 Application Themes
OLFi is a dark-first product. Every surface must feel intentional and premium.

### Dark Theme (Default)
- Card Surface: `#0A2525`
- Elevated Card: `#133030`
- Interactive Input: `#1B3B3B`

### Light Theme
- Card Surface: `#EDE9DD`
- Elevated Card: `#D5D0C4`
- Interactive Input: `#C8C3B7`

---

## 03 Typography
Clean, readable typography emphasizing clarity.

### Latin (Primary) - Inter
- **Headline (Bold 700):** Used for primary page titles.
- **Subheadline (Semi 600):** Used for section breaks.
- **Body copy (Regular 400):** Provides a comfortable reading experience for longer educational content regarding refinancing and Sharia compliance.
- **Label / Badge (Bold 600):** Uppercase tracking-wider.

### Arabic - Cairo
- **العنوان الرئيسي (غامق):** Headline
- **العنوان الفرعي (شبه غامق):** Subheadline
- **النص الأساسي للفقرات الطويلة:** Body text
- **تسمية / شارة:** Label / Badge

---

## 04 Gradients & UI Elements
Subtle depths and interactions.

- **BRAND GRADIENT:** `linear-gradient(to right, #011819, #0A2525)`
- **CARD GRADIENT:** `linear-gradient(to bottom, #0A2525, #011819)`
- **ELEVATED CARD:** `linear-gradient(to bottom, #133030, #0A2525)`

---

## 05 Logo Architecture
Our visual mark featuring the four-leaf clover motif.

**Primary App Icon:**
The clover replaces the dot of the "i", symbolizing growth, fortune, and prosperity. Always rendered on the Base Dark background.

---

## 06 Design Principles & Voice
The standards that govern every interface decision and every word we publish.

### Core Principles
1. **Clarity over Cleverness:** Every screen, label, and data point must communicate its meaning at a glance. Decorative complexity is never a substitute for functional transparency.
2. **Earned Trust:** Trust is not asserted through marketing language. It is earned through accurate data, honest comparisons, and a UI that never obscures costs or terms.
3. **Restraint as a Feature:** We do not animate for the sake of animating. We do not add color for the sake of vibrancy. Every design decision must serve the user's next action.

### Visual Rules
- ❌ **DON'T: No glow or blur effects.** Avoid box-shadow glow, backdrop blur on cards, and animate-ping indicators. All surfaces stay flat and intentional.
- ✅ **DO: Use opacity for transitions.** State changes (hover, press, disabled) are communicated through opacity shifts or subtle background color steps, never movement.
- ❌ **DON'T: No float or bounce animations.** Interactive elements must not lift, scale up, or float on hover. Motion is reserved for meaningful navigation transitions.
- ✅ **DO: Maintain contrast strictly.** Dark text never appears on dark surfaces. Light text never appears on light surfaces. WCAG AA compliance is the minimum bar.
- ❌ **DON'T: No unsanctioned colors.** Introduce new colors only via design token updates. Ad-hoc hex values in components are not permitted.

### Terminology & Copy
- ✅ **DO: Use accurate financial terms.** Use "Interest Rate" for existing traditional debt. Use "Profit Rate" only when referring to the new Sharia-compliant refinancing offer. Write "Financing Amount" not "Loan Amount".
- ✅ **DO: Prefer plain financial language.** Write "Total Profit Paid" not "Financing Cost". Write "Monthly Instalment" not "EMI" unless a tooltip is present to define the abbreviation.
- ❌ **DON'T: No em-dashes.** The em-dash (—) is not part of OLFi's typographic voice. Use a period, a colon, or restructure the sentence.
- ❌ **DON'T: No filler phrases.** Eliminate AI-inflected phrases such as "Absolutely!", "Great question!", "Certainly!", or "It's worth noting that". Every sentence must carry weight.
- ❌ **DON'T: No vague reassurances.** Do not write "We take your privacy seriously" or "We're here to help" without actionable context. Say what you will do, not how you feel about it.

### Tone of Voice — Examples

**Example 1**
- ❌ **Avoid:** "We're excited to help you on your financial journey! Applying is quick and easy — it only takes a few minutes to get started."
- ✅ **Preferred:** "See your refinancing options in under two minutes. No impact to your credit score."

**Example 2**
- ❌ **Avoid:** "Your OLFi Score is a comprehensive measure of your overall financial wellness and creditworthiness across multiple dimensions."
- ✅ **Preferred:** "Your OLFi Score reflects your debt load, payment history, and refinancing potential. Higher is better."
