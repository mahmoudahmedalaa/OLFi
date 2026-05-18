# OLFi Technical Debt Audit - 2026-05-19

Branch: `codex/mobile-release-hardening-v1`

## Fixed During This Audit

- Added Supabase migration `20260518202736_harden_application_document_rls.sql`.
  - `refinance_applications` inserts now require the selected `user_loan_id` to belong to the authenticated user.
  - `user_documents` inserts now require any linked `application_id` to belong to the authenticated user.
  - Applied to the linked remote Supabase project; `supabase migration list` shows local and remote matching through `20260518202736`.
- Replaced remaining user-facing mobile `BuyOut` legal copy with `OLFi` in privacy/terms text.
- Added reusable Codex skill `olfi-quality-audit` at `~/.codex/skills/olfi-quality-audit`.

## Verification Evidence

- Mobile app:
  - `npm run check:ios-build`: passed; Expo, `Info.plist`, and Xcode project all report build `45`.
  - `npx tsc --noEmit`: passed.
  - `npm run lint`: passed.
- Admin panel:
  - `npx tsc --noEmit`: passed.
  - `npm run lint`: passed.
  - `npm run build`: passed.
- Public website:
  - `npx tsc --noEmit`: passed.
  - `npm run lint`: passed.
  - `npm run build`: passed.
- Prototype:
  - `npm run build` in `shared/repo`: passed.
  - `npx tsc --noEmit` in `shared/repo`: passed after a fresh build regenerated `.next/types`.
  - `npm run lint` in `shared/repo`: blocked by deprecated interactive `next lint` prompt.
- Supabase:
  - `supabase db push`: applied `20260518202736_harden_application_document_rls.sql`.
  - `supabase migration list`: local and remote migration history match through `20260518202736`.

## Technical Debt Register

### P0/P1 Release Risks

- Prototype lint script is stale:
  - `shared/repo/package.json` still uses `next lint`, which prompts interactively under current Next.js instead of running a deterministic CI lint.
  - Recommended fix: migrate to ESLint CLI with an explicit config and update the script to `eslint .`.
- Prototype auth has a fallback JWT secret:
  - `shared/repo/lib/auth.ts` defaults to `olfi-demo-secret-change-in-production-2026` if `JWT_SECRET` is missing.
  - This may be acceptable for YC/demo preview, but production-style deployments should require `JWT_SECRET`.
  - Do not remove demo auth without explicit approval because YC testing depends on stable credentials/flows.
- Main mobile still has mock/open-banking debt injection reachable from `app/app/add-loan.tsx`.
  - This is useful for prototype/demo flow but should be feature-flagged or clearly environment-gated before broader production use.

### P2 Product/UX Alignment Debt

- Mobile and prototype must stay vocabulary-aligned:
  - Standard terms are `debt`, `loan`, `finance product`, and `application`.
  - Latest scan shows remaining `BuyOut` mentions only in generated/stale files and comments after legal copy cleanup.
- Admin application tracker is functional but should continue toward an operations-grade view:
  - Add saved filters/search.
  - Add SLA/age prioritization.
  - Add per-admin action attribution if multiple reviewers use the console.
  - Add mobile-visible event timeline if users should see exact admin events rather than status-derived timeline.

### P2 Maintainability Debt

- Mobile app has broad `any` usage in screen/component props and Supabase data transforms.
  - Highest-value next step: introduce typed Supabase row models for loans, products, applications, documents, and profiles.
  - Then replace `any` in `offer-details`, `useApplyOffer`, `useOffersData`, apply-offer components, and dashboard cards.
- Tracked stale helper/output files exist in `app/`:
  - `app/lint_output.txt`
  - `app/fix-bg.js`
  - These should be removed in a dedicated cleanup if no workflow depends on them.
- Docs/reference vendoring is large:
  - `docs/design-references/awesome-design-md` is intentionally docs-only, but it adds large repo weight.
  - Keep it out of runtime and deployment paths.

### Infrastructure Notes

- Admin uses the Supabase service role from server-only code and now fails fast if `SUPABASE_SERVICE_ROLE_KEY` is missing.
- Public website build passes.
- Admin build passes.
- Mobile build number is ready for TestFlight build `45`.
- Xcode archive should use `app/ios/OLFi.xcworkspace`, not the `.xcodeproj`.

## Repeatable Skill

Installed skill:

- `/Users/mahmoudalaaeldin/.codex/skills/olfi-quality-audit`

Use it in future sessions by asking to run the OLFi quality audit or technical-debt/release-readiness sweep.
