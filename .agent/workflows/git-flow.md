---
description: Git workflow for OLFi — branching, commits, PRs, and releases
---

# Git Flow — OLFi

This workflow prioritizes preserving history. Do not delete or rewrite branches unless a safety branch/tag exists and the branch has been inspected.

## Current Repo State

| Item | Value |
|:--|:--|
| GitHub repo | `mahmoudahmedalaa/OLFi` |
| Remote URL | `https://github.com/mahmoudahmedalaa/OLFi.git` |
| Default branch | `main` |
| Current latest product line | `fix/auth-and-splash` |
| Cleanup branch | `chore/repo-stabilization` |
| Safety snapshot | `archive/pre-cleanup-20260511` |
| Historical divergent branch | `feature/kyc-open-finance` |

`feature/kyc-open-finance` is preserved because it contains an older alternate structure with large deletes. Do not merge it into current work without a focused review.

## Branch Strategy

```
main          ← production-ready, what goes to TestFlight/App Store
  ├── feature/*  ← new functionality
  ├── fix/*      ← bug fixes
  ├── chore/*    ← maintenance, cleanup, dependencies, structure
  ├── docs/*     ← documentation-only work
  └── archive/*  ← preserved snapshots, do not use for active work
```

`develop` exists historically. Keep it until the branch strategy is intentionally simplified, but do not assume it is ahead of `main`.

### Branch Naming

| Prefix | Use | Example |
|:-------|:----|:--------|
| `feature/` | New functionality | `feature/add-loan-form` |
| `fix/` | Bug fix | `fix/auth-token-expiry` |
| `chore/` | Dependencies, config, cleanup | `chore/update-expo-sdk` |
| `hotfix/` | Urgent production fix | `hotfix/crash-on-launch` |
| `docs/` | Documentation only | `docs/repo-map` |
| `archive/` | Safety snapshots | `archive/pre-cleanup-20260511` |

## Commit Convention (Conventional Commits)

```
<type>(<scope>): <short summary>
```

### Types

| Type | When to use |
|:-----|:------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no behavior change |
| `chore` | Build, deps, tooling |
| `test` | Adding/updating tests |
| `perf` | Performance improvement |

### Examples

```
feat(auth): add email/password login with Supabase
fix(loans): correct EMI calculation for variable rates
chore(deps): upgrade expo-linear-gradient to 14.0.1
docs(readme): add setup instructions
```

### Rules
- **One concern per commit** — don't mix features with refactors
- **Present tense, imperative** — "add feature" not "added feature"
- **Scope is optional** but recommended for clarity
- **Keep subject under 72 chars**

## Workflow

### Starting New Work

```bash
# Start from the latest product branch or main, depending on release state
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature
```

### During Development

```bash
# Stage specific files (prefer this over git add .)
git add app/app/(tabs)/new-screen.tsx app/lib/new-service.ts

# Commit with conventional message
git commit -m "feat(loans): add loan detail screen with amortization table"

# Push branch
git push -u origin feature/my-feature
```

### Merging to Develop

```bash
# Update main or the agreed integration branch first
git checkout main
git pull origin main

# Merge feature (use --no-ff to preserve branch history)
git merge --no-ff feature/my-feature
git push origin main

# Clean up
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

### Releasing to TestFlight / App Store

```bash
# Ensure main contains the intended release changes
git checkout main
git pull origin main

# Tag the release
git tag -a v1.0.0 -m "v1.0.0: Initial TestFlight release"
git push origin main --tags
```

Only delete a remote branch after confirming:
- Its useful work is merged or preserved elsewhere.
- A branch/tag/archive exists for recovery.
- The user explicitly agrees to deletion.

## Pre-Commit Checklist

Before every commit, verify:

// turbo
1. `npx tsc --noEmit` — zero TypeScript errors
2. No secrets in staged files (`grep -r "SUPABASE_SERVICE_ROLE" app/`)
3. `.gitignore` covers generated output and secrets: `node_modules/`, `.env`, `.expo/`, `dist/`, `.next/`, local `.vercel/`

## Pre-Archive Checklist

Before `Product → Archive` in Xcode:

1. Version bumped in `app.json` (`version` and `ios.buildNumber`)
2. All changes committed and pushed
3. Xcode workspace opens at `app/ios/OLFi.xcworkspace`
4. Team signing selected in Xcode
5. Archive tested through Xcode and then TestFlight on a physical iPhone

## What NOT to Commit

| Excluded | Reason |
|:---------|:-------|
| `ios/` / `android/` | Regenerated via `expo prebuild` |
| `node_modules/` | Installed via `npm install` |
| `.env` files | Secrets — use Supabase dashboard |
| `.DS_Store` | macOS cruft |
| `.expo/` | Metro cache |
| `dist/` | Build output |
| `.next/` | Next.js build output |
| `.vercel/` | Local Vercel link state |
