# Vercel Deployment Guide 🚀

Follow this step-by-step guide to deploy your CRM to production.

## Prerequisites
- A [Vercel Account](https://vercel.com).
- A [GitHub Account](https://github.com) (where your code is pushed).
- Your **Supabase URL** and **Anon Key** (from `.env.local` or Supabase Dashboard).

## Step 1: Connect to Vercel
1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select **"Continue with GitHub"**.
4.  Search for your repository: `Business-CRM-and-operations-management-system`.
5.  Click **"Import"**.

## Step 2: Configure Project
Vercel will auto-detect "Next.js". You don't need to change build commands.

**CRITICAL: Environment Variables**
You MUST verify these. The app will fail without them.

1.  Expand the **"Environment Variables"** section.
2.  Add the following keys (copy values from your local `.env.local`):

    | Key | Value |
    | :--- | :--- |
    | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-long-anon-key-string` |

3.  **Note:** You do NOT need `service_role` keys here.
4.  Typically, `NEXT_PUBLIC_` variables are available to the browser. This is correct for Supabase Auth.

## Step 3: Deploy
1.  Click **"Deploy"**.
2.  Wait for the build (usually 1-2 minutes).
3.  If successful, you will see a confetti screen! 🎉

## Step 4: Post-Deployment Setup (Supabase)
Your production app changes its URL (e.g., `https://my-crm.vercel.app`).
You need to tell Supabase to allow logins from this new URL.

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Navigate to **Authentication** -> **URL Configuration**.
3.  **Site URL**: Change this to your Vercel URL (e.g., `https://my-crm.vercel.app`).
4.  **Redirect URLs**: Add `https://my-crm.vercel.app/**`.
    - *Tip:* Adding `/**` is a wildcard that usually covers callback URLs.

## Troubleshooting

### "Auth fails after deploy"
- Did you update the **Site URL** in Supabase?
- Did you set the **Environment Variables** in Vercel?

### "404 on Dashboard"
- Ensure your `middleware.ts` is running (Vercel handles this automatically for Next.js).

### "Build Failed"
- Check the Vercel logs.
- Common issue: TypeScript errors. (We ran a clean build locally, so this should not happen).

---

**Done! Share your URL with your team.** 🌍
