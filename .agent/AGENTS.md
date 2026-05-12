# OLFi AI Agent Instructions

> **Critical instructions for AI assistants working on projects in this workspace.**

## Mandatory Reading Order

1. **Read `PROJECT_MAP.md`** to identify the target surface and avoid editing the wrong app.
2. **Read `.agent/rules/base.md`** for tech stack, design system, financial rules, and verification expectations.
3. **Read `.agent/rules/design-reference.md`** for OLFi visual and copy rules.
4. **Know `.agent/workflows/ralph-loop.md`** before declaring code complete.
5. **Know `.agent/workflows/verification.md`** to catch stubs, broken wiring, and placeholder behavior.
6. **Know `.agent/workflows/debug-loop.md`** for structured debugging.

This workspace contains mobile and web applications built with:
- **Mobile:** React Native (Expo) with TypeScript
- **Web:** Next.js for the marketing site and admin dashboard
- **Prototype:** Vercel project `olfi-prototype`, used for static/mobile-web testing
- **Deployment:** Local Xcode builds for iOS, Vercel for web/admin/prototype

---

## Surface Selection Rule

Before editing, state the target surface:

| Surface | Canonical Location |
|:--|:--|
| Mobile app | `app/` |
| Marketing site | `web/` |
| Admin dashboard | `admin/` |
| Prototype | Vercel project `olfi-prototype` and explicitly named prototype assets |
| Backend | `supabase/` |
| Docs / planning | `docs/`, `research/`, `reference/`, `workflows/`, `checklists/` |

Avoid cross-surface edits unless the user explicitly asks for them. `shared/` is reference/historical by default.

## Core Principles

### 1. iOS Development & Deployment

**NEVER suggest EAS Build or paid cloud build services.**

For iOS apps:
- ✅ **Always use local Xcode builds** via `build-ios.sh`
- ✅ **Upload via Transporter** (free Mac App Store app)
- ✅ **Test via TestFlight** (free, unlimited builds)
- ✅ **Reference:** `workflows/XCODE_GUIDE.md`
- ✅ **Launch workflow:** `.agent/workflows/app-store-launch.md`
- ✅ **Canonical workspace:** `app/ios/OLFi.xcworkspace`

**When user says "ready for production" or "deploy to App Store":**
→ Follow `.agent/workflows/app-store-launch.md` exactly

### 2. React Native/Expo Projects

**Native modifications require special handling:**

When a project has native iOS code (`ios/` directory exists):
- ✅ Changes to `app.json` (icon, buildNumber, infoPlist) are **ignored**
- ✅ Modify native files directly: `Info.plist`, `Images.xcassets`, etc.
- ✅ After `npx expo prebuild --clean`, re-apply native customizations
- ✅ The `build-ios.sh` script handles this automatically

**Path issues:**
- Projects with spaces in paths (e.g., `Vibe Coding/Projects/My App`) require patches
- The `build-ios.sh` script includes all necessary patches
- Never suggest renaming project paths

### 3. Technical Identifier Safety

OLFi still uses several legacy technical identifiers with `buyout` in them:

- `com.mahmoudahmedalaa.buyout`
- Expo slug `buyout`
- URL scheme `buyout`
- Supabase project name `buyout`

Do not rename these as casual cleanup. Treat technical identifier migration as a dedicated release task with App Store, Supabase, OAuth, deep-link, and installed-app continuity checks.

### 4. Code Quality Standards

**Before any production deployment:**

```bash
# Required checks
npm run type-check  # or tsc --noEmit
npm run lint
npm test
```

**Production hardening:**
- Remove all `console.log` statements (or guard with `__DEV__`)
- No test/mock data in production builds
- No placeholder content
- All features fully functional

### 5. Version Management

**Semantic versioning:**
- Patch: `1.0.0 → 1.0.1` (bug fixes)
- Minor: `1.0.0 → 1.1.0` (new features, backward compatible)
- Major: `1.0.0 → 2.0.0` (breaking changes)

**Build numbers:**
- Must increment for every App Store upload
- Must be unique (never reuse)
- iOS: `ios/YourApp/Info.plist` → `CFBundleVersion`
- Or: `app.json` → `expo.ios.buildNumber` (if using Expo managed)

---

## Workflows

### Mobile App Launch

When user requests production deployment:

1. **Read** `.agent/workflows/app-store-launch.md`
2. **Follow** each phase sequentially
3. **Verify** all checklist items
4. **Guide** user through Transporter upload
5. **Remind** to test on TestFlight before App Store submission

### Web App Deployment

For Next.js/Vite/static sites:

```bash
# Vercel (recommended)
vercel --prod

# Or manual build
npm run build
# Deploy dist/ or out/ to hosting
```

---

## File Structure Awareness

### Project Structure

```
olfi/
├── .agent/
│   ├── AGENTS.md              # This file
│   ├── rules/
│   │   ├── base.md            # Tech stack, financial rules
│   │   └── design-reference.md # Fintech colors, UX patterns, Arabic typography
│   └── workflows/
│       ├── app-store-launch.md # iOS deployment workflow
│       ├── debug-loop.md      # Structured debugging protocol
│       ├── dev-quick-reference.md # Quick dev commands
│       ├── ralph-loop.md      # Build/lint verification loop
│       └── verification.md    # 4-level feature verification
├── app/                       # Expo React Native app
├── web/                       # Next.js marketing site
├── admin/                     # Next.js internal admin dashboard
├── docs/                      # All project documentation
├── assets/                    # Shared brand assets
├── shared/                    # Historical/reference collaborator assets
├── archive/                   # Archived local leftovers, read-only by default
├── agent-config/              # Agent rules, skills, scripts
├── workflows/                 # Dev, deployment, Xcode guides
└── supabase/                  # DB migrations & config
```

