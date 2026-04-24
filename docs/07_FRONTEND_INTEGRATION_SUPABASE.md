# 07 — Frontend Integration With Supabase

This file gives Codex the exact Supabase integration pattern.

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_INVITE_CODE=
```

Rules:

- `NEXT_PUBLIC_*` variables can be used on the frontend.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- `ADMIN_INVITE_CODE` is server-only.

---

## Browser Client

File:

```txt
src/lib/supabase/browser.ts
```

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!
  )
}
```

Use this in client components for:

- Sign in
- Sign up
- Sign out
- OAuth login
- Reading session

---

## Server Client

File:

```txt
src/lib/supabase/server.ts
```

```ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Server components cannot set cookies.
            // Middleware handles refresh.
          }
        },
      },
    }
  )
}
```

Use this in:

- Server components
- Route handlers where user-authenticated RLS is enough

---

## Admin Client

File:

```txt
src/lib/supabase/admin.ts
```

```ts
import { createClient } from '@supabase/supabase-js'

export function createSupabaseAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
```

Use only in server files.

Never import this into:

- Client components
- Browser utilities
- Any file with `"use client"`

---

## Auth Utilities

File:

```txt
src/lib/auth.ts
```

Expected helpers:

```ts
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) return null
  return data.user
}
```

---

## Role Utilities

File:

```txt
src/lib/roles.ts
```

Expected helpers:

```ts
export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) return null

  const { data } = await supabase
    .from('profiles')
    .select('id, email, display_name, avatar_url, role_id, roles(name)')
    .eq('id', userData.user.id)
    .single()

  return data
}

export async function requireAdmin() {
  const profile = await getCurrentProfile()

  if (!profile) {
    return { ok: false as const, status: 401, message: 'Authentication required.' }
  }

  const roleName = Array.isArray(profile.roles)
    ? profile.roles[0]?.name
    : profile.roles?.name

  if (roleName !== 'admin') {
    return { ok: false as const, status: 403, message: 'Admin access required.' }
  }

  return { ok: true as const, profile }
}
```

Codex may adjust typing based on generated Supabase types.

---

## Client-Side Auth Forms

### Sign Up Flow

Use browser client:

```ts
const supabase = createSupabaseBrowserClient()

const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: displayName,
    },
  },
})
```

After successful signup:

- Show message to check email if email confirmation is enabled.
- Otherwise redirect to `/dashboard`.

### Login Flow

```ts
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

After success:

```ts
router.push('/dashboard')
router.refresh()
```

### Logout Flow

```ts
await supabase.auth.signOut()
router.push('/auth/login')
router.refresh()
```

---

## Data Fetching Pattern

### Recommended

For most app data, call API routes from client components:

```ts
const res = await fetch('/api/jobs')
const json = await res.json()
```

For server pages, use `createSupabaseServerClient()` or internal data functions.

### Avoid

Do not put complex admin queries in client components.

Do not use the service role key to bypass RLS from the browser.

---

## Middleware Pattern

`src/middleware.ts` should:

- Refresh Supabase session.
- Redirect unauthenticated users.
- Protect admin pages.

Codex should use the current recommended `@supabase/ssr` middleware pattern and adapt it to this project.

---

## Frontend State Strategy

Keep the MVP simple:

- Use React state for filters, modals, forms.
- Use server fetch for page initial data.
- Use `router.refresh()` after mutations.
- Avoid adding Zustand/Redux unless later required.

---

## Error UI

Every form mutation should show:

- Loading state
- Success message
- Error message

Every data list should show:

- Loading skeleton
- Empty state
- Error state
