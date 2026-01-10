# Authentication & Roles

## Roles
The system supports two rigidly defined roles within a workspace:

### 1. `admin`
- **Capabilities:**
  - Full Read/Write access.
  - Can **DELETE** Customers, Deals, and Tasks.
  - Can invite new members (future feature).
  - Can delete the workspace (future feature).

### 2. `member`
- **Capabilities:**
  - Read/Write access (Create, Edit).
  - **Cannot DELETE** anything.
  - Cannot change workspace settings.

## Authentication Flow
1.  **Login:** User enters credentials (`/login`).
2.  **Redirect:** Success -> `/dashboard`.
3.  **Onboarding Intercept:**
    - If user has NO workspace memberships -> Redirect to `/onboarding`.
    - User creates workspace -> System assigns `admin` role -> Redirect to `/dashboard`.

## Security Implementation
- **Frontend checks:** (`if role === 'admin'`) are for **UX ONLY** (e.g., hiding the Delete button).
- **Backend enforcement:** RLS policies explicitly `CHECK (role = 'admin')` for destructive operations.

**Rule:** Never trust the frontend role for security. Always rely on RLS.
