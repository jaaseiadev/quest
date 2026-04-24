# 03 — App Architecture

## Architecture Style

The app uses a **Next.js App Router** architecture with:

- Server components for initial data loading
- Client components for interactions
- Route handlers for API endpoints
- Middleware for session refresh and protected routes
- Supabase PostgreSQL as the data layer

---

## Layered Structure

| Layer | Responsibility |
|---|---|
| Frontend Layer | Pages, layouts, UI components, Tailwind styling |
| API Layer | Next.js route handlers under `src/app/api/*` |
| Data Layer | Supabase PostgreSQL, RLS policies, triggers |
| Auth Layer | Supabase Auth, middleware session refresh |
| Utility Layer | Supabase clients, role helpers, response helpers |

---

## Recommended Folder Structure

```txt
src/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       ├── login/page.tsx
│   │       ├── sign-up/page.tsx
│   │       ├── forgot-password/page.tsx
│   │       └── oauth-callback/route.ts
│   ├── api/
│   │   ├── apply/route.ts
│   │   ├── jobs/route.ts
│   │   ├── ranks/route.ts
│   │   ├── leaderboard/route.ts
│   │   ├── parties/route.ts
│   │   ├── parties/[id]/join/route.ts
│   │   └── admin/
│   │       ├── jobs/route.ts
│   │       ├── jobs/[id]/route.ts
│   │       ├── job-applications/route.ts
│   │       └── invite/route.ts
│   ├── dashboard/page.tsx
│   ├── questboard/page.tsx
│   ├── party-management/page.tsx
│   ├── leaderboard/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── jobs/page.tsx
│   │   └── applications/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   ├── auth/
│   ├── dashboard/
│   ├── leaderboard/
│   ├── party-management/
│   ├── questboard/
│   ├── shared/
│   └── ui/
├── lib/
│   ├── supabase/
│   │   ├── browser.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── api-response.ts
│   ├── auth.ts
│   ├── roles.ts
│   ├── utils.ts
│   └── validations.ts
├── types/
│   ├── db.ts
│   ├── api.ts
│   └── ui.ts
└── middleware.ts
```

---

## Supabase Client Types

### Browser Client

Use only in client components.

Purpose:

- Sign in
- Sign up
- Sign out
- Read current session
- Subscribe to auth changes

File:

```txt
src/lib/supabase/browser.ts
```

### Server Client

Use in server components and route handlers.

Purpose:

- Read current user from cookies
- Perform authenticated reads/writes under RLS
- Refresh session in middleware

File:

```txt
src/lib/supabase/server.ts
```

### Admin Client

Use only in server route handlers.

Purpose:

- Admin operations requiring service role
- Secure internal reads/writes when RLS would block a server operation

File:

```txt
src/lib/supabase/admin.ts
```

Never import `admin.ts` into client files.

---

## Middleware Responsibilities

`src/middleware.ts` should:

1. Create Supabase server client.
2. Refresh auth session.
3. Redirect unauthenticated users away from protected routes.
4. Redirect authenticated users away from auth pages when appropriate.
5. Protect `/admin/*` by verifying admin role.

Protected student routes:

```txt
/dashboard
/questboard
/party-management
/leaderboard
```

Protected admin routes:

```txt
/admin
/admin/*
```

---

## API Response Shape

Use a consistent response shape:

```ts
type ApiSuccess<T> = {
  ok: true
  data: T
  message?: string
}

type ApiError = {
  ok: false
  error: {
    code: string
    message: string
  }
}
```

---

## Data Fetching Strategy

### Public-ish Data

Use API routes or server components:

- ranks
- open jobs
- leaderboard
- parties

### User-Owned Data

Use server components or authenticated API routes:

- dashboard stats
- user's applications
- user's party membership
- profile

### Admin Data

Use admin API routes only:

- all jobs
- all applications
- status updates
- invite-code promotion

---

## Error Handling

All route handlers should handle:

- Missing auth: `401`
- Missing role: `403`
- Invalid body: `400`
- Missing record: `404`
- Conflict/duplicate: `409`
- Server error: `500`
