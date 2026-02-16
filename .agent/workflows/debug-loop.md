---
description: Systematic debugging protocol. Use when encountering bugs, crashes, or unexpected behavior. Prevents wasted time by tracking hypotheses and eliminated causes across sessions.
---

# Debug Loop Protocol

> Stop guessing. Start tracking. Every debugging session follows this structure.

## When to Use
- App crashes or throws unexpected errors
- Feature doesn't work as expected after implementation
- Build/test failures with non-obvious causes
- Any bug that takes more than 5 minutes to understand

## Step 1 — Open a Debug Session

Create a `DEBUG-{slug}.md` file in the project root (or `.planning/debug/` if that folder exists):

```markdown
# Debug: {Short Description}

## Status: 🔴 Active

## Symptoms
- **Expected:** {What should happen}
- **Actual:** {What actually happens}
- **Errors:** {Error messages, stack traces — verbatim}
- **Reproduction:** {Exact steps to trigger the bug}
- **First noticed:** {When / what changed}

## Current Hypothesis
> **Focus:** {What you're investigating right now}
> **Test:** {How you'll confirm or eliminate this}
> **Expected outcome:** {What a positive result looks like}

## Evidence (append-only)
<!-- NEVER delete entries. Only add new findings. -->

1. {timestamp} — {What you found and where}

## Eliminated Hypotheses (append-only)
<!-- NEVER delete entries. Prevents re-investigating dead ends. -->

| # | Hypothesis | Evidence Against | Eliminated |
|---|-----------|-----------------|------------|

## Resolution
- **Root cause:** {TBD}
- **Fix:** {TBD}
- **Verified:** {TBD}
```

## Step 2 — Investigate Systematically

Follow this loop for each hypothesis:

```
┌─────────────────────────┐
│  Form Hypothesis        │
│  "I think X causes Y"   │
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  Design Test            │
│  "If X, then I expect Z"│
└──────────┬──────────────┘
           ▼
┌─────────────────────────┐
│  Execute Test           │
│  Run the check          │
└──────────┬──────────────┘
           ▼
    ┌──────┴──────┐
    │  Confirmed? │
    └──┬──────┬───┘
   Yes │      │ No
       ▼      ▼
  Fix it   Add to Eliminated
           Form new hypothesis
```

**Rules:**
1. **One hypothesis at a time** — don't shotgun-debug
2. **Log every finding** — even if it seems irrelevant, add to Evidence
3. **Check Eliminated first** — before forming a new hypothesis, scan what's already been ruled out
4. **Include evidence against** — when eliminating, write WHY it's not the cause

## Step 3 — Common Investigation Commands

```bash
# Check recent changes (often the cause)
git diff HEAD~3 --name-only

# Search for related patterns
grep -rn "functionName" src/ --include="*.ts" --include="*.tsx"

# Check for TODO/FIXME near the problem area
grep -rn "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts"

# Verify file actually exists and is imported
find . -name "ComponentName*" -not -path "*/node_modules/*"

# Check TypeScript errors in specific file
npx tsc --noEmit --pretty 2>&1 | grep "fileName"
```

## Step 4 — Resolution

When you find the root cause:

1. **Update the Resolution section** with root cause, fix, and verification
2. **Change status** to `🟢 Resolved`
3. **Add a "Lessons Learned" line** — what would have caught this earlier?
4. **Keep the file** — it's a knowledge artifact for future similar bugs

## Step 5 — Session Handoff

If you can't resolve in the current session:

1. Update **Current Hypothesis** with where you left off
2. Ensure **Evidence** and **Eliminated** are fully up to date
3. Set status to `🟡 Paused — {reason}`
4. The next session reads this file and resumes without re-investigating eliminated paths

## Anti-Patterns

| ❌ Don't | ✅ Do |
|:---------|:------|
| Change multiple things at once | Change one thing, test, log result |
| Delete debug notes when stuck | Append — eliminated hypotheses prevent loops |
| Skip logging "obvious" checks | Log everything — what's obvious now isn't later |
| Restart investigation from scratch | Read the debug file first, resume from last state |
| Guess at the fix without understanding root cause | Find root cause first, then fix |
