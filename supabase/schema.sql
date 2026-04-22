create extension if not exists pgcrypto;

create table if not exists import_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed')),
  notes text,
  imported_at timestamptz not null default now(),
  is_active boolean not null default false
);

create table if not exists report_rows (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid not null references import_runs(id) on delete cascade,
  report_type text not null check (report_type in ('traded', 'orderbook', 'matched')),
  source_sheet text not null,
  source_row integer,
  trade_date date,
  metal text not null default '',
  trader text not null default '',
  side text not null default '',
  lots numeric not null default 0,
  prompt text not null default '',
  carry text not null default '',
  desk text not null default '',
  company text not null default '',
  location text not null default '',
  workflow_bucket text not null default '',
  moc_flag boolean not null default false,
  imported_at timestamptz not null default now()
);

create table if not exists vals_snapshots (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid not null references import_runs(id) on delete cascade,
  combo_key text not null,
  metal text not null,
  value text not null,
  imported_at timestamptz not null default now()
);

create table if not exists tracked_orders (
  id uuid primary key default gen_random_uuid(),
  import_run_id uuid references import_runs(id) on delete set null,
  line text not null,
  normalized_key text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tracked_orders_set_updated_at on tracked_orders;
create trigger tracked_orders_set_updated_at
before update on tracked_orders
for each row
execute function set_updated_at();

create index if not exists report_rows_report_type_trade_date_idx on report_rows (report_type, trade_date desc);
create index if not exists report_rows_trade_date_idx on report_rows (trade_date desc);
create index if not exists report_rows_trader_idx on report_rows (trader);
create index if not exists report_rows_metal_idx on report_rows (metal);
create index if not exists report_rows_import_run_idx on report_rows (import_run_id);
create index if not exists vals_snapshots_combo_idx on vals_snapshots (combo_key, metal);
create index if not exists tracked_orders_normalized_key_idx on tracked_orders (normalized_key) where is_active = true;

create or replace view active_report_rows as
select rr.*
from report_rows rr
join import_runs ir on ir.id = rr.import_run_id
where ir.is_active = true;

create or replace view traded_view as
select * from active_report_rows where report_type = 'traded';

create or replace view orderbook_view as
select * from active_report_rows where report_type = 'orderbook';

create or replace view matched_view as
select * from active_report_rows where report_type = 'matched';

create or replace view active_vals_snapshots as
select vs.*
from vals_snapshots vs
join import_runs ir on ir.id = vs.import_run_id
where ir.is_active = true;

create or replace view intraday_significant_orders_view as
with latest_trade_date as (
  select max(trade_date) as trade_date
  from active_report_rows
),
filtered_rows as (
  select rr.*
  from active_report_rows rr
  cross join latest_trade_date ltd
  where rr.trade_date = ltd.trade_date
    and rr.lots > 25
    and (
      rr.report_type <> 'traded'
      or (
        rr.moc_flag = false
        and rr.workflow_bucket not in ('RING 2', 'Outright', 'Short Dated')
      )
    )
)
select
  rr.id,
  rr.report_type,
  rr.trade_date,
  rr.metal,
  rr.trader,
  rr.side,
  rr.lots,
  rr.prompt,
  rr.carry,
  rr.desk,
  rr.location,
  concat(rr.trader, ' ', rr.side, 's ', rr.lots::text, ' Lots of ', rr.metal, ', ', rr.prompt, ' / ', rr.carry, ' at ', rr.location, ' (', rr.desk, ')') as line,
  coalesce(vs.value, '') as lookup
from filtered_rows rr
left join active_vals_snapshots vs on vs.combo_key = concat(rr.prompt, ' / ', rr.carry) and vs.metal = rr.metal;

alter table import_runs enable row level security;
alter table report_rows enable row level security;
alter table vals_snapshots enable row level security;
alter table tracked_orders enable row level security;

drop policy if exists "authenticated users can read import_runs" on import_runs;
create policy "authenticated users can read import_runs"
on import_runs for select
to authenticated
using (true);

drop policy if exists "authenticated users can read report_rows" on report_rows;
create policy "authenticated users can read report_rows"
on report_rows for select
to authenticated
using (true);

drop policy if exists "authenticated users can read vals_snapshots" on vals_snapshots;
create policy "authenticated users can read vals_snapshots"
on vals_snapshots for select
to authenticated
using (true);

drop policy if exists "authenticated users can read tracked_orders" on tracked_orders;
create policy "authenticated users can read tracked_orders"
on tracked_orders for select
to authenticated
using (true);

drop policy if exists "authenticated users can insert tracked_orders" on tracked_orders;
create policy "authenticated users can insert tracked_orders"
on tracked_orders for insert
to authenticated
with check (auth.uid() = created_by or created_by is null);

drop policy if exists "authenticated users can update tracked_orders" on tracked_orders;
create policy "authenticated users can update tracked_orders"
on tracked_orders for update
to authenticated
using (true)
with check (auth.uid() = updated_by or updated_by is null);

drop policy if exists "authenticated users can delete tracked_orders" on tracked_orders;
create policy "authenticated users can delete tracked_orders"
on tracked_orders for delete
to authenticated
using (true);
