---
description: Karpathy-inspired execution guardrails for OLFi agents. Read before non-trivial coding, review, refactor, or design implementation work.
---

# OLFi Agent Discipline

These rules adapt the Karpathy-inspired agent guidance from `forrestchang/andrej-karpathy-skills` to OLFi. They are a seatbelt for coding agents: keep work focused, explicit, and verifiable.

## 1. Think Before Coding

Before editing, state the target surface and the assumption behind the change.

- If the task could mean multiple things, name the interpretations before choosing.
- If the safer or simpler path differs from the user's suggested path, say so.
- If repo state contradicts the request, stop and surface the mismatch.
- Do not silently decide to touch another app surface.

## 2. Simplicity First

Solve the requested problem with the smallest clear change that fits the existing codebase.

- Do not add speculative configuration, abstractions, dependencies, or future-proofing.
- Do not rewrite a working flow just because it could be cleaner.
- Prefer local patterns over new architecture.
- If a change starts getting broad, pause and narrow the plan.

## 3. Surgical Changes

Every changed line should trace directly to the request or to verification fallout from that request.

- Do not refactor adjacent code unless required.
- Do not reformat unrelated files.
- Do not delete historical branches, archive material, or legacy technical identifiers without explicit approval.
- Clean up unused imports, variables, or files only when your own change created them.
- Mention unrelated dead code or risk in the final note instead of removing it.

## 4. Goal-Driven Execution

Convert tasks into success criteria and verify against them before calling work complete.

- For bug fixes, reproduce or identify the failing behavior, then verify the fix.
- For feature work, define the user-visible behavior and the command/browser checks that prove it.
- For design work, verify rendered desktop and mobile states, not just code compilation.
- For backend/Supabase work, verify auth, RLS, and data access with the same role the app uses.

## 5. OLFi-Specific Checks

Use these checks as the default finish line:

- Correct surface edited: `app/`, `web/`, `admin/`, `supabase/`, or docs.
- Git status reviewed before and after.
- TypeScript/lint/build run for the touched surface when practical.
- No casual changes to `buyout` technical IDs.
- No broad visual redesign when the request asks for elevation, polish, or cleanup.
- No production mock data unless the user explicitly asks for a demo/test account or seed.

