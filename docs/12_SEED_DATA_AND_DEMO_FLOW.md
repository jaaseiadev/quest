# 12 — Seed Data and Demo Flow

Use this file to create a strong class/demo presentation.

## Seed Jobs

```sql
insert into public.jobs (
  title,
  description,
  category,
  company,
  pay,
  location,
  slots,
  reward_xp,
  status,
  deadline,
  recommended_rank_id
)
values
  (
    'Frontend Interface Scout',
    'Assist in building reusable React components for a student organization dashboard.',
    'Technology',
    'Apex Student Labs',
    2500,
    'Remote',
    3,
    120,
    'open',
    now() + interval '14 days',
    1
  ),
  (
    'Database Cleanup Operative',
    'Normalize spreadsheet records and prepare clean import data for Supabase.',
    'Data',
    'Campus Data Office',
    1800,
    'VSU Campus',
    2,
    100,
    'open',
    now() + interval '10 days',
    1
  ),
  (
    'UI QA Sentinel',
    'Review a web application for UI consistency, broken states, and mobile responsiveness.',
    'Design',
    'Software Engineering Lab',
    2000,
    'Hybrid',
    4,
    90,
    'open',
    now() + interval '7 days',
    1
  ),
  (
    'API Integration Specialist',
    'Connect frontend forms to an existing REST API and document integration issues.',
    'Technology',
    'Guild Partner Network',
    4500,
    'Remote',
    1,
    220,
    'open',
    now() + interval '21 days',
    2
  ),
  (
    'Analytics Report Runner',
    'Prepare charts and a short summary based on job application engagement data.',
    'Analytics',
    'Career Services',
    3000,
    'VSU Campus',
    2,
    160,
    'open',
    now() + interval '18 days',
    2
  );
```

---

## Seed Parties

Replace the `leader_id` values with real profile IDs after creating demo users.

```sql
insert into public.parties (
  name,
  description,
  leader_id,
  category,
  min_rank_id
)
values
  (
    'Frontend Raiders',
    'A party for students focused on UI and frontend quests.',
    null,
    'Technology',
    1
  ),
  (
    'Data Sentinels',
    'A group for analytics, reporting, and database cleanup quests.',
    null,
    'Analytics',
    1
  ),
  (
    'Design Vanguard',
    'A creative party focused on interface reviews and user experience.',
    null,
    'Design',
    1
  );
```

---

## Demo Script

### 1. Login as Student

Show:

- login screen
- dashboard
- Beginner rank
- 0 XP
- empty/recent application section

### 2. Browse Quest Board

Show:

- filter bar
- quest cards
- reward XP
- recommended rank
- apply button

### 3. Apply to a Quest

Show:

- quest detail
- apply action
- pending status
- duplicate application prevention

### 4. Create/Join Party

Show:

- party page
- create party form
- party cards
- rank requirement

### 5. Leaderboard

Show:

- top 3 cards
- full ranking table

### 6. Admin Review

Login as admin.

Show:

- admin dashboard
- job table
- application table
- accept application
- mark completed

### 7. XP and Rank Update

Return to student.

Show:

- XP increased
- segmented XP bar changed
- rank updates if threshold reached

---

## Strong Demo Talking Points

- The project uses RBAC to separate students and admins.
- Supabase Auth manages login sessions.
- Database constraints prevent duplicate applications.
- Triggers automate profile creation, XP awards, and rank updates.
- The design system supports the gamified concept without making the app look childish.
