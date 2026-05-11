# OLFi Development Principles

> These principles apply to all OLFi development work. Read `PROJECT_MAP.md` first so the correct app surface is edited.

## 0. Surface Discipline

- Mobile app work belongs in `app/`.
- Marketing website work belongs in `web/`.
- Admin dashboard work belongs in `admin/`.
- Backend work belongs in `supabase/`.
- Prototype work belongs to the Vercel `olfi-prototype` surface and should not be mixed into canonical app work by accident.
- `shared/` and `archive/` are reference/historical by default.

Do not make broad cross-surface edits unless the task explicitly asks for them.

## 1. Library-First Development

**ALWAYS use established libraries and packages over custom code.**

- Before writing ANY custom component, search for an existing package
- Prefer well-maintained, widely-adopted libraries (>1K GitHub stars, active maintenance)
- Document every package choice with version and rationale
- Keep `package.json` as the single source of truth for dependencies

## 2. Best-in-Class UI/UX

- **Do NOT follow the Figma designs literally** — they are guidance and inspiration only
- Study market leaders (Revolut, Wise, Cash App, Robinhood) for design patterns
- Follow the OLFi brand system: deep ink surfaces, brand teal accents, restrained premium motion, and clear financial hierarchy
- Dark mode for financial dashboards (premium feel), light mode for forms
- Every interaction should have micro-animations (haptics, spring animations)
- Arabic/RTL is a first-class citizen, not an afterthought

## 3. Financial-Grade Quality

- All monetary amounts stored as integers (fils/cents) — never floating point
- Monospace fonts for financial numbers (alignment matters)
- ACID transactions for any money-related operations
- Row Level Security on every table — users see only their own data

## 4. Modern & Trendy

- Use latest stable versions of all packages
- Follow current design trends: glassmorphism, smooth gradients, micro-animations
- Premium feel: no generic defaults, no placeholder content, no basic styling
- The app should look like it was designed by a top-tier fintech design team

## 5. Free/Cheap First

- Use free tiers for everything during MVP (Supabase, Expo, Xcode, GitHub)
- Only upgrade when free tier limits are genuinely hit
- Document the upgrade path for each service in PRODUCTION_MIGRATION.md
- Avoid AWS/cloud services that require setup costs during MVP

## 6. iOS-First

- **Xcode Archive → TestFlight ONLY. Never use Expo Go.**
- Build locally with Xcode → archive → TestFlight
- Test every feature on a physical iOS device
- Ensure native-quality animations and interactions
- Follow Apple HIG for touch targets, safe areas, and gestures

## 7. Cleanup & Archiving

- Preserve before pruning. Use an `archive/*` branch, tag, or `archive/` folder before removing historical material.
- Never delete divergent branches unless their useful work has been merged or explicitly archived and the user approves deletion.
- Keep legacy technical IDs unless a migration plan covers App Store, Supabase, OAuth, deep links, and installed app continuity.
