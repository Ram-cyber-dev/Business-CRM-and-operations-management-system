# Development Phases

This project follows a strict phased implementation plan.

## Status Legend
- **[LOCKED]**: Completed, Verified, and MUST NOT be modified without high-level approval.
- **[ACTIVE]**: Currently being developed.
- **[PENDING]**: Future work.

---

## Phase 0: Planning & Design [LOCKED]
- Defined Database Schema
- Defined RLS Policies
- Designed UI/UX System

## Phase 1: Auth & Workspace Bootstrap [LOCKED]
- Authentication (Login/Signup)
- Multi-tenancy setup (Workspaces)
- Onboarding Flow (`/onboarding`)
- Initial RLS setup

## Phase 2: Customers Module [LOCKED]
- Sidebar Route: `/dashboard/customers`
- List View (Table)
- Add/Edit/Delete (Admin only for delete)

## Phase 3: Deals Module [LOCKED]
- Sidebar Route: `/dashboard/deals`
- Deal Pipeline Tracking
- Customer Linking
- Currency & Stage Management

## Phase 4: Tasks Module [LOCKED]
- Sidebar Route: `/dashboard/tasks`
- Polymorphic Linking (Deal OR Customer)
- Assignment Logic
- Overdue Tracking

## Phase 5: Dashboard Metrics [LOCKED]
- **Current State:** COMPLETED.
- Metric Cards (Totals)
- Visual Breakdowns
- Overdue Alerts

## Phase 6: Deployment & Polish [PENDING]
- Production Builds
- Smoke Testing
- Environment Variable cleanup

---

**CRITICAL RULE:** Do not modify code belonging to a LOCKED phase unless you are fixing a critical bug (e.g., security vulnerability). Focus your efforts on ACTIVE or PENDING phases.
