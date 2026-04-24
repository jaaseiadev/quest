# 05 — Supabase RLS and Auth Policies

This file defines the security model for Supabase.

## Security Goals

1. Students can only mutate their own user-owned records.
2. Public users can read open quests, ranks, parties, and leaderboard data through safe API routes.
3. Admin-only operations happen through server route handlers.
4. The service role key is never used in client components.
5. RLS remains enabled on all core tables.

---

## Enable RLS

Add this to the same migration after table creation or in a second migration.

```sql
alter table public.roles enable row level security;
alter table public.ranks enable row level security;
alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.parties enable row level security;
alter table public.party_members enable row level security;
```

---

## Helper Functions

```sql
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
```

---

## Public Read Tables

Ranks and roles can be read by authenticated users. For a student MVP, ranks can also be public because they contain no sensitive data.

```sql
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
```

---

## Profiles

```sql
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
```

Note: Avoid selecting all profile columns for leaderboard on the client. Use an API route or a safe view.

---

## User Stats

```sql
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
```

Students should not update their own XP directly. XP is awarded by server/admin actions and database triggers.

---

## Jobs

```sql
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
```

---

## Job Applications

```sql
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
```

Students should not update application status directly.

---

## Parties

```sql
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
```

---

## Party Members

```sql
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
```

Rank requirements for joining parties should be checked in the API route before insert.

---

## Auth Redirect Rules

### Unauthenticated

Redirect to:

```txt
/auth/login
```

when trying to access:

```txt
/dashboard
/questboard
/party-management
/leaderboard
/admin
/admin/*
```

### Non-Admin

Redirect to:

```txt
/dashboard
```

when trying to access:

```txt
/admin
/admin/*
```

---

## Invite Code Promotion

`POST /api/admin/invite` should:

1. Verify user is authenticated.
2. Compare submitted code with `ADMIN_INVITE_CODE`.
3. Update `profiles.role_id = 2`.
4. Return success.
5. Never return the invite code.

---

## Notes for Codex

- Add policies in migrations, not manually in the dashboard only.
- Do not disable RLS to "fix" errors.
- Prefer secure route handlers over broad RLS policies.
