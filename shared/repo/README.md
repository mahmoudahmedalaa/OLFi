# OLFI — UAE Refinance Marketplace

Sharia-compliant debt refinancing platform for UAE residents. Built with Next.js 15, PostgreSQL, Prisma, and JWT auth. Features an iPhone 17 demo frame with 15 app screens.

## Prerequisites

- Node.js 18+
- A PostgreSQL database (free tier at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com))

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/olfi?sslmode=require"
JWT_SECRET="run: openssl rand -base64 32"
NODE_ENV="development"
```

Generate a JWT secret:

```bash
openssl rand -base64 32
```

### 3. Set up the database

```bash
npm run db:generate   # generate Prisma client
npm run db:push       # create tables
npm run db:seed       # seed demo data
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo login

Use any UAE phone number (e.g. `+971501234567`). The OTP is always **`538219`**.

## Screens

| Screen | Description |
|---|---|
| Welcome | 4 story slides with language picker |
| Sign Up | Phone number entry |
| OTP | 6-digit code (always 538219) |
| KYC ID | Emirates ID upload |
| KYC Face | Face scan |
| Open Banking | Connect bank accounts |
| Dashboard | OLFI score, debt overview, opportunities |
| Debt Detail | Individual debt breakdown |
| Marketplace | Islamic finance offers (DIB, ADIB, FAB, EI) |
| Offer Detail | Product details: Murābaḥa, Tawarruq, Ijāra |
| Apply Status | Application submitted confirmation |
| Applications | All applications with status filters |
| App Detail | Active loan repayment schedule |
| Score | OLFI vs CBUAE score, factor breakdown |
| Profile | Account settings, language, logout |

## Tech stack

- **Next.js 15** — App Router, API routes
- **TypeScript** — strict
- **Tailwind CSS** — utility styling
- **Prisma + PostgreSQL** — database
- **JWT (jose)** — auth via httpOnly cookies
- **Plus Jakarta Sans** — brand font

## Development

```bash
npm run db:studio     # Prisma Studio (visual DB browser)
npm run build         # production build
npm run lint          # ESLint
```
