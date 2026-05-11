# Branch Audit — 2026-05-11

## Summary

The repository is healthy but had unclear active branch ownership. No branch should be deleted yet. The safe path is to preserve all divergent work, stabilize the current product line, then merge intentionally.

## Current Branches

| Branch | Status | Recommendation |
|:--|:--|:--|
| `main` | GitHub default branch, production-oriented. | Keep. Merge stabilization work here after verification. |
| `fix/auth-and-splash` | Current latest product line. Contains recent OLFi branding, auth/splash, web, and TestFlight-prep work. | Treat as current source line until merged. |
| `chore/repo-stabilization` | Cleanup branch created from `fix/auth-and-splash`. | Use for repo structure/docs cleanup. |
| `archive/pre-cleanup-20260511` | Safety snapshot with exact pre-cleanup working tree, including generated pitch/PDF files. | Preserve. Do not merge. |
| `develop` | Historical integration branch, already merged into `main` for its known work. | Keep for now, retire later only after confirming no workflow depends on it. |
| `feature/phase-4-advanced` | Merged into `develop`. | Safe to archive later, but not urgent. |
| `feature/kyc-open-finance` | Divergent older branch with an alternate structure and massive deletes compared with current product line. | Preserve. Do not merge into current app without focused review. |

## Why `feature/kyc-open-finance` Was Not Merged

Compared with the current product line, it removes or rewrites large areas of the mobile app, docs, Supabase, shared prototypes, and web/admin surfaces. It appears to be an older alternate structure rather than a missing latest-feature branch.

It does contain a clean move of a marketing site into `web/`, but that structural outcome already exists in the current product line. The risk of merging it wholesale is high.

## Safety Work Completed

- Created and pushed `archive/pre-cleanup-20260511`.
- Pushed local `fix/auth-and-splash` commits to GitHub.
- Renamed GitHub repo to `mahmoudahmedalaa/OLFi`.
- Updated local remote to `https://github.com/mahmoudahmedalaa/OLFi.git`.

## Future Cleanup Candidates

Only after stabilization is merged and verified:

1. Tag or preserve `feature/phase-4-advanced`, then delete the branch if desired.
2. Decide whether `develop` still has a role. If not, document a trunk-based workflow around `main`.
3. Keep `feature/kyc-open-finance` as an archive branch unless a human review identifies specific files worth cherry-picking.
4. Rename Vercel `buyout-admin` to an OLFi name after confirming project settings and environment variables.
