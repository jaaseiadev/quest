# 06 — API Contracts

All API responses should use a consistent JSON shape.

## Response Types

```ts
export type ApiSuccess<T> = {
  ok: true
  data: T
  message?: string
}

export type ApiError = {
  ok: false
  error: {
    code: string
    message: string
  }
}
```

---

## Public / Student Endpoints

### `GET /api/jobs`

Fetch open jobs.

#### Query Params

| Param | Type | Notes |
|---|---|---|
| `difficulty` | string | rank name |
| `category` | string | job category |
| `datePosted` | string | `Last Week`, `Last Month`, `Recent`, `All Time` |
| `limit` | number | default 50, max 100 |
| `offset` | number | default 0 |

#### Response

```ts
type JobListItem = {
  id: string
  title: string
  description: string | null
  category: string | null
  company: string | null
  pay: number | null
  location: string | null
  slots: number
  reward_xp: number
  status: 'open' | 'closed'
  deadline: string | null
  created_at: string
  recommended_rank: {
    id: number
    name: string
    min_xp: number
    max_xp: number | null
  } | null
}
```

---

### `POST /api/apply`

Submit application for a job.

#### Auth

Required.

#### Body

```json
{
  "jobId": "uuid"
}
```

#### Behavior

1. Verify authenticated user.
2. Verify job exists.
3. Verify job is open.
4. Verify slots are available.
5. Insert `job_applications`.
6. Return `409` if duplicate.

#### Success

```json
{
  "ok": true,
  "message": "Application submitted.",
  "data": {
    "id": "application-uuid",
    "status": "pending"
  }
}
```

---

### `GET /api/ranks`

Fetch rank definitions.

#### Auth

Not required.

---

### `GET /api/leaderboard`

Fetch users ranked by XP.

#### Query Params

| Param | Type |
|---|---|
| `limit` | number |
| `offset` | number |

#### Response

```ts
type LeaderboardEntry = {
  rank_number: number
  user_id: string
  display_name: string
  avatar_url: string | null
  xp: number
  rank: {
    id: number
    name: string
  } | null
  party: {
    id: number
    name: string
  } | null
}
```

Use a server route to avoid exposing profile emails.

---

### `GET /api/parties`

Fetch all parties.

#### Query Params

| Param | Type |
|---|---|
| `includeMembers` | boolean |

---

### `POST /api/parties`

Create a party.

#### Auth

Required.

#### Body

```json
{
  "name": "Frontend Raiders",
  "description": "Students focused on frontend quests.",
  "min_rank_id": 2,
  "category": "Technology"
}
```

#### Behavior

- `leader_id` must be current user.
- Trigger inserts leader into `party_members`.

---

### `POST /api/parties/[id]/join`

Join a party.

#### Auth

Required.

#### Behavior

1. Verify user is authenticated.
2. Fetch user's current rank.
3. Fetch party minimum rank.
4. Reject if user's rank is too low.
5. Insert party member.
6. Return `409` if already joined.

---

## Admin Endpoints

All admin endpoints require:

- Authenticated user
- `profiles.role_id = admin role id`
- Server-side role validation

---

### `GET /api/admin/jobs`

Fetch all jobs including open and closed.

---

### `POST /api/admin/jobs`

Create a job.

#### Body

```json
{
  "title": "Frontend Intern",
  "description": "Build UI components for internal dashboard.",
  "category": "Technology",
  "company": "Apex Labs",
  "pay": 5000,
  "location": "Remote",
  "slots": 3,
  "reward_xp": 120,
  "status": "open",
  "deadline": "2026-05-01T00:00:00.000Z",
  "recommended_rank_id": 1
}
```

---

### `PUT /api/admin/jobs/[id]`

Update a job.

Same body fields as create. Partial updates are allowed.

---

### `DELETE /api/admin/jobs/[id]`

Delete a job or soft-close it.

Preferred MVP behavior:

- Set `status = 'closed'` instead of hard delete.

---

### `GET /api/admin/job-applications`

Fetch all applications with job and user info.

---

### `PATCH /api/admin/job-applications`

Update application status.

#### Body

```json
{
  "applicationId": "uuid",
  "status": "accepted"
}
```

#### Status Rules

- `accepted` decrements job slots by 1.
- `completed` awards XP through database trigger.
- `rejected` does not change XP.
- Slots must not go below 0.

#### Accepted Slot Update

Use optimistic concurrency:

```sql
update jobs
set slots = slots - 1
where id = :job_id
  and slots > 0;
```

If no row is updated, return `409`.

---

### `POST /api/admin/invite`

Promote current user to admin using invite code.

#### Body

```json
{
  "inviteCode": "secret-code"
}
```

#### Behavior

- Compare to `ADMIN_INVITE_CODE`.
- Update current user's role to admin.
- Return success.
