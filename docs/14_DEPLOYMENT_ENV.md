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

---

## Known MVP Limitations

- No full automated test suite yet.
- No analytics or monitoring.
- Admin invite code is simple and should be improved for production.
- High-concurrency slot acceptance should eventually use stronger transaction locking.
- Email confirmation behavior depends on Supabase Auth settings.
