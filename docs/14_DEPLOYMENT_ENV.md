# 14 — Deployment and Environment Guide

## Local Development

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

## Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_INVITE_CODE=
```

Create `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_INVITE_CODE=
```

Never commit real secret values.

### Variable Scope

| Variable | Runtime scope | Required in Vercel | Notes |
|---|---|---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server | Yes | Supabase project URL. This is safe to expose. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` | Browser and server | Yes | Supabase publishable/anon key. This is safe to expose under RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Yes | Used only by route handlers and server utilities. Never import into client components. |
| `ADMIN_INVITE_CODE` | Server only | Yes | Used by `/api/admin/invite`. Use a production-only value. |

Deployment environments should not define real secrets in `.env.example`; use the platform secret manager.

---

## Supabase Setup

### 1. Create Project

Create a Supabase project.

### 2. Copy Project Values

From Supabase dashboard:

- Project URL
- anon/publishable key
- service role key

### 3. Apply Migrations

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Alternative for class demo:

- Copy migration SQL into Supabase SQL Editor.
- Run it manually.
- Verify tables and policies.

### Manual Supabase Checklist

These steps remain manual for deployment:

- Apply `supabase/migrations/20260424000100_guild_system_schema.sql`.
- Apply `supabase/migrations/20260424000200_guild_system_rls.sql`.
- Verify RLS is enabled for `roles`, `ranks`, `profiles`, `user_stats`, `jobs`, `job_applications`, `parties`, and `party_members`.
- Verify roles and ranks are seeded.
- Verify the `on_auth_user_created` trigger creates `profiles` and `user_stats` rows for new users.
- Verify the completion trigger awards XP once and updates rank from XP.
- Verify duplicate applications and duplicate party memberships are blocked by constraints.
- Promote the first admin through `/admin/invite` or by controlled database role assignment.

---

## Google OAuth Setup

Only do this if needed.

1. Enable Google provider in Supabase Auth.
2. Add redirect URL:
   - Local: `http://localhost:3000/auth/oauth-callback`
   - Production: `https://your-domain.com/auth/oauth-callback`
3. Add provider credentials.
4. Test login.

---

## Vercel Deployment

Recommended for Next.js.

### Steps

1. Push project to GitHub.
2. Import repo in Vercel.
3. Add environment variables.
4. Deploy.
5. Test auth redirects and OAuth callback.

### Build Settings

Use the default Vercel settings for a Next.js project:

```txt
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

### Production Environment Variables

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_INVITE_CODE
```

---

## Production Checks

- [ ] Build passes.
- [ ] Environment variables are set.
- [ ] Supabase migrations are applied.
- [ ] Site URL is added in Supabase Auth settings.
- [ ] Redirect URLs are configured.
- [ ] Admin invite code is different from local.
- [ ] Service role key is not exposed to browser bundle.
- [ ] `.env.example` contains only placeholder variable names.
- [ ] `.env.local`, `.next/`, `node_modules/`, and logs are not staged.

---

## Known MVP Limitations

- No full automated test suite yet.
- No analytics or monitoring.
- Admin invite code is simple and should be improved for production.
- High-concurrency slot acceptance should eventually use stronger transaction locking.
- Email confirmation behavior depends on Supabase Auth settings.
