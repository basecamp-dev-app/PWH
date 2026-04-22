create table if not exists imports (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  imported_at timestamptz not null default now(),
  notes text
);

create table if not exists tracked_events (
  id uuid primary key default gen_random_uuid(),
  source_line text not null,
  imported_at timestamptz not null default now()
);

create table if not exists vals_snapshots (
  id uuid primary key default gen_random_uuid(),
  combo_key text not null,
  metal text not null,
  value text not null,
  imported_at timestamptz not null default now()
);

create table if not exists trade_events (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  trade_date date,
  metal text,
  trader_name text,
  side text,
  lots numeric,
  prompt text,
  carry text,
  desk text,
  moc_flag boolean default false,
  company text,
  location text,
  imported_at timestamptz not null default now()
);
