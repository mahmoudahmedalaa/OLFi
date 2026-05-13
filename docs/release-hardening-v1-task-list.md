# OLFi Release Hardening V1 Task List

Branch: `codex/mobile-release-hardening-v1`
Canonical branch: `main`

Do not merge to `main` until the preview, mobile archive, and user sign-off are complete.

## Task Tracker

| Status | Area | Task | Evidence |
| --- | --- | --- | --- |
| Done | Mobile release | Bump iOS TestFlight build number to `43` without changing bundle IDs, slug, schemes, or project IDs. | `app npm run check:ios-build` passed |
| Done | Mobile app | Replace consumer-facing "facility" copy with clearer debt/loan/product/application terminology. | `rg "Facility|facility|facilities" app shared/repo` returned no matches |
| Done | Mobile app | Fix offer apply eligibility so saved debts do not trigger a misleading modal. | `app npx tsc --noEmit` and `app npm run lint` passed |
| Done | Admin | Upgrade `/applications` into a clearer operations tracker with applicant, current debt, target product, financial outcome, documents, workflow, notes, and timeline. | `admin npx tsc --noEmit`, `admin npm run lint`, and `admin npm run build` passed |
| Done | Web | Fix the recurring hero flash on `https://olfi.vercel.app/` without removing animations or changing the visual direction. | `web npm run build` passed; local hero idled for 22 seconds in Playwright |
| Done | Prototype | Fix sign-out on `https://olfi-prototype.vercel.app/` so auth and persisted screen state clear reliably. | `shared/repo npm run build` passed; local Playwright sign-out returned to welcome and cleared `olfi_token` |
| Done | Design references | Install VoltAgent `awesome-design-md` as docs/reference material only. | Vendored under `docs/design-references/awesome-design-md` with OLFi notes |

## Terminology Standard

- Use **debt** for what a user has already added or tracks in OLFi.
- Use **loan** or **finance product** for what the user is reviewing or applying for.
- Use **application** for a submitted request.
- Do not use **facility** in consumer-facing mobile/prototype copy.
- Admin screens can use operational labels such as **Current debt**, **Target product**, **Applicant**, and **Application status**.

## Release Notes To Confirm

- Next iOS/TestFlight build number: `43`.
- Existing technical identifiers remain unchanged:
  - Expo slug: `buyout`
  - iOS bundle ID: `com.mahmoudahmedalaa.buyout`
  - URL schemes: `buyout`, `com.mahmoudahmedalaa.buyout`, `exp+buyout`
- Supabase project and Vercel project names are not renamed by this work.

## Verification Log

- `app npm run check:ios-build`: Expo `ios.buildNumber`, iOS `Info.plist`, and Xcode `CURRENT_PROJECT_VERSION` all report `43`.
- `app npx tsc --noEmit`: passed.
- `app npm run lint`: passed.
- `admin npx tsc --noEmit`: passed.
- `admin npm run lint`: passed.
- `admin npm run build`: passed.
- `web npm run build`: passed.
- `shared/repo npm run build`: passed after installing local dependencies.
- Local browser verification:
  - Landing page hero opened at `http://localhost:3100`, idled for 22 seconds, and retained the same animated design without removing motion.
  - Prototype profile sign-out opened at `http://localhost:3101`, clicked Sign Out, returned to welcome, `olfi_screen` became `"welcome"`, and `olfi_token` was absent.
  - Admin `/applications` opened locally at `http://localhost:3102/applications` and rendered the upgraded queue/detail layout. Local data load showed `Invalid API key` because local admin env differs from Vercel; Vercel preview should use configured environment variables.
- Vercel branch previews for commit `ddd152d`:
  - Admin: `https://olfi-admin-82x40jar9-mahmoud-alaaeldins-projects.vercel.app` is `READY`.
  - Web: `https://olfi-bdzlt62wh-mahmoud-alaaeldins-projects.vercel.app` is `READY`.
  - Prototype: `https://olfi-prototype-m7eorpp7q-mahmoud-alaaeldins-projects.vercel.app` is `READY`.
