# OLFi Sprint Methodology

OLFi operates on a fast-paced, highly focused Agile methodology. Because we are a fin-tech product with compliance requirements, we balance "moving fast" with strict QA cycles.

## The Sprint Structure

*   **Duration:** 2 Weeks (14 Days).
*   **Start Date:** Every other Monday (Sprint Planning at 10 AM GST).
*   **End Date:** The second Friday (Sprint Review & Retrospective at 4 PM GST).

### 1. Sprint Planning (Monday, Week 1)
*   Review the [Prioritization Matrix](prioritization-matrix.md).
*   Select the top-voted User Stories from the Backlog.
*   *Rule:* No story enters the sprint without explicit Acceptance Criteria.
*   *Rule:* Estimate points (1, 2, 3, 5, 8) based on perceived effort and risk.

### 2. Daily Standup (15 mins, async via Slack preferred)
1. What did I build yesterday?
2. What am I building today?
3. What is blocking me? (Specifically highlighting any API/Bank partner delays).

### 3. Development & QA Cycle
We practice **Continuous Verification**.
1.  Developer picks a ticket.
2.  Creates branch (e.g., `feat/BU-123-uae-pass-login`).
3.  Writes code and ensures strict TypeScript typings (`npx tsc --noEmit`).
4.  Opens Pull Request (requires 1 review from a senior dev).
5.  QA / Product Owner reviews against Acceptance Criteria using a TestFlight build BEFORE merging.
6.  Merge to `main`.

### 4. Sprint Review & Retrospective (Friday, Week 2)
*   **Demo:** We showcase the completed features. "Completed" means merged to `main` and verifiable in the staging app.
*   **Retro:** What went well? What failed? Were our estimates accurate? We actively update our strategy based on these findings.

---

## Velocity Tracking
We measure our team's Velocity (story points completed per sprint) to accurately forecast when major Epics will be delivered. We do not punish developers for missed estimates; we use the variance to improve future planning.
