# Tech Stack

## Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (based on Radix UI)
- **Icons:** Lucide React

## Backend & Database
- **Platform:** Supabase
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth
- **Data Access:**
    - **Server Components:** `supabase-js` (with cookie handling)
    - **Server Actions:** `supabase-js` (for mutations)
- **Logic Layer:** minimal; driven by Server Actions and DB policies.

## Deployment
- **Host:** Vercel (planned/compatible)
- **Environment:** Node.js runtime for Server Actions.

## Execution Model
- **Client-Side:** Interactive forms, Sidebar (active state), Tables (minimal interactivity).
- **Server-Side:** Data fetching, Mutations (Server Actions), RLS enforcement, Authentication checks.
