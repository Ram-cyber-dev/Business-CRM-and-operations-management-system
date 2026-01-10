# Product Requirements Document (PRD)

## 1. Goal & Non-Goals

### Goal
To build a multi-tenant CRM for small businesses that allows users to manage Customers, Deals, and Tasks within a Workspace. The system must support role-based access control (RBAC) and provide a dashboard with key metrics.

### Non-Goals
- No external integrations.
- No email marketing features.
- No payment processing.

## 2. Target Users
- **Small Business Owners**: Overview of sales/team.
- **Sales Managers**: Manage pipelines/tasks.
- **Team Members**: Track deals/tasks.

## 3. Roles & Permissions
| Role | Permissions |
| :--- | :--- |
| **Admin** | Full access to workspace settings, invite/remove members, manage all data. |
| **Manager** | View/Edit all Customers, Deals, Tasks. View team stats. Cannot manage settings/members. |
| **Team Member** | View/Edit Customers/Deals/Tasks. Cannot manage settings/members. |

## 4. User Journeys
1.  **Signup/Onboarding**: Sign up -> Create Workspace -> Invite Members.
2.  **Operations**: Login -> Dashboard (Overview) -> Manage Customers/Deals/Tasks.

## 5. Screens & Sidebar Navigation
-   **Dashboard**: Metrics (Total Customers, Active Deals, Pending Tasks, Team Activity).
-   **Customers**: List (Filter by Status), Create/Edit/Delete.
-   **Deals**: List (Group by Stage), Create/Edit/Delete.
-   **Tasks**: List (Filter by Status/Owner), Create/Edit/Complete.
-   **Team**: Member list, Invite (Admin only).
-   **Settings**: Workspace details (Admin only).

## 6. Feature Requirements
-   **Auth**: Supabase Auth (Email/Password).
-   **Workspaces**: Multi-tenant support.
-   **Customers**: Lead, Active, Closed.
-   **Deals**: New, Contacted, Negotiation, Won, Lost. Value, Expected Close Date.
-   **Tasks**: Pending, In Progress, Completed. Assigned To, Linked to Deal/Customer.
-   **Security**: RLS enforced multi-tenancy. Role-based restrictions.

## 7. Acceptance Criteria
-   [ ] User can create multiple workspaces.
-   [ ] User from Workspace A cannot access Workspace B data.
-   [ ] Admin can invite members.
-   [ ] Dashboard reflects accurate counts.
-   [ ] CRUD operations work for all entities.
