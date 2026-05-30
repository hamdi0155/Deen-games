-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  username text not null unique,
  avatar_url text,
  total_xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  last_played_at timestamptz,
  completed_categories text[] default '{}',
  created_at timestamptz default now()
);

-- Row level security
alter table public.profiles enable row level security;

create policy "Users can view all profiles"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Leaderboard view (read-only public ranking)
create view public.leaderboard as
  select
    row_number() over (order by total_xp desc) as rank,
    id,
    username,
    avatar_url,
    total_xp,
    level
  from public.profiles
  order by total_xp desc;
