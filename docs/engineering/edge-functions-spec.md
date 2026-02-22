# BuyOut Supabase Edge Functions Specification

BuyOut utilizes Supabase Edge Functions (Deno backend environments) to execute complex, secure financial logic that should not reside on the client device. This prevents manipulation of interest rates, secures API keys for third-party banking integrations, and ensures calculating engines operate in a trusted environment.

## General Architecture & Rules

1.  **Deno Runtime:** All functions are written in TypeScript using the Deno runtime.
2.  **JWT Verification by Default:** Every function is isolated behind an Authorization header check. The requester MUST provide a valid Supabase JWT Bearer token payload.
    *   We use `verify_jwt: true` for almost everything.
3.  **CORS:** All functions must respond to `OPTIONS` preflight requests with standard CORS headers to allow the React Native (or Web) frontend to communicate with them.
4.  **Error Handling:** Always return structured JSON errors with correct HTTP status codes (e.g., `400 Bad Request` for invalid inputs, `401 Unauthorized` for bad JWTs, `500 Internal Server Error` for unhandled exceptions).

---

## Deployed Functions Inventory

### 1. `calculate-savings-engine`

**Purpose:** The core algorithmic engine. It takes a user's current array of debts, compares them against all active `bank_products`, and calculates the absolute optimal monthly and total savings for various tenures.

**Endpoint:** `POST /functions/v1/calculate-savings-engine`

**Request Payload:**
```json
{
  "monthlySalaryFils": 2500000,
  "currentDebts": [
    {
      "type": "personal_loan",
      "outstandingBalanceFils": 15000000,
      "currentEmiFils": 450000,
      "remainingTenureMonths": 36
    }
  ],
  "targetTenureMonths": 48 // Optional override, defaults to maximum allowable by UAE law (48)
}
```

**Response Payload (200 OK):**
```json
{
  "status": "success",
  "data": {
    "totalCurrentDebtFils": 15000000,
    "totalCurrentEmiFils": 450000,
    "recommendedOffers": [
      {
        "bankProductId": "uuid-1234",
        "bankName": "Emirates NBD",
        "newEmiFils": 345000,
        "monthlySavingsFils": 105000,
        "totalSavingsOverTenureFils": 5040000,
        "interestRateBps": 499,
        "processingFeeFils": 150000
      }
    ]
  }
}
```

**Security Notes:** This function *could* run securely without auth if it doesn't write to the DB, but we require Auth to prevent DDoS / rate-limiting abuse of our calculation engine.

---

### 2. `submit-loan-application`

**Purpose:** Takes the user's selected offer and submits a formal application. This involves writing to the secure `applications` table and (in the future) formatting an XML/JSON payload to send directly to the Partner Bank's secure API.

**Endpoint:** `POST /functions/v1/submit-loan-application`

**Request Payload:**
```json
{
  "bankProductId": "uuid-1234",
  "requestedTenureMonths": 48,
  "totalConsolidatedAmountFils": 15000000
}
```

**Response Payload (200 OK):**
```json
{
  "status": "success",
  "applicationId": "uuid-9876",
  "message": "Application submitted successfully to Emirates NBD."
}
```

**Security Context:**
*   The function securely extracts the `user_id` from the verified JWT (e.g., `req.user.id`). IT NEVER trusts a `user_id` passed in the JSON payload (prevents user A from submitting an application on behalf of user B).
*   Double-checks the mathematics. It recalculates the EMI on the server to ensure the client-side app hasn't been tampered with to show a highly favorable, incorrect EMI.

---

## Developing & Deploying Edge Functions

**To create a new function locally:**
```bash
supabase functions new function-name
```

**To test locally from the frontend:**
Change your `SUPABASE_URL` in your `.env` to your local Docker instance (usually `http://127.0.0.1:54321`) and ensure you are passing the Authorization token.

**To deploy to production:**
```bash
supabase functions deploy function-name --project-ref your-project-ref
```
