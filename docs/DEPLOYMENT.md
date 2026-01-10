# Deployment Guide

## 1. Environment Setup (Vercel)
1.  Import project from GitHub.
2.  Set Environment Variables:
    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    -   `NEXT_PUBLIC_APP_URL` (Production URL)

## 2. Supabase Setup
1.  Create Project.
2.  Run `db/schema.sql` in SQL Editor.
3.  Run `db/rls_policies.sql` in SQL Editor.
4.  (Optional) Run `db/seed.sql`.

## 3. Build & Verify
1.  Run `npm run build` locally to ensure no TS errors.
2.  Deploy to Vercel (Push to main).
3.  Check Vercel logs for build success.

## 4. Post-Deploy Smoke Test
-   [ ] URL loads.
-   [ ] Login works.
-   [ ] Dashboard creates data.
-   [ ] No 500 errors on navigation.
