# Database Schema & Security

> **Warning:** The schema is LOCKED. Do not modify without high-level authorization.

## Core Tables

### 1. `profiles`
- **Purpose:** Extends Supabase Auth users.
- **Fields:** `id` (PK, ref auth.users), `full_name`, `email`.
- **Security:** Users can read/update their own profile.

### 2. `workspaces`
- **Purpose:** The tenant container.
- **Fields:** `id` (PK), `name`.
- **Security:** Accessed via `workspace_members`.

### 3. `workspace_members`
- **Purpose:** Links users to workspaces (Many-to-Many).
- **Fields:** `workspace_id` (PK), `user_id` (PK), `role` ('admin', 'member').
- **Security:** RLS allows users to see their own memberships.

### 4. `customers`
- **Purpose:** People/Companies being tracked.
- **Fields:** `id`, `workspace_id`, `name`, `email`, `phone`, `status`.
- **Links:** Belongs to `workspaces`.

### 5. `deals`
- **Purpose:** Sales opportunities.
- **Fields:** `id`, `workspace_id`, `customer_id`, `title`, `value`, `stage`, `expected_close_date`.
- **Links:** Belongs to `workspaces`. Linked to `customers`.

### 6. `tasks`
- **Purpose:** To-do items.
- **Fields:** `id`, `workspace_id`, `assigned_to`, `status`, `deal_id`, `customer_id`.
- **Constraint:** Polymorphic link (Must link to `deal_id` OR `customer_id`).
- **Links:** Belongs to `workspaces`.

---

## Row Level Security (RLS) Model

**The Golden Rule:**
> "A user can only select/insert/update rows where `workspace_id` matches a workspace they are a member of."

### Helper Function
We use a Postgres function `is_workspace_member(workspace_id)` in our policies to check membership efficiently.

### Policies
- **SELECT:** `is_workspace_member(workspace_id)`
- **INSERT:** `is_workspace_member(workspace_id)`
- **UPDATE:** `is_workspace_member(workspace_id)`
- **DELETE:**
  - **Admins:** Allowed if `is_workspace_admin(workspace_id)`.
  - **Members:** DENIED.

**Future Agents:** NEVER bypass RLS. If a query returns no data, check the RLS policy first.
