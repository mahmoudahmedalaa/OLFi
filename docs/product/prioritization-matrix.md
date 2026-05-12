# OLFi Prioritization Matrix (Impact vs. Effort)

To ensure we build the right features at the right time, we evaluate all pending epics and user stories against a strict Impact vs. Effort matrix. 

*   **Impact (1-10):** How much value does this drive for revenue, user conversion, or critical security compliance?
*   **Effort (1-10):** How many engineering sprints, external dependencies (banks), and UI designs are required?

## Phase 2 Priorities

| Feature / Epic | Impact (1-10) | Effort (1-10) | Ratio | Priority Rank | Justification |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **AECB Integration (Data Fetching)** | 10 | 9 | 1.11 | **High** | Manual debt entry has a 60% drop-off rate. Auto-fetching solves our biggest UX hurdle, despite massive API integration effort. |
| **UAE Pass Auth** | 9 | 6 | 1.50 | **High** | Necessary prerequisite for AECB integration. |
| **Real-time Bank APIs (1st Partner)** | 9 | 8 | 1.12 | **High** | We cannot monetize without a functioning pipeline to at least one bank. |
| **Dark Mode Refinement** | 3 | 2 | 1.50 | **Low** | Nice to have, but doesn't drive core metrics currently. Wait for Phase 3. |

## Phase 3 Priorities

| Feature / Epic | Impact (1-10) | Effort (1-10) | Ratio | Priority Rank | Justification |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Admin Operations Dashboard** | 8 | 7 | 1.14 | **Medium** | Crucial as volume scales to handle manual interventions and tracking. |
| **Premium Subscription Tier** | 6 | 7 | 0.85 | **Medium** | Good secondary revenue source, but primary B2B lead generation (banks) must be stabilized first. |
| **Apple/Google Wallet Export** | 4 | 5 | 0.80 | **Low** | Gimmick for saving the 'approved' offer. Not a blocker for launch. |

---

## Strategy Rules
1.  **Do the High Impact / Low Effort stuff first ("Quick Wins").** (e.g., Simple UI tweaks that boost conversion).
2.  **Commit deeply to High Impact / High Effort ("Major Projects").** (e.g., AECB and Bank APIs).
3.  **Ruthlessly cut Low Impact / High Effort items.** (e.g., Complex custom animations on secondary screens).
