-- =========================================
-- ENABLE RLS
-- =========================================
alter table public.roles enable row level security;
alter table public.ranks enable row level security;
alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.parties enable row level security;
alter table public.party_members enable row level security;

-- =========================================
-- HELPER FUNCTIONS
-- =========================================
create or replace function public.current_role_name()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select r.name
  from public.profiles p
  join public.roles r on r.id = p.role_id
  where p.id = auth.uid()
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_role_name() = 'admin', false);
$$;

create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role_id is distinct from old.role_id
    and auth.role() is distinct from 'service_role'
    and not public.is_admin()
  then
    raise exception 'Only admins can update profile roles.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_profile_role_escalation on public.profiles;
create trigger trg_prevent_profile_role_escalation
before update of role_id on public.profiles
for each row execute function public.prevent_profile_role_escalation();

-- =========================================
-- PUBLIC READ TABLES
-- =========================================
drop policy if exists "Anyone can read ranks" on public.ranks;
create policy "Anyone can read ranks"
on public.ranks for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can read roles" on public.roles;
create policy "Authenticated can read roles"
on public.roles for select
to authenticated
using (true);

-- =========================================
-- PROFILES
-- =========================================
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
on public.profiles for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update profile roles" on public.profiles;
create policy "Admins can update profile roles"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================
-- USER STATS
-- =========================================
drop policy if exists "Users can read own stats" on public.user_stats;
create policy "Users can read own stats"
on public.user_stats for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage all stats" on public.user_stats;
create policy "Admins can manage all stats"
on public.user_stats for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================
-- JOBS
-- =========================================
drop policy if exists "Anyone can read open jobs" on public.jobs;
create policy "Anyone can read open jobs"
on public.jobs for select
to anon, authenticated
using (status = 'open');

drop policy if exists "Admins can manage jobs" on public.jobs;
create policy "Admins can manage jobs"
on public.jobs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================
-- JOB APPLICATIONS
-- =========================================
drop policy if exists "Users can read own applications" on public.job_applications;
create policy "Users can read own applications"
on public.job_applications for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can create own applications" on public.job_applications;
create policy "Users can create own applications"
on public.job_applications for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Admins can manage applications" on public.job_applications;
create policy "Admins can manage applications"
on public.job_applications for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================
-- PARTIES
-- =========================================
drop policy if exists "Anyone can read parties" on public.parties;
create policy "Anyone can read parties"
on public.parties for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can create parties" on public.parties;
create policy "Authenticated users can create parties"
on public.parties for insert
to authenticated
with check (leader_id = auth.uid());

drop policy if exists "Leaders can update own parties" on public.parties;
create policy "Leaders can update own parties"
on public.parties for update
to authenticated
using (leader_id = auth.uid() or public.is_admin())
with check (leader_id = auth.uid() or public.is_admin());

-- =========================================
-- PARTY MEMBERS
-- =========================================
drop policy if exists "Anyone can read party members" on public.party_members;
create policy "Anyone can read party members"
on public.party_members for select
to anon, authenticated
using (true);

drop policy if exists "Users can join as themselves" on public.party_members;
create policy "Users can join as themselves"
on public.party_members for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can leave parties" on public.party_members;
create policy "Users can leave parties"
on public.party_members for delete
to authenticated
using (user_id = auth.uid() or public.is_admin());
