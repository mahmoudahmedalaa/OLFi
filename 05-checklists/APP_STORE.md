# App Store Submission Checklist

> Complete step-by-step guide for submitting to iOS App Store and Google Play. Covers asset creation, IAP/subscription setup, legal requirements, and the exact submission process.

## Pre-Submission: Asset Creation

### App Icon
| Spec | Requirement |
|:-----|:------------|
| **Size** | 1024×1024px |
| **Format** | PNG (no alpha/transparency) |
| **Corners** | Square — Apple rounds them automatically |
| **Content** | No text, recognizable at 29px, no photos |

**AI can help**: Generate icon concepts using image generation tools, then export at correct size.

### Screenshots (iOS)

Must provide screenshots for **at least** these device sizes:

| Device | Resolution | Required |
|:-------|:-----------|:---------|
| iPhone 6.7" (15 Pro Max) | 1290 × 2796px | ✅ Yes |
| iPhone 6.5" (11 Pro Max) | 1242 × 2688px | ✅ Yes |
| iPhone 5.5" (8 Plus) | 1242 × 2208px | Optional |
| iPad Pro 12.9" (6th gen) | 2048 × 2732px | If universal |

**Rules**:
- Minimum 3, maximum 10 per device size
- Show real app content (no placeholders)
- Can add marketing text overlays
- First screenshot = most important (shown in search)

**AI can help**: Take screenshots from simulator, add marketing overlays programmatically.

### Screenshots (Android)

| Spec | Requirement |
|:-----|:------------|
| Phone | Min 2 screenshots, 16:9 or 9:16 ratio |
| Tablet | Min 1 screenshot (if targeting tablets) |
| Feature Graphic | 1024×500px (required) |

---

## Submission Process: iOS (Step by Step)

### Step 1: Build
```bash
# Production build via local Xcode (recommended)
./build-ios.sh

# OR via EAS Cloud
eas build --profile production --platform ios
```
Wait for build to complete (~15-30 min). Download the `.ipa` if needed.

### Step 2: App Store Connect Setup
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - Platform: iOS
   - Name: [App Name] (30 chars max)
   - Primary Language
   - Bundle ID: must match `app.json` exactly
   - SKU: any unique string (e.g., `myapp-ios-v1`)

### Step 3: App Information
- [ ] **Category**: Choose primary + secondary (e.g., Education, Lifestyle)
- [ ] **Content Rights**: Declare if using third-party content
- [ ] **Age Rating**: Complete the questionnaire honestly

### Step 4: Pricing & Agreements
- [ ] Set price tier (Free or paid)
- [ ] **CRITICAL**: If offering paid features (subscriptions/IAP), you MUST sign the **Paid Applications Agreement** in Agreements, Tax, and Banking. This requires:
  - Bank account info
  - Tax forms (W-8BEN for non-US)
  - Contact info
  - This can take 1-3 days to process!

---

## ⚠️ CRITICAL: In-App Purchase / Subscription Setup

> **This section is MANDATORY if your app has any paid features.** Apple will **reject** your app if IAPs are referenced in-app but not created and submitted in App Store Connect.

### Step 5A: Create Subscription Group

> ⚠️ **IMPORTANT**: Auto-renewable subscriptions are NOT under "In-App Purchases" in the sidebar — they are under **"Subscriptions"** (a separate item under MONETIZATION in the left sidebar).

1. Go to **App Store Connect → Your App** → left sidebar → **MONETIZATION → Subscriptions**
2. Click **"+"** to create a **Subscription Group**
3. Name it (e.g., `Pro Group` or `Pro Access`)
4. Click **Create**

### Step 5B: Create Individual Subscriptions

Inside the subscription group, click **"+"** to create each subscription:

| Field | Monthly Example | Annual Example |
|:------|:----------------|:---------------|
| **Reference Name** | Pro Monthly | Pro Annual |
| **Product ID** | `yourapp_monthly` | `yourapp_annual` |
| **Duration** | 1 Month | 1 Year |
| **Price** | $4.99 | $35.99 |

For each subscription, fill in these sections:

1. **Subscription Prices**: Click **"+"** → select base country → set price → Apple auto-fills other countries
2. **Localization**: Click **"+"** → add at least one language with:
   - **Display Name**: e.g., "YourApp Pro Monthly"
   - **Description**: e.g., "Unlock all premium features"
3. **Image (Optional)**: 1024×1024 promotional image
4. **Review Information** (scroll to bottom):
   - **Screenshot**: Upload a screenshot of your paywall/purchase screen
   - **Review Notes**: e.g., "This subscription unlocks unlimited recordings, notes, folders, insights, and streak tracking"

### Step 5C: ⚠️ Create Subscription GROUP Localization (EASY TO MISS!)

> This is the step most people miss! Without it, subscriptions stay in **"Missing Metadata"** even if individual products are fully configured.

