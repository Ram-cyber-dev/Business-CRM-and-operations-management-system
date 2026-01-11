# 📧 Email Confirmation Fix

If your email confirmation link redirects you to `localhost:3000` instead of your Vercel app, it means your Supabase Authentication settings are not fully configured for production.

## The Fix

1.  **Go to Supabase Dashboard:**
    - Navigate to your project.
    - Click on **Authentication** (Key icon) in the left sidebar.
    - Click on **URL Configuration**.

2.  **Update Site URL:**
    - **Current Value:** `http://localhost:3000` (Likely)
    - **New Value:** `https://your-project-name.vercel.app` (Copy this from your Vercel validation)

3.  **Update Redirect URLs:**
    - Ensure you have the following in the "Redirect URLs" list:
        - `http://localhost:3000/**` (Keep this for local testing)
        - `https://your-project-name.vercel.app/**` (Add this for production)

4.  **Save Changes.**

## Why this happens
Supabase sends the confirmation link based on the "Site URL" setting. If it's set to localhost, the email link will point to localhost. When you are on a deployed site (or incognito), `localhost` refers to *that specific computer*, which isn't running your server.

**Once updated, try signing up with a NEW email address. The new link will work.**
