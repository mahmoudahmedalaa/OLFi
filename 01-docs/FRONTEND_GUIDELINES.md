# Frontend Guidelines & Design System — BuyOut

> The #1 debt restructuring fintech. Every pixel should communicate trust, clarity, and empowerment.

## 1. Design Principles

| Principle | What It Means | Anti-Pattern |
|:----------|:-------------|:-------------|
| **Trust First** | Every screen must feel like a bank, not a startup. Security cues everywhere | Playful illustrations, gaming-like UI |
| **Clarity Over Cleverness** | Financial data must be instantly scannable. No ambiguity | Dense tables, jargon-heavy labels |
| **Reduce Anxiety** | Refinancing is stressful. Calm colors, progress indicators, clear outcomes | Red warnings, aggressive CTAs |
| **Premium & Modern** | Users trust premium-looking apps with their money | Generic Material defaults, plain white screens |
| **Library-First** | Use battle-tested libraries. Zero custom code where a package exists | Building custom charts, animations, form validation |

---

## 2. Color System — Psychology-Driven

> Blue → Trust & Stability (56% of users associate blue with reliability in finance)
> Green → Growth & Positive Outcomes (73% feel more secure when green = money)
> Dark Mode → Premium perception + reduced eye strain for financial dashboards

### Primary Palette

| Token | Light Mode | Dark Mode | Usage |
|:------|:-----------|:----------|:------|
| `primary.50` | `#EFF6FF` | `#1E3A5F` | Subtle backgrounds |
| `primary.100` | `#DBEAFE` | `#1E40AF` | Card backgrounds |
| `primary.500` | `#3B82F6` | `#60A5FA` | Primary buttons, links |
| `primary.700` | `#1D4ED8` | `#93BBFD` | Headers, emphasis |
| `primary.900` | `#1E3A5F` | `#EFF6FF` | Text on light backgrounds |

### Success / Growth (Green)

| Token | Light | Dark | Usage |
|:------|:------|:-----|:------|
| `success.400` | `#34D399` | `#6EE7B7` | Savings amount, positive change |
| `success.500` | `#10B981` | `#34D399` | "You save AED X" indicators |
| `success.700` | `#047857` | `#A7F3D0` | Success CTAs |

### Semantic Colors

| Token | Value | Usage |
|:------|:------|:------|
| `warning` | `#F59E0B` | Caution states (high DBR, risky) |
| `error` | `#EF4444` | Validation errors, rejected offers |
| `neutral.50` | `#F8FAFC` | Page backgrounds |
| `neutral.100` | `#F1F5F9` | Card backgrounds |
| `neutral.400` | `#94A3B8` | Placeholder text |
| `neutral.700` | `#334155` | Body text |
| `neutral.900` | `#0F172A` | Headings |

### Dark Mode Strategy
- **Default to dark mode** for fintech dashboard sections (feels premium, like Bloomberg/Robinhood)
- **Light mode** for onboarding, KYC forms, document reading
- Use NativeWind `dark:` variant classes with `useColorScheme()` for theme switching

---

## 3. Typography

| Use | Font | Weight | Size | Line Height |
|:----|:-----|:-------|:-----|:------------|
| **Display** | Inter/SF Pro | 700 (Bold) | 32px | 1.2 |
| **H1** | Inter/SF Pro | 700 | 24px | 1.3 |
| **H2** | Inter/SF Pro | 600 (SemiBold) | 20px | 1.3 |
| **H3** | Inter/SF Pro | 600 | 17px | 1.4 |
| **Body** | Inter/SF Pro | 400 (Regular) | 15px | 1.5 |
| **Caption** | Inter/SF Pro | 400 | 13px | 1.4 |
| **Money (large)** | SF Mono / JetBrains Mono | 700 | 28px | 1.1 |
| **Money (inline)** | SF Mono / JetBrains Mono | 600 | 15px | 1.4 |

> Financial amounts use monospace fonts — digits align vertically for easy scanning.

---

## 4. Library Stack — "No Custom Code" Philosophy

> [!TIP]
> **Rule: If a well-maintained library exists, USE IT.** Custom solutions only when no library fits.

| Need | Library | Why This One |
|:-----|:--------|:-------------|
| **UI Components** | `@gluestack-ui/themed` v2 | Unstyled, accessible, NativeWind-native. iOS-native feel, not Material Design |
| **Styling** | `nativewind` 4.1 | Tailwind utility classes for RN. Rapid iteration, no StyleSheet boilerplate |
| **Charts** | `victory-native` 41.6 | Best financial charting for RN. Pie, bar, line, area. Animated, interactive |
| **Animations** | `react-native-reanimated` 3.16 | 60fps native-thread animations. Used by Paper internally |
| **Gestures** | `react-native-gesture-handler` 2.20 | Swipe-to-dismiss, pull-to-refresh, drag |
| **Bottom Sheets** | `@gorhom/bottom-sheet` 5.0 | Industry-standard bottom sheets for offer details, filters |
| **Icons** | `@expo/vector-icons` (MaterialCommunityIcons) | 7000+ icons, zero config with Expo |
| **Skeleton Loading** | `moti` 0.29 + `react-native-reanimated` | Smooth content placeholder animations |
| **Toast/Snackbar** | `@gluestack-ui/toast` | Built into gluestack, no extra dependency |
| **Date/Time** | `date-fns` 4.1 | Tree-shakeable, locale-aware. Not moment.js |
| **Currency** | `Intl.NumberFormat` (built-in) | Native JS API. `new Intl.NumberFormat('en-AE', {style: 'currency', currency: 'AED'})` |
| **Haptic Feedback** | `expo-haptics` | Tactile feedback on important actions (confirm refinance, accept offer) |
| **Blur Effects** | `expo-blur` | Premium glassmorphism effects for overlays |
| **Secure Storage** | `expo-secure-store` | iOS Keychain / Android Keystore for tokens |
| **Splash Screen** | `expo-splash-screen` | Smooth app launch experience |
| **Linear Gradient** | `expo-linear-gradient` | Premium background gradients |
| **Lottie** | `lottie-react-native` 7.1 | Complex micro-animations (success checkmarks, loading states) |