1. Go back to the **Subscription Group** page (click the group name at the top)
2. Scroll to the **"Localization"** section at the bottom
3. Click **"Create"**
4. Fill in:
   - **Language**: English (U.S.)
   - **Subscription Group Display Name**: e.g., "YourApp Pro"
   - **App Name**: Your app name (shown when users manage subscriptions in Settings)
5. Click **Save**

After this, both subscriptions should show status: **"Ready to Submit"** ✅

### Step 5D: Verify Product IDs Match Your Code

Product IDs in App Store Connect **MUST** exactly match your code:
```
RevenueCat Dashboard → Products → Product Identifier
  ↕ Must match ↕
App Store Connect → Subscriptions → Product ID
```

If using RevenueCat, also verify:
- Product IDs are added to RevenueCat's Products section
- Products are attached to an Offering
- Entitlement identifier matches code (e.g., `pro_access`)

---

## ⚠️ CRITICAL: Legal Metadata (Terms of Use / EULA & Privacy Policy)

> **Apple will reject apps with auto-renewable subscriptions that don't include Terms of Use links in BOTH the app AND App Store Connect metadata.**

### Step 6A: In-App Requirements (Code)

Your paywall/subscription screen MUST display:
- [ ] **Title** of subscription (e.g., "Pro Monthly", "Pro Annual")
- [ ] **Length** of subscription (e.g., "1 month", "1 year")
- [ ] **Price** of subscription
- [ ] **Auto-renewal disclosure** ("Subscription automatically renews unless cancelled at least 24 hours before the end of the current period")
- [ ] **Management instructions** ("Manage in Settings → Apple ID → Subscriptions")
- [ ] Functional **Privacy Policy** link
- [ ] Functional **Terms of Use** link
- [ ] **Restore Purchases** button

### Step 6B: App Store Connect Metadata Requirements

In App Store Connect, you MUST configure:

1. **Privacy Policy URL** (App Store Connect → App Information → Privacy Policy URL)
   - Must be a live, publicly accessible URL
   - Example: `https://yourdomain.github.io/yourapp/legal/privacy.html`

2. **Terms of Use / EULA** — Do BOTH of the following:
   - **Custom EULA**: Go to **App Store Connect → General → App Information** → scroll to **"License Agreement"** → click **Edit** → switch from "Standard" to **"Custom"** → paste your Terms of Use URL or full text
     - Path: `App Store Connect → Your App → General → App Information → License Agreement → Edit`
   - **In Description**: Also add Terms of Use link at the **bottom of your App Description** as backup:
     ```
     Terms of Use: https://yourdomain.github.io/yourapp/legal/terms.html
     Privacy Policy: https://yourdomain.github.io/yourapp/legal/privacy.html
     ```

3. **App Description** must mention subscription details at the bottom:
   ```
   SUBSCRIPTION INFORMATION:
   • QuranNotes Pro is available as a monthly ($X.XX/month) or annual ($XX.XX/year) subscription
   • Payment will be charged to your Apple ID account
   • Subscription automatically renews unless cancelled at least 24 hours before the end of the current period
   • Manage subscriptions in Settings → Apple ID → Subscriptions
   
   Privacy Policy: [URL]
   Terms of Use: [URL]
   ```

### Step 6C: Host Legal Pages

Before submission, verify your legal pages are:
- [ ] **Publicly accessible** (no auth required)
- [ ] **HTTPS** (not HTTP)
- [ ] **Not returning 404** — test in incognito browser
- [ ] Hosted on a reliable service (GitHub Pages, Vercel, or your own domain)

Recommended hosting: GitHub Pages at `https://yourusername.github.io/yourapp/legal/`

Required files:
- `privacy.html` — Privacy Policy
- `terms.html` — Terms of Use / EULA

---

### Step 7: Prepare App Version

- [ ] **Description**: 4000 char max. Include subscription info at bottom (see Step 6B)
- [ ] **Keywords**: 100 char max, comma-separated. No spaces after commas.
- [ ] **What's New**: Brief changelog
- [ ] **Support URL**: Must be a live, accessible URL
- [ ] **Privacy Policy URL**: Must be a live, accessible URL (also set in App Information)
- [ ] Upload screenshots for each required device size
- [ ] Upload app icon (1024×1024)

### Step 8: App Privacy
1. Go to **App Privacy** section
2. For each data type you collect, declare:
   - What data (name, email, usage data, etc.)
   - Purpose (app functionality, analytics, etc.)
   - Whether linked to identity
   - Whether used for tracking

### Step 9: Upload Build
```bash
# Via Xcode Organizer
Xcode → Window → Organizer → Select archive → Distribute App → App Store Connect → Upload

# OR via command line
eas submit --platform ios

# OR via Transporter app
```

### Step 10: Attach IAP Products to Submission

> **THIS IS THE STEP MOST PEOPLE MISS!** Your IAP products are NOT automatically included.

1. Go to **App Store Connect → Your App → App Store → Your Version**
2. Scroll down to the **"In-App Purchases and Subscriptions"** section
3. Click **"+"** to select which IAP products to include
4. **Check ALL products** that your app references
5. Each attached IAP must show status: **"Ready to Submit"**