### Project Structure (React Native/Expo)

```
app/
├── app/                      # Expo Router screens
├── components/               # Reusable UI/domain components
├── hooks/                    # Data and feature hooks
├── lib/                      # Supabase, auth, constants, calculations
├── ios/                      # Native iOS workspace/project for Xcode
├── assets/                   # Images, icons, splash assets
├── app.json                  # Expo config
└── build-ios.sh              # Local iOS build helper
```

---

## Common User Requests & Responses

### "Deploy to App Store"
→ Follow `.agent/workflows/app-store-launch.md`

### "Build iOS app"
→ Run `./build-ios.sh`, upload via Transporter

### "Test on my phone"
→ Upload to TestFlight, install via TestFlight app (no cable needed)

### "Quick test during development"
→ Plug iPhone via USB, `Cmd+R` in Xcode (for rapid iteration)

### "Update app icon"
→ If `ios/` exists: Update `Images.xcassets/AppIcon.appiconset/`
→ If Expo managed: Update `app.json` → `icon`, then `npx expo prebuild`

### "Background audio not working"
→ Check `Info.plist` for `UIBackgroundModes` → `audio`
→ Verify audio session configuration in code

### "Build failed with path errors"
→ Project path has spaces, `build-ios.sh` patches this automatically
→ Ensure script is executable: `chmod +x build-ios.sh`

---

## Decision Trees

### iOS Build Method Selection

```
Is this a React Native/Expo project?
├─ Yes → Does ios/ directory exist?
│  ├─ Yes → Use build-ios.sh (handles all patches)
│  └─ No → Run npx expo prebuild first, then build-ios.sh
└─ No (Pure Swift/SwiftUI) → Use Xcode directly (Product → Archive)
```

### Deployment Target Selection

```
What is the user testing?
├─ Production build → TestFlight (wireless, no cable)
├─ Quick development iteration → Xcode direct install (USB cable)
└─ Sharing with team → TestFlight external testing
```

### Version Increment Decision

```
What changed?
├─ Bug fixes only → Patch (1.0.0 → 1.0.1)
├─ New features (backward compatible) → Minor (1.0.0 → 1.1.0)
├─ Breaking changes → Major (1.0.0 → 2.0.0)
└─ Resubmitting rejected build → Increment build number only
```

---

## Error Handling

### Build Errors

**"Sandbox: deny(1) file-write-create"**
→ Expo dev server issue, use Release configuration or run `build-ios.sh`

**"Signing requires a development team"**
→ Open Xcode → Project → Signing & Capabilities → Select Team

**"No such file or directory"**
→ Path has spaces, `build-ios.sh` handles this automatically

### Upload Errors

**"Build number already used"**
→ Increment `CFBundleVersion` in `Info.plist`

**"Invalid binary"**
→ Check Xcode build logs for missing frameworks

### App Store Rejection

**"Guideline 2.1 - App Completeness"**
→ Remove placeholder content, ensure all features work

**"Guideline 4.3 - Spam"**
→ App is too similar to existing apps, add unique value

**"Guideline 5.1.1 - Privacy"**
→ Add privacy policy URL, declare data collection

---

## Best Practices for AI Agents

### When Starting Work

1. **Check for existing workflows** in `.agent/workflows/`
2. **Read relevant documentation** in `workflows/`
3. **Understand project structure** before making changes
4. **Ask clarifying questions** if user intent is unclear

### When Making Changes

1. **Follow established patterns** in the codebase
2. **Maintain consistency** with existing code style
3. **Update documentation** if changing workflows
4. **Test changes** before declaring completion

### When Deploying

1. **Never skip testing** on TestFlight
2. **Always increment version/build** numbers
3. **Verify production hardening** checklist
4. **Guide user** through manual steps (Transporter upload)

### Communication Style

- **Be concise** but complete
- **Use checklists** for multi-step processes
- **Provide context** for decisions
- **Anticipate questions** and address them proactively

---

## Quick Reference

| Task | Command | Notes |
|:-----|:--------|:------|
| **Build iOS** | `./build-ios.sh` | Outputs to `build/YourApp.ipa` |
| **Upload to TestFlight** | Open Transporter → Drag IPA | GUI only, no CLI |
| **Test on device** | TestFlight app | Wireless, no cable |
| **Clean build** | `rm -rf build/ ios/build/` | Before rebuilding |
| **Check version** | `cat app.json \| grep version` | Current version |
| **Increment build** | Edit `Info.plist` → `CFBundleVersion` | Must be unique |

---

## Resources

- **Launch Workflow:** `.agent/workflows/app-store-launch.md`
- **Debug Protocol:** `.agent/workflows/debug-loop.md`
- **Verification:** `.agent/workflows/verification.md`
- **Design Reference:** `.agent/rules/design-reference.md`
- **Build Script:** `build-ios.sh`

---

## Updates to This File

When workflows change:
1. Update this file to reflect new processes
2. Update corresponding workflow files
3. Test new workflows before documenting
4. Keep examples current and accurate

**Last updated:** 2026-02-15
**Version:** 1.1.0
