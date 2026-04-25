# Guild-Based Job Opportunity Management System

A Next.js, TypeScript, and Supabase MVP for managing student job opportunities as tactical quests. Students can browse quests, apply, join parties, and track XP/rank progression. Admins can manage jobs and review applications.

The UI follows the Apex Protocol design system: dark, sharp, professional, border-driven, and command-console inspired.

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Supabase Auth and PostgreSQL
- Supabase RLS policies and triggers
- Lucide React
- Framer Motion for subtle micro-interactions

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

3. Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_INVITE_CODE=
```

`SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_INVITE_CODE` are server-only values. Do not expose them in client components or commit real values.

4. Apply Supabase migrations:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

For a class demo, you can also paste the SQL from `supabase/migrations/` into the Supabase SQL Editor in filename order.

5. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Required Environment Variables

Use these names in local development and production:

| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client and server | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` | Client and server | Supabase publishable/anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Used by protected route handlers. Never expose to browser code. |
| `ADMIN_INVITE_CODE` | Server only | Used by the admin invite endpoint. Use a different value in production. |

If a newly registered local test user cannot log in, check Supabase Dashboard > Authentication > Providers > Email. Either confirm the test user in the Supabase users table or disable email confirmation for local development. Do not disable confirmation blindly for production.

## Deployment

Vercel is the recommended deployment target.

1. Push the repo branch to GitHub.
2. Import the repository in Vercel.
3. Add all required environment variables in Vercel Project Settings.
4. Deploy with the default Next.js settings:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output: managed by Next.js/Vercel
5. In Supabase Auth settings, set the production Site URL to your deployed domain.
6. Add production redirect URLs:
   - `https://your-domain.com/auth/oauth-callback`
   - Add `http://localhost:3000/auth/oauth-callback` for local OAuth testing if Google OAuth is enabled.
7. Test login, logout, protected student routes, admin routes, job application, party join, and leaderboard after deploy.

See `docs/14_DEPLOYMENT_ENV.md` for the full deployment checklist.

## Manual Supabase Steps Before Production

- Create or select a Supabase project.
- Copy the Project URL, publishable/anon key, and service role key into the deployment environment.
- Apply `supabase/migrations/20260424000100_guild_system_schema.sql`.
- Apply `supabase/migrations/20260424000200_guild_system_rls.sql`.
- Verify tables, indexes, triggers, seeded ranks, seeded roles, and RLS policies.
- Confirm new signups create `profiles` and `user_stats` rows.
- Confirm completing an application awards XP only once.
- Confirm Supabase Auth Site URL and redirect URLs match the deployed domain.
- Enable Google OAuth only if the demo requires it, then add provider credentials.
- Promote the first admin through `/admin/invite` using `ADMIN_INVITE_CODE` or by directly assigning the admin role in Supabase for a controlled demo.

## Quality Checks

Run these before merging or deploying:

```bash
npm run lint
npm run build
```

Also verify `.env.local`, `.next/`, `node_modules/`, logs, and real secret values are not staged.

## Project Docs

The product, architecture, schema, RLS, UI, QA, and deployment source-of-truth docs live under `docs/`.

Key references:

- `docs/03_APP_ARCHITECTURE.md`
- `docs/04_DATABASE_SCHEMA_SUPABASE.md`
- `docs/05_SUPABASE_RLS_AUTH_POLICIES.md`
- `docs/08_DESIGN_SYSTEM_APEX_PROTOCOL_REVISED.md`
- `docs/13_QA_ACCEPTANCE_CHECKLIST.md`
- `docs/14_DEPLOYMENT_ENV.md`
- `docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md`
