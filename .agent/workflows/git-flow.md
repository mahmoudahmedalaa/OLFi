---
description: Git workflow for BuyOut — branching, commits, PRs, and releases
---

# Git Flow — BuyOut

## Branch Strategy

```
main          ← production-ready, archivable, what goes to TestFlight/App Store
  └── develop ← integration branch, all features merge here first
       ├── feature/add-loan-form
       ├── feature/refinance-calculator
       ├── fix/login-crash
       └── chore/update-deps
```

### Branch Naming

| Prefix | Use | Example |
|:-------|:----|:--------|
| `feature/` | New functionality | `feature/add-loan-form` |
| `fix/` | Bug fix | `fix/auth-token-expiry` |
| `chore/` | Dependencies, config, cleanup | `chore/update-expo-sdk` |
| `hotfix/` | Urgent production fix | `hotfix/crash-on-launch` |

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
# Always start from develop
git checkout develop
git pull origin develop

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
# Update develop first
git checkout develop
git pull origin develop

# Merge feature (use --no-ff to preserve branch history)
git merge --no-ff feature/my-feature
git push origin develop

# Clean up
git branch -d feature/my-feature
git push origin --delete feature/my-feature
```

### Releasing to Main (TestFlight / App Store)

```bash
# Merge develop into main
git checkout main
git pull origin main
git merge --no-ff develop

# Tag the release
git tag -a v1.0.0 -m "v1.0.0: Initial TestFlight release"
git push origin main --tags
```

## Pre-Commit Checklist

Before every commit, verify:

// turbo
1. `npx tsc --noEmit` — zero TypeScript errors
2. No secrets in staged files (`grep -r "SUPABASE_SERVICE_ROLE" app/`)
3. `.gitignore` covers `ios/`, `android/`, `node_modules/`, `.env`

## Pre-Archive Checklist

Before `Product → Archive` in Xcode:

1. Version bumped in `app.json` (`version` and `ios.buildNumber`)
2. All changes committed and pushed
3. `npx expo prebuild --platform ios --clean` run fresh
4. Team signing selected in Xcode

## What NOT to Commit

| Excluded | Reason |
|:---------|:-------|
| `ios/` / `android/` | Regenerated via `expo prebuild` |
| `node_modules/` | Installed via `npm install` |
| `.env` files | Secrets — use Supabase dashboard |
| `.DS_Store` | macOS cruft |
| `.expo/` | Metro cache |
| `dist/` | Build output |
