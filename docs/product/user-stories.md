# OLFi User Stories & Acceptance Criteria

This document provides a highly specific breakdown of pending features (defined in Epics) into actionable User Stories for developers.

### Epic 2: AECB Integration

**US-AECB-1: UAE Pass Login Option**
*   **As a** UAE Resident,
*   **I want to** log in or sign up using my UAE Pass,
*   **So that** I don't have to manually fill out my Emirates ID and name details.
*   *Acceptance Criteria:*
    1.  Login screen has a prominent "Sign in with UAE Pass" button.
    2.  Tapping it opens the official UAE Pass SafariView / WebView overlay.
    3.  Upon successful return, the `auth.users` table stores the user, and `profiles` is populated with verified name and Emirates ID.
    4.  JWT is updated to reflect verified KYC status.

**US-AECB-2: AECB Consent Capture**
*   **As a** user who just logged in via UAE Pass,
*   **I want to** see a clear, legally compliant consent screen asking to access my credit report,
*   **So that** OLFi can securely fetch my real debts.
*   *Acceptance Criteria:*
    1.  UI must show the exact legal text mandated by AECB.
    2.  User must explicitly check a box (no default check) to "Agree".
    3.  A timestamped record of this consent is saved in a new `user_consents` Supabase table.
    4.  Declining consent falls back to the manual debt entry flow (Epic 1 behavior).

### Epic 3: Partner Bank APIs

**US-BANK-1: Submit Application to Emirates NBD (Example)**
*   **As a** user who has selected an ENBD offer,
*   **I want to** tap "Apply Now" and have my data sent instantly to the bank,
*   **So that** I can get a rapid pre-approval decision.
*   *Acceptance Criteria:*
    1.  Edge function `submit-loan-application` intercepts the request.
    2.  Function formats the payload precisely to the ENBD Swagger spec.
    3.  Handles timeout errors gracefully, showing a "We are experiencing delays, we will notify you" UI state rather than a raw crash.
    4.  Updates `applications.status` to `pending_bank_review`.

### Epic 4: Admin Dashboard

**US-ADMIN-1: View Pending Applications**
*   **As an** internal OLFi Operations Manager,
*   **I want to** see a list of all `pending` applications in a web dashboard,
*   **So that** I can manually follow up with banks if APIs fail.
*   *Acceptance Criteria:*
    1.  Web UI requires an Admin-role JWT to access.
    2.  List is sortable by application date and amount requested.
    3.  Clicking a row shows the user's completely anonymized debt profile (no PII displayed unless explicitly clicking a "Reveal Details" secondary action, which is logged for security audits).
