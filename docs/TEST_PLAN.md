# Test Plan

## 1. Manual Test Checklist

### Authentication & Onboarding
- [ ] Sign up with a new email.
- [ ] Redirect to `/onboarding` if no workspace exists.
- [ ] Create a new workspace -> User becomes Admin.
- [ ] Auto-redirect to Dashboard after workspace creation.

### Workspace & Members
- [ ] Admin can invite a member (by email).
- [ ] Invited user can log in and see the workspace.
- [ ] Admin can remove a member.
- [ ] Verify Member cannot access Settings.

### Cross-Tenant Isolation
- [ ] Create User A (Workspace A) and User B (Workspace B).
- [ ] User A creates Customer A.
- [ ] User B logs in. Verify Customer A is NOT visible.
- [ ] User A logs in. Verify Customer A IS visible.

### Customers CRUD
- [ ] Create Customer (filled fields).
- [ ] Edit Customer.
- [ ] Delete Customer.
- [ ] List View filters work (e.g., search by name).

### Deals CRUD
- [ ] Create Deal linked to Customer.
- [ ] Change Deal Stage (drag/drop or dropdown).
- [ ] Verify Deal Value sums in Dashboard.

### Tasks CRUD
- [ ] Create Task.
- [ ] Assign Task to Member.
- [ ] Mark Task as Completed.

### Dashboard
- [ ] Check "Total Customers" count matches DB.
- [ ] Check "Active Deals" value matches DB.