---

## 5. Component Patterns

### Cards — The Primary Content Container
```
┌────────────────────────────────────┐
│ 🏦  Bank Logo     Mashreq Bank    │  ← Header with bank identity
│────────────────────────────────────│
│ Personal Loan                      │  ← Loan type
│ AED 45,000    remaining            │  ← Monospace, large
│ 14.5% APR  •  24 months left      │  ← Key metrics inline
│────────────────────────────────────│
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░  65% paid      │  ← Progress bar
│────────────────────────────────────│
│ [See Refinance Offers →]           │  ← CTA: success green
└────────────────────────────────────┘
```

### Offer Comparison — Side-by-Side
```
┌──────────────┬──────────────┐
│  Current     │  Best Offer  │
│  Mashreq     │  ADIB        │
│──────────────┼──────────────│
│  14.5% APR   │  10.0% APR   │ ← Red vs Green
│  AED 2,100   │  AED 1,650   │ ← Monthly EMI
│  24 months   │  24 months   │
│──────────────┼──────────────│
│              │ Save AED 450 │ ← Highlight in green
│              │   per month  │
│──────────────┼──────────────│
│              │ [Accept →]   │
└──────────────┴──────────────┘
```

---

## 6. Spacing & Layout System

| Token | Value | Usage |
|:------|:------|:------|
| `xs` | 4px | Tight internal spacing |
| `sm` | 8px | Between related elements |
| `md` | 16px | Standard padding, gaps |
| `lg` | 24px | Section spacing |
| `xl` | 32px | Page margins |
| `2xl` | 48px | Between major sections |

### Safe Areas
- Always use `SafeAreaView` or `expo-constants` for status bar
- Bottom tab bar: 60px + home indicator padding
- Cards: 16px internal padding, 12px border radius

---

## 7. Animation Guidelines

| Interaction | Duration | Easing | Library |
|:------------|:---------|:-------|:--------|
| Screen transitions | 300ms | ease-in-out | Expo Router (built-in) |
| Button press | 100ms | spring(damping: 15) | Reanimated |
| Card expand | 250ms | ease-out | Reanimated + LayoutAnimation |
| Number count-up | 1200ms | ease-out | Custom + Reanimated |
| Skeleton shimmer | Infinite loop | linear | Moti |
| Success checkmark | 800ms | spring | Lottie |
| Pull-to-refresh | Native | Native | `RefreshControl` |

### Micro-Animations to Implement
- **Savings counter:** Numbers count up when showing "You save AED X"
- **Offer cards:** Slight scale-up on press (0.98 → 1.0)
- **Tab transitions:** Smooth cross-fade between tabs
- **Loan paid progress:** Animated fill on progress bars
- **Haptic feedback:** On "Accept Offer", "Confirm Refinance"

---

## 8. Accessibility Checklist

| Requirement | Implementation |
|:------------|:---------------|
| **Color Contrast** | WCAG AA minimum (4.5:1 text, 3:1 large text) |
| **Touch Targets** | Minimum 44x44pt (Apple HIG) |
| **Screen Reader** | All interactive elements have `accessibilityLabel` |
| **Dynamic Type** | Support iOS Dynamic Type scaling |
| **RTL Support** | `I18nManager.forceRTL()` for Arabic — critical for UAE market |
| **Reduced Motion** | Respect `AccessibilityInfo.isReduceMotionEnabled()` |

---

## 9. Responsive Design

| Breakpoint | Device | Layout Adaptation |
|:-----------|:-------|:-----------------|
| 320-375px | iPhone SE, older phones | Single column, compact cards |
| 376-428px | iPhone 15, most Android | Standard layout |
| 429px+ | iPhone Pro Max, tablets | Wider cards, optional two-column |

---

## 10. Design Inspiration & Benchmarks

> Figma designs are **guidance only.** The actual app should exceed these in quality.

| App | What to Learn From It |
|:----|:---------------------|
| **Wise (TransferWise)** | Clean financial dashboards, clear savings display |
| **Revolut** | Premium dark mode, smooth animations, card-first UI |
| **Cash App** | Bold simplicity, clear money flow visualization |
| **Robinhood** | Data visualization, portfolio-style views |
| **Tala** | Trust signals, emerging market fintech UX |

### BuyOut Design DNA
- **Revolut's premium feel** + **Wise's clarity** + **Islamic finance trust cues**
- Dark mode for dashboards (premium), light mode for forms (clarity)
- Green = savings. Always show what the user gains, not what they owe.
- Arabic/RTL as first-class citizen, not an afterthought
