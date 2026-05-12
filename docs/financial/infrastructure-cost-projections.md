# OLFi Infrastructure Cost Projections

As a FinTech app, we expect high computational bursts (during edge function calculation engines) but relatively low overall storage requirements initially.

## Phase 1/2: Bootstrapping & MVP (0 - 5,000 MAU)

We heavily leverage Supabase's generous Pro tier.

*   **Supabase (Pro Plan):** $25 / month
    *   Includes 100K MAU (Auth).
    *   Includes 8GB Database size (We use ~10KB per user profile, giving us headroom for >500k users).
    *   Includes 2 million Edge Function invocations (More than enough for early recalculation engine hits).
*   **Vercel / Netlify:** $0 - $20 / month (For hosting marketing site / admin dashboard).
*   **Apple Developer Program:** $99 / year.

**Total Est. Monthly Infrastructure:** ~$45 / month.

## Phase 3: Scaling (10,000 - 50,000 MAU)

As user volume increases, specifically hitting the `calculate-savings-engine` frequently, we will need to optimize or scale the compute instance.

*   **Supabase (Pro Custom / Enterprise):** ~$150 - $300 / month
    *   Upgrading the Postgres Compute instance (from Micro to Small) to handle complex concurrent aggregation queries faster.
    *   Read Replicas (Optional) if global latency becomes an issue, though primarily UAE-focused means single region (AWS me-central-1) is ideal.
*   **AECB API Costs:** Variable (High). This will be the largest variable cost. If AECB charges per credit pull, we must artificially rate-limit how often a user can hit the "Refresh Score" button unless they are on a Premium Tier.
*   **Analytics (PostHog):** $50 / month (Assuming event volume crosses free tier).

**Total Est. Monthly Infrastructure:** ~$300 - $500 / month (excluding raw AECB API fees).
