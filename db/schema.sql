-- Profiles Table (Extends Supabase Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  email text not null,
  created_at timestamptz default now()
);

-- Workspaces Table
create table workspaces (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

-- Workspace Members Table (Many-to-Many)
create table workspace_members (
  workspace_id uuid references workspaces(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text check (role in ('admin', 'manager', 'member')) not null default 'member',
  joined_at timestamptz default now(),
  primary key (workspace_id, user_id)
);

-- Customers Table
create table customers (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  status text check (status in ('Lead', 'Active', 'Closed')) default 'Active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Deals Table
create table deals (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete cascade not null,
  title text not null,
  value numeric not null default 0,
  stage text check (stage in ('New', 'Contacted', 'Negotiation', 'Won', 'Lost')) default 'New',
  expected_close_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tasks Table
create table tasks (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  status text check (status in ('Pending', 'In Progress', 'Completed')) default 'Pending',
  assigned_to uuid references profiles(id) on delete set null,
  deal_id uuid references deals(id) on delete cascade,
  customer_id uuid references customers(id) on delete cascade,
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint tasks_must_link_to_deal_or_customer check (deal_id is not null or customer_id is not null)
);

-- Indexes for Performance
create index idx_workspace_members_user on workspace_members(user_id);
create index idx_customers_workspace on customers(workspace_id);
create index idx_deals_workspace on deals(workspace_id);
create index idx_tasks_workspace on tasks(workspace_id);
create index idx_tasks_assigned_to on tasks(assigned_to);
