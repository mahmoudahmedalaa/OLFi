# BuyOut Consolidation Engine Logic

The `calculate-savings-engine` Edge Function is the heart of BuyOut. This document explains the algorithmic steps taken when a user hits "Calculate Savings".

## Input State
The Engine receives an array of `DebtItem` objects:
```json
[
  { "type": "credit_card", "balanceFils": 5000000, "emiFils": 250000 },
  { "type": "personal_loan", "balanceFils": 15000000, "emiFils": 450000, "tenureRemaining": 36 }
]
```

## Step 1: Current State Aggregation
1.  **Total Current Debt:** Sum of all `balanceFils`. (e.g., 200,000 AED)
2.  **Total Current Monthly EMI:** Sum of all `emiFils`. (e.g., 7,000 AED)
3.  **Total Cost to Finish:** For fixed-term loans, `emiFils * tenureRemaining`. For credit cards (which revolve), we apply a proprietary projection assuming a 36-month payoff at 3% minimum payment.

## Step 2: Bank Product Filtering
The engine fetches all `bank_products` from the database.
*   *Filter 1 (Regulatory):* Does `Total Current Debt` exceed 20x the user's `monthlySalary`? If yes, Central Bank of UAE rules prohibit a new personal loan. Return `Ineligible Error`.
*   *Filter 2 (Bank Rules):* Exclude bank products where the required loan amount is below their minimum threshold (e.g., minimum loan 10,000 AED).

## Step 3: Simulation Loop (The Core)
For every valid `bank_product`, the engine simulates an exact payout:

1.  **Principal:** `Total Current Debt` + `Processing Fee (e.g. 1%)`.
2.  **Amortization Schedule:** Iterates through allowable tenures (12, 24, 36, 48 months).
3.  **EMI Calculation:** Standard reducing balance formula. 
    `EMI = [P x R x (1+R)^N]/[(1+R)^N-1]` 
    *(Where P = Principal, R = Monthly Interest Rate, N = Tenure in months)*
4.  **Savings Check:** `Monthly Savings = Total Current Monthly EMI - New Simulated EMI`.
    If Monthly Savings <= 0, the offer is discarded. We only show strictly beneficial offers.

## Step 4: Sorting and Rendering
The array of successful simulations is sorted descending by `Total Saving Over Tenure`. The Top 3 results are returned to the React Native client to populate the `OfferCard` components.
