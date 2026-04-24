# 🔒 CONTENT LOCK — DO NOT MODIFY

This document declares the **canonical, final copy** for the OLFi marketing site.
All content in `messages/en.json` and `messages/ar.json` has been carefully written and refined by the founder.

## Rules for AI Agents

1. **NEVER change, rewrite, rephrase, or "improve" any text content** in the translation JSON files
2. **NEVER add periods/full stops** to statements that don't have them
3. **NEVER add em-dashes** — the founder has explicitly banned them
4. **NEVER substitute words** (e.g. don't change "Lower your" to "Outsmart your", don't change "Refinance smarter" to anything else)
5. When migrating between formats (TS → JSON, JSON → YAML, etc.), copy content **character-for-character**
6. If a structural change is needed (e.g. flattening keys), do it without touching the string values
7. When in doubt, run `git diff` to verify zero content drift

## Canonical Content (English) — DO NOT ALTER

### Hero
- Line 1: **"Lower your"**
- Line 2: **"loan payments"**
- Line 3: **"Refinance smarter"** (italic, teal)
- Badge 1: "Early Access · UAE"
- Badge 2: "Sharia Compliant ✦"
- Subheadline: "OLFi aggregates Islamic finance loan offers from across the UAE into a one-stop shop. We soft score you with an OLFi score and use a bias-free AI engine to construct the perfect refinancing recommendation, giving you transparency and financial freedom."
- CTA: "Join the waitlist →"

### Features
- Headline: **"Complete Transparency"**
- Step 1: "Aggregate Your Liabilities" / "Manually add your loans or sync your UAE bank accounts securely..."
- Step 2: "Bias-Free AI Recommendations" / "Our intelligence engine scans multiple UAE banks..."
- Step 3: "Accept and Save" / "Choose the best option to quickly consolidate your obligations..."
- Step 4: "Track Your Pipeline" / "Once you accept the best offer, watch your application progress..."

### Problem Section
- Label: "The Current State"
- Headline: **"The debt trap in the UAE"**

## Canonical Source Files

- **English**: `messages/en.json`
- **Arabic**: `messages/ar.json`

## Content Verification

To verify no content drift, compare against the restored originals from git commit `068c3f3`:
```bash
git show 068c3f3:web/src/components/Hero.tsx
git show 068c3f3:web/src/components/FeaturesAccordion.tsx
git show 068c3f3:web/src/components/ProblemSection.tsx
```

## Writing Style (Never Violate)

- No full stops on headlines/statements (periods only on full descriptive sentences)
- No em-dashes (—) anywhere
- Punchy, direct, premium fintech tone
- UAE-market specific terminology (AECB, AED, DBR)
