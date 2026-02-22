---
description: Verify implemented features are real and functional, not stubs or placeholders. Run after completing any feature implementation.
---

# Verification Protocol

> Code that compiles isn't code that works. This protocol catches stubs, broken wiring, and placeholder implementations.

## When to Use
- After implementing any new feature or component
- Before marking a task as "complete"
- When reviewing code that passes TypeScript checks but hasn't been manually tested
- As a pre-merge checklist

## The 4-Level Verification

Every feature must pass all four levels:

```
Level 1: EXISTS      — File exists, has non-zero content
Level 2: SUBSTANTIVE — Contains real logic, not stubs/placeholders
Level 3: WIRED       — Connected to the rest of the app (imports, routes, navigation)
Level 4: FUNCTIONAL  — Actually works when triggered by user action
```

---

## Level 1 — Exists

```bash
# Verify file exists with content
test -s "path/to/file.tsx" && echo "✅ Exists" || echo "❌ Missing or empty"
```

## Level 2 — Substantive (Stub Detection)

### React / React Native Components

```bash
# RED FLAGS — These indicate stubs:
grep -n "TODO\|FIXME\|placeholder\|Placeholder\|implement\|IMPLEMENT" path/to/Component.tsx

# Check for empty handlers
grep -n "() => {}" path/to/Component.tsx
grep -n "console.log.*todo\|console.log.*implement" path/to/Component.tsx

# Check for meaningful JSX (not just a wrapper div)
grep -c "return" path/to/Component.tsx  # Should have return statements
grep -c "<Text\|<View\|<Pressable\|<ScrollView" path/to/Component.tsx  # Should have real UI
```

**Stub patterns to catch:**
```typescript
// ❌ These are stubs:
return <View><Text>Component Name</Text></View>
return <View />
return null  // (unless conditional rendering)
const handleSubmit = () => {}
const handleSubmit = () => { console.log("TODO") }
onPress={() => alert("Coming soon")}
```

### API Routes / Edge Functions

```bash
# Should contain database queries or API calls
grep -n "supabase\|fetch\|prisma\|query\|select\|insert\|update\|delete" path/to/api.ts

# Should validate input
grep -n "zod\|validate\|schema\|parse\|safeParse" path/to/api.ts

# Should handle errors
grep -n "catch\|error\|throw\|try" path/to/api.ts
```

### Database / Schema

```bash
# Check migration files exist and have content
find supabase/migrations -name "*.sql" -empty  # Should return nothing

# Verify RLS policies exist for tables
grep -rn "CREATE POLICY\|ALTER TABLE.*ENABLE ROW LEVEL" supabase/migrations/
```

## Level 3 — Wired

Check that components are actually **connected** to the app:

### Component → Navigation

```bash
# Is the component imported and used in a navigator/layout?
grep -rn "ComponentName" app/ --include="*layout*" --include="*navigator*" --include="*tabs*"
```

### Component → Data

```bash
# Does it fetch real data (not hardcoded)?
grep -n "useQuery\|useFetch\|supabase\|useState.*\[\]\|useEffect" path/to/Component.tsx

# Are there hardcoded mock arrays?
grep -n "const.*=.*\[{.*}\]" path/to/Component.tsx  # Suspicious if large inline arrays
```

### Form → Handler → API

```bash
# Form has onSubmit/onPress that calls a real function
grep -n "onSubmit\|onPress\|handleSubmit\|handleSave" path/to/Form.tsx

# Handler calls an API or mutation
grep -n "mutate\|fetch\|supabase\|api\." path/to/handler.ts
```

### State → Render

```bash
# State changes trigger re-renders with real data
grep -n "useState\|useSelector\|useStore\|useContext" path/to/Component.tsx
# Combined with:
grep -n "loading\|error\|data\|isLoading" path/to/Component.tsx
```

## Level 4 — Functional

This requires **manual or automated testing**:

### Quick Functional Checklist

| Check | How |
|:------|:----|
| Component renders | Navigate to it in the app |
| Data loads | Check for loading state → real data |
| User actions work | Tap buttons, submit forms, swipe |
| Error states handled | Disconnect network, submit invalid data |
| Navigation works | Can you get TO and FROM this screen? |
| State persists | Does data survive app restart? |

### UAT Protocol (User Acceptance Testing)

For each feature, present the **expected behavior** and ask if reality matches:

```
Test: {Feature Name}
Expected: {What the user should see/experience}

→ Pass (works as expected) or describe what's different
```

**Severity inference from user feedback:**
| User says | Severity |
|:----------|:---------|
| "crashes", "error", "fails completely" | 🔴 Blocker |
| "doesn't work", "nothing happens" | 🟠 Major |
| "works but...", "slow", "weird" | 🟡 Minor |
| "color", "spacing", "alignment" | 🔵 Cosmetic |

---

## Quick Verification Checklist

Copy this into your task tracking when completing a feature:

```
### Verification: {Feature Name}
- [ ] L1: Files exist with non-zero content
- [ ] L2: No stubs — real logic, real handlers, real queries
- [ ] L3: Wired — imported, navigable, connected to data
- [ ] L4: Functional — tested manually or via automated test
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|:---------|:------|
| Mark complete after TypeScript passes | Mark complete after L4 functional test |
| Leave `console.log("TODO")` in handlers | Implement the real handler or remove |
| Hardcode demo data in components | Connect to real data source |
| Skip error state handling | Handle loading, error, and empty states |
| Test only the happy path | Test error cases, edge cases, empty states |
