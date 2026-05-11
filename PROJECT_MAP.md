# OLFi Project Map

This repository contains several OLFi surfaces. Before changing code, identify the target surface and stay inside its boundary unless the task explicitly spans multiple surfaces.

## Canonical Surfaces

| Surface | Path / Location | Purpose | Change Here When |
|:--|:--|:--|:--|
| Mobile app | `app/` | Canonical iOS app built with Expo, React Native, Supabase, and Xcode. | Building user-facing app flows, auth, dashboard, debts, offers, profile, TestFlight builds. |
| Marketing site | `web/` | Canonical public OLFi website on Vercel. | Editing landing page content, waitlist UX, marketing visuals, SEO, Arabic/English website copy. |
| Admin dashboard | `admin/` | Internal ops dashboard on Vercel. | Editing internal views for users, waitlist, banks, loans, offers, applications, analytics. |
| Prototype | Vercel project `olfi-prototype` | Static/Expo web prototype used for testing and demonstration. | Only when explicitly asked to update the prototype deployment or prototype assets. |
| Backend | `supabase/` | Supabase migrations and Edge Functions. | Editing database schema, RLS, RPCs, functions, or backend integration logic. |
| Documentation | `docs/`, `research/`, `reference/`, `checklists/`, `workflows/` | Product, engineering, deployment, legal, financial, and research material. | Updating product decisions, implementation notes, compliance, launch, or planning docs. |

## Non-Canonical / Historical Areas

| Area | Status | Rule |
|:--|:--|:--|
| `shared/` | External collaborator files, old prototypes, generated pitch material, and historical handoff assets. | Treat as reference unless a task specifically says to edit shared assets. Do not use `shared/repo` as a source of truth for app behavior. |
| `archive/` | Safe parking area for local leftovers or historical files. | Read-only by default. Do not wire archived files back into live app code without an explicit decision. |
| Branch `feature/kyc-open-finance` | Preserved historical branch with an alternate older structure. | Do not merge into current app without a focused review. It removes large parts of the current product line. |
| Branch `archive/pre-cleanup-20260511` | Safety snapshot of the exact pre-cleanup working tree. | Preserve. Use only for recovery/comparison. |

## Current Source Of Truth

- Latest app line: `fix/auth-and-splash` and cleanup branch `chore/repo-stabilization`.
- Default remote repo: `https://github.com/mahmoudahmedalaa/OLFi.git`.
- GitHub repository name: `mahmoudahmedalaa/OLFi`.
- Main production branch: `main`.

## Technical Names Kept Intentionally

Some identifiers still contain `buyout`. Do not rename these casually:

- iOS bundle identifier: `com.mahmoudahmedalaa.buyout`
- Android package: `com.mahmoudahmedalaa.buyout`
- Expo slug and URL scheme: `buyout`
- Supabase project name: `buyout`

These may be tied to Apple Developer records, installed app continuity, Supabase redirect settings, OAuth callbacks, or previous deployments. User-facing copy and documentation should say OLFi. Technical identifier migration should be a dedicated release task with rollback planning.

## Safe Work Rules

1. State the target surface before editing: mobile, web, admin, prototype, backend, docs, or repo hygiene.
2. Avoid broad edits across `app/`, `web/`, and `admin/` in one task unless the user explicitly asks for a cross-surface change.
3. Never delete branches or historical folders unless a safety branch/tag exists and the branch contents have been inspected.
4. For mobile production readiness, verify TypeScript/lint first, then use Xcode Archive and TestFlight on a physical iPhone.
5. Keep generated build output ignored: `node_modules/`, `.expo/`, `dist/`, `.next/`, `ios/build/`, and local `.vercel/`.
