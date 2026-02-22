# Version Control & Git Flow Runbook

This document defines the strict Git workflow all engineers must follow to ensure repository stability for the BuyOut application.

## 1. Branch Naming Conventions
Never commit directly to `main`. All work must be done on isolated branches following this prefix convention:

*   `feat/`: A new feature (e.g., `feat/add-biometric-auth`)
*   `fix/`: A bug fix (e.g., `fix/otp-keyboard-overlap`)
*   `chore/`: Maintenance, dependency updates, or documentation (e.g., `chore/update-readme`)
*   `refactor/`: Restructuring existing code without adding new features.
*   `release/`: Used strictly by the release manager when cutting a new version (e.g., `release/v1.0.5`).

## 2. The Pull Request (PR) Lifecycle

1.  **Draft:** Open a PR as a "Draft" as soon as you start working. This signals to the team what is currently in flight.
2.  **Implementation:** Write your code, following the `feat/` branch naming.
3.  **Self-Review:** Before requesting a formal review, you must test the branch locally on the iOS Simulator, ensuring No TypeScript errors (`npx tsc --noEmit`).
4.  **Ready for Review:** Mark the PR as ready and assign at least one other engineer.
5.  **Squash & Merge:** Once approved, the PR must be **Squash Merged** into `main`. This keeps the `main` history clean with single, atomic commits per feature.

## 3. Commit Message Formatting
We follow the Conventional Commits specification.

*   `feat: add face id support to login screen`
*   `fix: resolve crash on null salary input`
*   `docs: update API spec for savings engine`

## 4. CI/CD Triggers (Future State)
Currently, builds are triggered manually via `eas build`. In Phase 3, we will implement GitHub Actions to automatically run `npx tsc` and Jest tests on every PR opened against `main`. Blocking merges if the tests fail.
