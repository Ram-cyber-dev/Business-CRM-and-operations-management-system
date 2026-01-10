# Business CRM & Operations System
> A Multi-Tenant CRM built with Next.js 14, Supabase (Auth + Postgres + RLS), and Tailwind CSS.

## 🚀 Features

### Phase 1: Authentication & Workspaces
- [x] **Multi-Tenancy**: Data strictly isolated by `workspace_id`.
- [x] **Authentication**: Secure Login/Signup via Supabase Auth.
- [x] **Onboarding**: Auto-create workspace and assign Admin role.
- [x] **Role-Based Access**: Admins (can delete) vs Members (read/write).

### Phase 2: Customers
- [x] **Customer Management**: Add, Edit, Delete (Admin only) customers.
- [x] **Status Tracking**: Lead / Active / Closed.
- [x] **Validation**: Strong schema validation with Zod.

### Phase 3: Deals
- [x] **Pipeline Management**: Track deals by stage (New -> Won/Lost).
- [x] **Customer Linking**: Associate deals with existing customers.
- [x] **Value Tracking**: Currency formatting and close dates.

### Phase 4: Tasks
- [x] **Task Tracking**: Assign tasks to team members.
- [x] **Polymorphic Linking**: Link a task to EITHER a Deal OR a Customer.
- [x] **Smart Forms**: Dynamic dropdowns and validation.
- [x] **Overdue Tracking**: Highlight missed deadlines.

### Phase 5: Dashboard
- [x] **Real-time Metrics**: Total counts for Customers, Deals, Tasks.
- [x] **Visual Breakdowns**: Progress bars for Deals by Stage and Tasks by Status.
- [x] **Alerts**: Prominent count of Overdue Tasks.

## 🛠 Tech Stack
- **Framework**: Next.js 14 (App Router, Server Actions)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Middleware protected)
- **Styling**: Tailwind CSS + Shadcn UI (Custom Components)
- **Icons**: Lucide React
- **Validation**: Zod

## 🏃‍♂️ Getting Started

1. **Clone & Install**
   ```bash
   git clone <repo>
   npm install
   ```

2. **Environment Setup**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Database Setup**
   Run the SQL scripts in `db/` in your Supabase SQL Editor:
   1. `db/schema.sql` (Tables & RLS)
   2. `db/rls_policies.sql` (Security Policies)

4. **Run Locally**
   ```bash
   npm run dev
   ```

## 🔒 Security Model (RLS)
All tables (`customers`, `deals`, `tasks`) have Row Level Security enabled.
- **SELECT/INSERT/UPDATE**: Allowed if `workspace_id` matches user's workspace.
- **DELETE**: Only allowed if user has `role = 'admin'` in `workspace_members`.

---
*Built with ❤️ by Antigravity*
