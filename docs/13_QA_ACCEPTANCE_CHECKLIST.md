# 13 — QA and Acceptance Checklist

Use this before final submission.

## Environment

- [ ] `.env.local` exists.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set.
- [ ] `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` is set.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set only in server environment.
- [ ] `ADMIN_INVITE_CODE` is set.
- [ ] `.env.local` is ignored by git.
- [ ] `.env.example` exists with blank values.

---

## Build

- [ ] `npm install` works.
- [ ] `npm run lint` passes or has documented warnings.
- [ ] `npm run build` passes.
- [ ] No TypeScript blocking errors.
- [ ] No service-role import appears in client files.

---

## Database

- [ ] All tables exist.
- [ ] RLS is enabled on core tables.
- [ ] RLS policies are applied.
- [ ] Ranks are seeded.
- [ ] Roles are seeded.
- [ ] New signup creates profile automatically.
- [ ] New signup creates user_stats automatically.
- [ ] XP update recalculates rank.
- [ ] Completed application awards XP only once.
- [ ] Duplicate application is blocked.
- [ ] Duplicate party membership is blocked.

---

## Auth

- [ ] Student can sign up.
- [ ] Student can log in.
- [ ] Student can log out.
- [ ] Unauthenticated user is redirected to login.
- [ ] Logged-in user is redirected away from login when appropriate.
- [ ] Student cannot access `/admin`.
- [ ] Admin can access `/admin`.

---

## Student Dashboard

- [ ] Shows display name.
- [ ] Shows current rank.
- [ ] Shows total XP.
- [ ] Shows segmented XP bar.
- [ ] Shows application summary.
- [ ] Handles empty state.

---

## Quest Board

- [ ] Shows open quests only.
- [ ] Filters work.
- [ ] Quest card shows reward XP.
- [ ] Quest card shows recommended rank.
- [ ] Student can apply.
- [ ] Duplicate apply shows clear error.
- [ ] Full slots prevent acceptance.

---

## Party System

- [ ] Parties list loads.
- [ ] Student can create a party.
- [ ] Creator becomes leader.
- [ ] Student can join valid party.
- [ ] Rank requirement is enforced.
- [ ] Duplicate membership is blocked.

---

## Leaderboard

- [ ] Sorted by XP descending.
- [ ] Top 3 section renders.
- [ ] Full table renders.
- [ ] Sensitive fields like raw email are not shown unless intended.

---

## Admin Jobs

- [ ] Admin can create job.
- [ ] Admin can update job.
- [ ] Admin can close/delete job.
- [ ] Student cannot call admin job endpoints.

---

## Admin Applications

- [ ] Admin can view applications.
- [ ] Admin can accept application.
- [ ] Accepting decrements slots.
- [ ] Admin can reject application.
- [ ] Admin can mark in progress.
- [ ] Admin can complete application.
- [ ] Completing awards XP once.

---

## Design

- [ ] App uses dark Apex Protocol colors.
- [ ] Buttons are sharp and rectangular.
- [ ] Cards use borders, not soft shadows.
- [ ] Gold is used for ranks/XP/prestige.
- [ ] Red is used for primary actions.
- [ ] Navbar has only Dashboard, Quest, Party, Leaderboard.
- [ ] UI is responsive on mobile.
- [ ] No flashy gradients were added.

---

## Final Submission

- [ ] README explains setup.
- [ ] Supabase migration files are included.
- [ ] Screenshots/demo flow are ready.
- [ ] Known limitations are documented.

---

## Git / Repository Checklist

- [ ] `main` exists and is treated as stable/demo-ready.
- [ ] `develop` exists and is used as the integration branch.
- [ ] Implementation work happens on `feature/*`, `fix/*`, `style/*`, or `build/*` branches.
- [ ] No feature work is committed directly to `main`.
- [ ] Commit messages follow Conventional Commits.
- [ ] `.env.local`, service role keys, `.next/`, and `node_modules/` are not committed.
- [ ] Each PR/merge has a clear summary and has passed lint/build when practical.