### Step 11: Review Notes
- [ ] If login required: provide demo credentials
- [ ] Explain any non-obvious features
- [ ] Provide contact phone number + email
- [ ] Note features requiring special hardware (camera, microphone)
- [ ] Note that the app includes auto-renewable subscriptions and where to find them

### Step 12: Submit for Review
Click **Submit for Review**. Typical review: 24-48 hours.

---

## Submission Process: Android (Step by Step)

### Step 1: Build
```bash
eas build --profile production --platform android
```

### Step 2: Google Play Console
1. Go to [play.google.com/console](https://play.google.com/console)
2. **Create app** → fill basic info
3. Complete the **Dashboard setup checklist** (all items must be green)

### Step 3: Store Listing
- [ ] Title (50 chars), short description (80 chars), full description (4000 chars)
- [ ] Upload app icon (512×512), feature graphic (1024×500)
- [ ] Upload phone screenshots (min 2) + tablet (if applicable)

### Step 4: Content & Privacy
- [ ] Complete privacy policy
- [ ] Complete content rating (IARC)
- [ ] Data safety section
- [ ] Ads declaration
- [ ] Target audience

### Step 5: Release
- [ ] Upload `.aab` file
- [ ] Select release track (Internal → Closed → Open → Production)
- [ ] Submit for review (typically 1-7 days for first submission)

---

## Common Rejection Reasons & Fixes

| Reason | What Went Wrong | Fix |
|:-------|:----------------|:----|
| **IAP not submitted** | App references "Pro" but IAP products aren't created or attached to the submission | Create IAP products in App Store Connect AND attach them to the version before submitting (Step 5A + Step 10) |
| **Missing EULA/Terms** | Apps with subscriptions must have Terms of Use in App Store metadata | Add EULA URL in App Information OR add Terms URL to app description (Step 6B) |
| **Missing subscription info** | Subscription details not shown in-app or in description | Add renewal terms, pricing, and management instructions to paywall AND app description |
| **Missing Delete Account** | Apple requires account deletion since 2022 | Build delete account in Settings BEFORE submission |
| **Invalid characters** | `™`, `©`, curly quotes, em dashes in metadata | Paste all text to plain text editor first, then re-paste |
| **Metadata refused** | Special characters in `promotionalText` or `description` fields crash the API | Use only basic ASCII in metadata |
| **Placeholder content** | Lorem ipsum, test data, "TODO" in the app | Search codebase for all placeholder strings |
| **Broken privacy policy** | URL returns 404 or is behind auth | Host on a public URL, test in incognito |
| **No demo account** | App requires login but no credentials provided | Create a persistent demo account, include in review notes |
| **Crash on launch** | Works in dev but not production build | Test clean install from production build on real device |
| **Paid Apps Agreement** | Not signed → app won't go live even after approval | Sign agreement + banking FIRST — takes days to process |
| **Bundle ID mismatch** | `app.json` says one ID, App Store Connect says another | Verify they match EXACTLY before building |
| **Screenshots wrong size** | Uploaded wrong resolution | Use exact pixel dimensions listed above |

---

## Pre-Submit Final Checklist

Before clicking "Submit for Review", verify ALL of the following:

### Code & Build
- [ ] `npx tsc --noEmit` passes
- [ ] No `console.log` without `__DEV__` guards
- [ ] Debug tools stripped
- [ ] Production environment variables set
- [ ] Build number incremented
- [ ] Tested on real device from production/archive build

### App Store Connect — App Information
- [ ] Privacy Policy URL is set and accessible
- [ ] EULA/Terms of Use URL is set (App Information → EULA field OR in description)
- [ ] Category selected
- [ ] Age rating completed
- [ ] App Privacy section completed

### App Store Connect — IAP/Subscriptions (if applicable)
- [ ] All IAP products CREATED in App Store Connect
- [ ] Each product has: screenshot, description, review notes, localization
- [ ] Each product status: "Ready to Submit"
- [ ] Product IDs match RevenueCat/code exactly
- [ ] Products ATTACHED to the app version (Step 10)
- [ ] Paid applications agreement signed

### App Store Connect — Version
- [ ] Description includes subscription info at bottom
- [ ] Screenshots uploaded for all required sizes
- [ ] Build uploaded and selected
- [ ] Review notes provided (demo credentials if needed)

### Legal Pages (live URLs)
- [ ] Privacy Policy accessible via HTTPS
- [ ] Terms of Use accessible via HTTPS
- [ ] Both linked correctly from within the app (paywall screen)
- [ ] Both configured in App Store Connect metadata

---

## Post-Submission Timeline

| Stage | Duration | What Happens |
|:------|:---------|:-------------|
| **Upload** | Minutes | Build appears in App Store Connect |
| **Processing** | 10-30 min | Apple processes the binary |
| **In Review** | 24-48 hrs | Human reviewer tests the app |
| **Approved** → Live | Immediate or scheduled | You choose release date |
| **Rejected** | Variable | Fix issues → resubmit (back to review queue) |
