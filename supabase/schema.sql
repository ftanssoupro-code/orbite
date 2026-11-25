-- Orbite : à coller dans Supabase → SQL Editor → Run

create table if not exists public.state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  ts bigint not null,
  day text not null,
  data jsonb not null
);
create index if not exists sessions_user_ts on public.sessions (user_id, ts desc);

create table if not exists public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (user_id, day)
);

-- Accès via l'API pour les élèves connectés uniquement (les anonymes n'ont rien)
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.state, public.sessions, public.ai_usage to authenticated;
revoke all on public.state, public.sessions, public.ai_usage from anon;

alter table public.state    enable row level security;
alter table public.sessions enable row level security;
alter table public.ai_usage enable row level security;

-- Chaque élève ne voit et ne modifie que ses propres données
drop policy if exists "own state" on public.state;
create policy "own state" on public.state for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own sessions" on public.sessions;
create policy "own sessions" on public.sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own ai usage" on public.ai_usage;
create policy "own ai usage" on public.ai_usage for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Coach : devoirs et questions sur mesure écrits par le coach (lecture seule pour l'élève)
create table if not exists public.coach (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
grant select on public.coach to authenticated;
revoke all on public.coach from anon;
alter table public.coach enable row level security;
drop policy if exists "read own coach" on public.coach;
create policy "read own coach" on public.coach for select using (auth.uid() = user_id);
