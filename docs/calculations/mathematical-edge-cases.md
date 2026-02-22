# BuyOut Mathematical Edge Cases & Precision Rules

Because BuyOut deals directly with user debt and bank loans, mathematical precision is our highest priority. Miscalculating an EMI by even a few fils can lead to trust issues or legal compliance failures with UAE banking standards.

## Rule 1: The "No Float" Doctrine
JavaScript uses double-precision 64-bit format IEEE 754 for numbers, meaning `0.1 + 0.2 === 0.30000000000000004`. 
*   **Action:** We NEVER use floats or decimals to represent currency amounts in state, calculation logic, or the database.
*   **Fils Pattern:** All UAE Dirham (AED) amounts are converted to Fils (1 AED = 100 Fils) as integers at the boundaries.
    *   *Input:* User types `150.50` -> UI multiplies by 100 -> Store saves `15050`.
    *   *Display:* Component reads `15050` -> Divides by 100 -> Displays `150.50` using `Intl.NumberFormat`.

## Rule 2: Interest Rates (Basis Points)
Interest rates are not stored as floats (e.g., `0.0499` for 4.99%). They are stored as **Basis Points (BPS)** where 1 BPS = 0.01%.
*   *Flat Rate 4.99%* -> Stored as `499`.
*   *Reducing Rate 8.5%* -> Stored as `850`.
This allows all intermediate EMI calculations to remain entirely integer-based before final division.

## Rule 3: Leap Years & Day-based Interest
While most of our high-level projections use standard Monthly EMI formulas (assuming 12 equal months), certain auto loans compute interest daily.
*   **Formula Fallback:** For pure projections in `calculate-savings-engine`, we use the standard flat/reducing amortization formula. 
*   **Bank API Override:** If a partner Bank API returns a specific `calculated_emi` based on their proprietary actual/365 leap-year adjusted engine, WE ALWAYS DEFER to the Bank API's number. The Bank is the ultimate source of truth.

## Rule 4: Rounding Strategy
*   Whenever a division occurs that results in fractional fils (e.g., `15050.334`), we apply **Banker's Rounding** (Round half to even).
*   However, for rendering "Total Projected Savings" to the user, we strictly `Math.floor()` to avoid accidentally over-promising savings by even 1 Dirham. Under-promise, over-deliver.
