# 02 — Information Architecture

## Route Map

```txt
/
├── redirects to /dashboard
├── /auth
│   ├── /login
│   ├── /sign-up
│   ├── /forgot-password
│   └── /oauth-callback
├── /dashboard
├── /questboard
├── /party-management
├── /leaderboard
└── /admin
    ├── /jobs
    ├── /jobs/new
    ├── /jobs/[id]/edit
    ├── /applications
    └── /invite
```

---

## Student Navigation

The main student navbar must contain only these four links:

| Label | Route |
|---|---|
| Dashboard | `/dashboard` |
| Quest | `/questboard` |
| Party | `/party-management` |
| Leaderboard | `/leaderboard` |

Admin links should not appear in the student navbar. Admin entry can be accessible through a separate admin layout or direct `/admin` route for admin users.

---

## Page Responsibilities

### `/dashboard`

Purpose:

- Personal command center
- Shows student stats and quest progress

Primary data:

- `profiles`
- `user_stats`
- `ranks`
- `job_applications`
- `jobs`

---

### `/questboard`

Purpose:

- Browse open jobs as quests
- Apply to quests

Primary data:

- `jobs`
- `ranks`
- current user's `job_applications`

---

### `/party-management`

Purpose:

- Create, browse, and join parties

Primary data:

- `parties`
- `party_members`
- `profiles`
- `ranks`
- `user_stats`

---

### `/leaderboard`

Purpose:

- Global ranking based on XP

Primary data:

- `user_stats`
- `profiles`
- `ranks`
- `party_members`
- `parties`

---

### `/admin`

Purpose:

- Admin command center

Primary data:

- `jobs`
- `job_applications`
- `profiles`
- `user_stats`
- `ranks`

---

## User Flows

### Student Sign-Up Flow

1. Student opens `/auth/sign-up`.
2. Student creates account.
3. Supabase Auth creates user.
4. Trigger creates `profiles` row.
5. Trigger creates `user_stats` row.
6. Student is redirected to `/dashboard`.

---

### Quest Application Flow

1. Student opens `/questboard`.
2. Student filters quests.
3. Student opens quest detail.
4. Student clicks Apply.
5. Frontend calls `POST /api/apply`.
6. API verifies auth.
7. API verifies job is open.
8. API inserts `job_applications` row.
9. Student receives pending status.

---

### Admin Completion Flow

1. Admin opens `/admin/applications`.
2. Admin changes status to `completed`.
3. API verifies admin role.
4. Database updates status.
5. Trigger awards XP once.
6. Trigger recalculates rank.
7. Student sees updated XP/rank on dashboard.

---

## Layout Structure

### Root Layout

- Loads global fonts
- Loads `globals.css`
- Wraps app content
- Does not fetch protected data

### Auth Layout

- Minimal centered layout
- Login background or command-panel style

### Student Layout

- Topbar
- Four-link navbar
- User avatar/menu
- Main content container

### Admin Layout

- Admin sidebar
- Top command header
- Warning-style admin badge
- Protected server validation
