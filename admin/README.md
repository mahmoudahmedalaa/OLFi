# OLFi Admin Dashboard

Internal Next.js dashboard for OLFi operations.

## Role

Use this app for internal operational surfaces such as users, waitlist, banks, loans, offers, applications, analytics, notifications, and document/admin workflows.

This is separate from:

- `app/`: canonical mobile app.
- `web/`: public marketing site.
- Vercel `olfi-prototype`: prototype surface.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` unless another local app is already using that port.

## Deployment

The current Vercel project is still named `buyout-admin`. This is a legacy deployment name. Rename/relink only after reviewing project settings and environment variables.

## Guardrails

- Do not import mobile app code directly from `app/`.
- Do not treat `shared/repo` as a source of truth.
- Keep admin-only Supabase behavior in `admin/lib/` or admin app routes/actions.
