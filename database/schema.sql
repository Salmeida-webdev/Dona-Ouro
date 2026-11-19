-- Schema compatível com Cloudflare D1 / SQLite.
create table if not exists workspaces (
  id text primary key,
  name text not null,
  city text,
  segment text,
  logo_url text,
  created_at text not null default (datetime('now'))
);

create table if not exists profiles (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'member',
  avatar_url text,
  active integer not null default 1,
  created_at text not null default (datetime('now'))
);

create table if not exists customers (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  status text not null default 'active',
  tags text not null default '[]',
  notes text,
  last_visit_at text,
  next_step text,
  total_spent real not null default 0,
  visits_count integer not null default 0,
  created_at text not null default (datetime('now'))
);

create table if not exists services (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  name text not null,
  category text,
  duration_minutes integer not null default 60,
  price real not null default 0,
  active integer not null default 1,
  created_at text not null default (datetime('now'))
);

create table if not exists appointments (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  customer_id text references customers(id) on delete set null,
  service_id text references services(id) on delete set null,
  professional_id text references profiles(id) on delete set null,
  starts_at text not null,
  ends_at text not null,
  status text not null default 'scheduled',
  notes text,
  created_at text not null default (datetime('now'))
);

create table if not exists transactions (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  appointment_id text references appointments(id) on delete set null,
  description text not null,
  detail text,
  type text not null check (type in ('income', 'expense')),
  amount real not null,
  occurred_on text not null default (date('now')),
  created_at text not null default (datetime('now'))
);

create table if not exists tasks (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  customer_id text references customers(id) on delete set null,
  title text not null,
  due_at text,
  priority text not null default 'medium',
  completed integer not null default 0,
  created_at text not null default (datetime('now'))
);

create table if not exists analytics_snapshots (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  period_start text not null,
  period_end text not null,
  revenue real not null default 0,
  appointments_count integer not null default 0,
  retention_rate real,
  occupancy_rate real,
  average_ticket real,
  cancellation_rate real,
  nps real,
  created_at text not null default (datetime('now'))
);

-- Identidade, papéis, permissões e sessões para a evolução do modo demo.
create table if not exists permissions (
  id text primary key,
  permission_key text not null unique,
  description text not null,
  created_at text not null default (datetime('now'))
);

create table if not exists roles (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  name text not null,
  role_key text not null,
  description text,
  is_system integer not null default 1,
  created_at text not null default (datetime('now')),
  unique(workspace_id, role_key)
);

create table if not exists role_permissions (
  role_id text not null references roles(id) on delete cascade,
  permission_id text not null references permissions(id) on delete cascade,
  created_at text not null default (datetime('now')),
  primary key (role_id, permission_id)
);

create table if not exists auth_users (
  id text primary key,
  email text not null unique collate nocase,
  password_hash text,
  password_salt text,
  password_algorithm text not null default 'PBKDF2-SHA-256',
  password_iterations integer not null default 100000,
  status text not null default 'pending' check (status in ('pending', 'active', 'blocked')),
  must_change_password integer not null default 1,
  last_login_at text,
  created_at text not null default (datetime('now')),
  updated_at text not null default (datetime('now'))
);

create table if not exists workspace_members (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  auth_user_id text not null references auth_users(id) on delete cascade,
  profile_id text references profiles(id) on delete set null,
  role_id text not null references roles(id),
  status text not null default 'active' check (status in ('invited', 'active', 'suspended')),
  created_at text not null default (datetime('now')),
  unique(workspace_id, auth_user_id)
);

create table if not exists sessions (
  id text primary key,
  auth_user_id text not null references auth_users(id) on delete cascade,
  workspace_id text not null references workspaces(id) on delete cascade,
  token_hash text not null unique,
  expires_at text not null,
  revoked_at text,
  last_seen_at text not null default (datetime('now')),
  created_at text not null default (datetime('now')),
  user_agent text
);

create table if not exists audit_logs (
  id text primary key,
  workspace_id text not null references workspaces(id) on delete cascade,
  actor_user_id text references auth_users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata text not null default '{}',
  created_at text not null default (datetime('now'))
);

create index if not exists customers_workspace_idx on customers(workspace_id);
create index if not exists appointments_workspace_date_idx on appointments(workspace_id, starts_at);
create index if not exists transactions_workspace_date_idx on transactions(workspace_id, occurred_on);
create index if not exists tasks_workspace_status_idx on tasks(workspace_id, completed);
create index if not exists analytics_workspace_period_idx on analytics_snapshots(workspace_id, period_start, period_end);
create index if not exists roles_workspace_idx on roles(workspace_id);
create index if not exists members_workspace_idx on workspace_members(workspace_id, status);
create index if not exists sessions_user_idx on sessions(auth_user_id, expires_at);
create index if not exists audit_workspace_date_idx on audit_logs(workspace_id, created_at);
