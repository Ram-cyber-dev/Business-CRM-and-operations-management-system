-- Enable RLS on all tables
alter table profiles enable row level security;
alter table workspaces enable row level security;
alter table workspace_members enable row level security;
alter table customers enable row level security;
alter table deals enable row level security;
alter table tasks enable row level security;

-- Helper Functions
create or replace function is_workspace_member(_workspace_id uuid)
returns boolean as $$
begin
  return exists (
    select 1
    from workspace_members
    where workspace_id = _workspace_id
    and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

create or replace function is_workspace_admin(_workspace_id uuid)
returns boolean as $$
begin
  return exists (
    select 1
    from workspace_members
    where workspace_id = _workspace_id
    and user_id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Profiles
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Workspaces
create policy "Users can view their workspaces" on workspaces
  for select using (
    exists (
      select 1 from workspace_members
      where workspace_id = workspaces.id
      and user_id = auth.uid()
    )
  );

create policy "Users can create workspaces" on workspaces
  for insert with check (true);

-- Workspace Members
create policy "Users can view members of their workspaces" on workspace_members
  for select using (
    is_workspace_member(workspace_id)
  );

create policy "Users can join a workspace as initial admin" on workspace_members
  for insert with check (user_id = auth.uid() and role = 'admin');

create policy "Admins can insert members" on workspace_members
  for insert with check (is_workspace_admin(workspace_id));

create policy "Admins can update members" on workspace_members
  for update using (is_workspace_admin(workspace_id));

create policy "Admins can delete members" on workspace_members
  for delete using (is_workspace_admin(workspace_id));

-- Customers
create policy "Users can view customers in their workspace" on customers
  for select using (is_workspace_member(workspace_id));

create policy "Users can insert customers in their workspace" on customers
  for insert with check (is_workspace_member(workspace_id));

create policy "Users can update customers in their workspace" on customers
  for update using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

create policy "Admins can delete customers" on customers
  for delete using (is_workspace_admin(workspace_id));

-- Deals
create policy "Users can view deals in their workspace" on deals
  for select using (is_workspace_member(workspace_id));

create policy "Users can insert deals in their workspace" on deals
  for insert with check (is_workspace_member(workspace_id));

create policy "Users can update deals in their workspace" on deals
  for update using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

create policy "Admins can delete deals" on deals
  for delete using (is_workspace_admin(workspace_id));

-- Tasks
create policy "Users can view tasks in their workspace" on tasks
  for select using (is_workspace_member(workspace_id));

create policy "Users can insert tasks in their workspace" on tasks
  for insert with check (is_workspace_member(workspace_id));

create policy "Users can update tasks in their workspace" on tasks
  for update using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

create policy "Admins can delete tasks" on tasks
  for delete using (is_workspace_admin(workspace_id));
