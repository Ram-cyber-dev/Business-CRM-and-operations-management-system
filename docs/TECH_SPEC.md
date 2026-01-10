# Technical Specification

## 1. Stack & Architecture
-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS + shadcn/ui
-   **Database**: Supabase (PostgreSQL)
-   **Auth**: Supabase Auth
-   **Deployment**: Vercel

## 2. Infrastructure & Data Model

### Data Relationships
-   **Workspaces**: Root entity. All other entities belong to a workspace.
-   **Profiles**: User profile data, strictly 1:1 with `auth.users`.
-   **Workspace Members**: Many-to-Many between Profiles and Workspaces (with Role).
-   **Customers**: Belongs to Workspace.
-   **Deals**: Belongs to Workspace + Customer.
-   **Tasks**: Belongs to Workspace + (Customer OR Deal) + (Assigned User).

### Security (RLS) Strategy
-   **Enforcement**: RLS enabled on ALL tables.
-   **Tenant Isolation**: `workspace_id` check is mandatory on every SELECT/INSERT/UPDATE/DELETE.
-   **Role Logic**:
    -   `admin`: Full access.
    -   `manager`: Can edit operational data, cannot manage workspace.
    -   `member`: Can edit operational data (simplified for MVP), cannot manage workspace.

### API Strategy
-   **Server Actions**: For all mutations (Form submissions).
-   **Supabase Client (SSR)**: For data fetching in Server Components.

## 3. Folder Structure Proposal
```
/app
  /(auth)
    /login
    /signup
  /dashboard
    /layout.tsx (Sidebar)
    /page.tsx (Metrics)
    /customers/...
    /deals/...
    /tasks/...
    /team/...
    /settings/...
  /api/... (if needed)
/components
  /ui (shadcn)
  /shared (Sidebar, StatCard)
  /forms (CustomerForm, DealForm)
/lib
  supabase.ts
  utils.ts
/types
  index.ts (Database generated types)
```

## 4. Route Map
-   `/login`
-   `/signup`
-   `/onboarding` (Create initial workspace)
-   `/dashboard` (Overview)
-   `/dashboard/customers`
-   `/dashboard/customers/[id]`
-   `/dashboard/deals`
-   `/dashboard/tasks`
-   `/dashboard/team`
-   `/dashboard/settings`
