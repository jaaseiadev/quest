# 01 — Product Requirements

## Main Modules

1. Authentication
2. Student Dashboard
3. Quest Board
4. Application Workflow
5. XP and Rank System
6. Party System
7. Leaderboard
8. Admin Panel

---

## 1. Authentication

### Requirements

- Users can sign up with email and password.
- Users can log in with email and password.
- Optional: Google OAuth can be enabled through Supabase.
- On signup, a `profiles` row and `user_stats` row must be created automatically.
- Default role is `student`.
- Admin access is granted through invite code or direct database role assignment.

### Acceptance Criteria

- Unauthenticated users cannot access protected student pages.
- Authenticated students cannot access admin pages.
- Admins can access `/admin`.
- Logging out clears session and redirects to login.

---

## 2. Student Dashboard

### Requirements

Dashboard shows:

- Welcome message
- Current rank
- Total XP
- XP progress to next rank
- Application summary
- Recent applications
- Recommended quests

### Acceptance Criteria

- User sees their own stats only.
- Empty state appears for new users.
- XP bar uses segmented visual style.
- Dashboard uses Apex Protocol card styling.

---

## 3. Quest Board

### Requirements

Students can:

- Browse open jobs
- Filter by difficulty/rank
- Filter by category
- Sort/filter by recency
- Open quest detail modal/page
- Apply to a quest

Quest card displays:

- Title
- Company or created-by label if available
- Category
- Location
- Pay
- Slots
- Reward XP
- Deadline
- Recommended rank

### Acceptance Criteria

- Closed jobs are hidden from public quest board.
- Duplicate applications are prevented.
- Application feedback appears after applying.
- Quest cards have hover border emphasis.

---

## 4. Application Workflow

### Status Values

| Status | Meaning |
|---|---|
| `pending` | Student submitted application |
| `accepted` | Admin accepted the student |
| `in_progress` | Student is actively working |
| `completed` | Admin marked the job complete |
| `rejected` | Admin declined the application |

### Requirements

- Student submits application through `POST /api/apply`.
- Database prevents duplicate applications using unique constraint.
- Admin can update application status.
- Accepting an application decrements available job slots.
- Completing an application awards XP once.

### Acceptance Criteria

- No negative slot counts.
- Completed applications do not award XP repeatedly.
- Rejected applications do not award XP.

---

## 5. XP and Rank System

### Default Ranks

| Rank | Min XP | Max XP |
|---|---:|---:|
| Beginner | 0 | 149 |
| Apprentice | 150 | 499 |
| Specialist | 500 | 999 |
| Expert | 1000 | 1749 |
| Master | 1750 | 2499 |
| Grandmaster | 2500 | No cap |

### Requirements

- XP is stored in `user_stats.xp`.
- Rank is stored in `user_stats.current_rank_id`.
- Rank updates automatically after XP changes.

### Acceptance Criteria

- New users start at Beginner with 0 XP.
- Rank changes without frontend calculation.
- Leaderboard sorts by XP descending.

---

## 6. Party System

### Requirements

Students can:

- Create a party
- Become party leader automatically
- Browse existing parties
- Join parties if rank requirement is met
- See party members

Party has:

- Name
- Description
- Leader
- Category tag
- Minimum rank requirement

### Acceptance Criteria

- User cannot join the same party twice.
- User cannot join if rank requirement is not met.
- Party leader is inserted into `party_members` automatically.

---

## 7. Leaderboard

### Requirements

Leaderboard shows:

- Top 3 students in highlighted cards
- Full ranking table
- Display name
- Avatar if available
- XP
- Rank
- Party affiliation

### Acceptance Criteria

- Data is sorted by XP descending.
- Pagination or limit is supported.
- Does not expose sensitive profile data unnecessarily.

---

## 8. Admin Panel

### Requirements

Admins can:

- Create jobs
- Update jobs
- Delete or close jobs
- View applications
- Accept, reject, mark in progress, or complete applications
- Promote user through invite code endpoint

### Acceptance Criteria

- Admin routes are blocked for students.
- API endpoints return 401 for unauthenticated requests.
- API endpoints return 403 for non-admin requests.
- Forms validate required fields.
