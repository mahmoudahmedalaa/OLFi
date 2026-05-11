# OLFi — Project Configuration

> **Locked values. Do not change without explicit user approval.**

User-facing brand name is **OLFi**. Several technical identifiers still contain `buyout` and are intentionally retained until a dedicated migration is planned.

## Apple Developer

| Key | Value |
|:----|:------|
| Team ID | `2S42RLH67Y` |
| Bundle Identifier | `com.mahmoudahmedalaa.buyout` (legacy technical ID, keep for now) |
| Apple ID (Signing) | `mahmoudahmedalaa@gmail.com` |
| App Store Name | `OLFi` |
| SKU | `buyout` (legacy technical ID, keep unless App Store Connect migration is planned) |

## Supabase

| Key | Value |
|:----|:------|
| Organization | `mahmoudahmedalaa's Org` (ID: `aiidoilaaspbudlpynag`) |
| Project Name | `buyout` (legacy technical ID, keep for now) |
| Region | `ap-south-1` (Mumbai) |
| Project ID | `uivkpqjdoqwgfhvnskaw` |
| API URL | `https://uivkpqjdoqwgfhvnskaw.supabase.co` |
| Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdmtwcWpkb3F3Z2Zodm5za2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzY4MTMsImV4cCI6MjA4NjY1MjgxM30.9v6_69UawDhf4VUhRqPGHh5x13msXDX5ywfg5y_ESCY` |
| Publishable Key | `sb_publishable_cjSYa-mixi6BemxvQ8C0dg_A4Qs4JhK` |

## GitHub

| Key | Value |
|:----|:------|
| Repository | `mahmoudahmedalaa/OLFi` |
| Remote URL | `https://github.com/mahmoudahmedalaa/OLFi.git` |
| Default Branch | `main` |

## Vercel

| Project | Purpose | Notes |
|:--|:--|:--|
| `olfi` | Marketing site from `web/` | Canonical public website |
| `olfi-prototype` | Expo/static prototype | Separate prototype surface |
| `buyout-admin` | Admin dashboard from `admin/` | Legacy Vercel project name, rename later only after deployment settings are reviewed |

## OAuth (Deferred)

| Provider | Status |
|:---------|:-------|
| Google Sign-In | UI built, backend deferred — user will provide Client ID later |
| Apple Sign-In | Capability registered in App ID, Supabase config deferred |
| Email/Password | Active from day one |
