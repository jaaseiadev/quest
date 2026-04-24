# 11 — Codex Implementation Plan

Use this file to guide Codex task order.

## Phase -1 — Git Workflow Setup

Tasks:

- Read `docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md`.
- Initialize Git if the repo is not yet initialized.
- Create `main` as the stable branch.
- Create `develop` as the integration branch.
- For implementation work, create a focused `feature/*` branch from `develop`.
- Add `.gitignore`, `.env.example`, and PR template before coding features.

Deliverables:

- `main` branch exists.
- `develop` branch exists.
- Current work happens on a `feature/*` branch.
- First docs commit uses: `docs(project): add codex build documentation`.

---

## Phase 0 — Project Setup

Branch:

```txt
feature/project-foundation
```

Suggested commit:

```txt
chore(project): add app foundation and shared utilities
```


Tasks:

- Confirm Next.js + TypeScript app.
- Install dependencies.
- Add folder structure.
- Add environment example.
- Add utility files.

Deliverables:

- Project builds.
- `src/lib/utils.ts`
- `src/lib/api-response.ts`
- `src/types/*`

---

## Phase 1 — Design System Foundation

Branch:

```txt
feature/apex-design-system
```

Suggested commit:

```txt
style(ui): implement Apex Protocol design foundation
```


Tasks:

- Update `globals.css` with Apex Protocol tokens.
- Add font setup.
- Create UI foundation components.
- Create app shell and topbar.
- Ensure navbar has only Dashboard, Quest, Party, Leaderboard.

Deliverables:

- `Button`
- `Input`
- `Card`
- `Badge`
- `SegmentedProgress`
- `PageHeader`
- `Topbar`

---

## Phase 2 — Supabase Setup

Branch:

```txt
feature/supabase-clients
```

Suggested commit:

```txt
feat(auth): add Supabase clients and middleware
```


Tasks:

- Add browser Supabase client.
- Add server Supabase client.
- Add admin Supabase client.
- Add auth helpers.
- Add role helpers.
- Add middleware.

Deliverables:

- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/admin.ts`
- `src/lib/auth.ts`
- `src/lib/roles.ts`
- `src/middleware.ts`

---

## Phase 3 — Database Migration

Branch:

```txt
feature/supabase-schema-rls
```

Suggested commit:

```txt
feat(db): add Supabase schema triggers and RLS policies
```


Tasks:

- Create Supabase migration using `docs/04_DATABASE_SCHEMA_SUPABASE.md`.
- Add RLS policies using `docs/05_SUPABASE_RLS_AUTH_POLICIES.md`.
- Add seed data if useful.

Deliverables:

- Migration files under `supabase/migrations/`
- Tables created
- RLS enabled
- Triggers created

---

## Phase 4 — Auth Pages

Branch:

```txt
feature/auth-flow
```

Suggested commit:

```txt
feat(auth): add login signup and OAuth callback
```


Tasks:

- Build login page.
- Build sign-up page.
- Build forgot-password page.
- Build OAuth callback route if Google OAuth is configured.
- Add logout behavior.

Deliverables:

- `/auth/login`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/oauth-callback`

---

## Phase 5 — API Routes

Branch:

```txt
feature/api-routes
```

Suggested commit:

```txt
feat(api): add jobs parties leaderboard and admin routes
```


Tasks:

- Build public/student APIs.
- Build admin APIs.
- Add response helper usage.
- Validate request bodies.
- Add role checks.

Deliverables:

- `GET /api/jobs`
- `POST /api/apply`
- `GET /api/ranks`
- `GET /api/leaderboard`
- `GET /api/parties`
- `POST /api/parties`
- `POST /api/parties/[id]/join`
- `GET /api/admin/jobs`
- `POST /api/admin/jobs`
- `PUT /api/admin/jobs/[id]`
- `DELETE /api/admin/jobs/[id]`
- `GET /api/admin/job-applications`
- `PATCH /api/admin/job-applications`
- `POST /api/admin/invite`

---

## Phase 6 — Student Dashboard

Branch:

```txt
feature/student-dashboard
```

Suggested commit:

```txt
feat(dashboard): add student progress overview
```


Tasks:

- Fetch current profile and stats.
- Fetch application summary.
- Fetch recommended quests.
- Render dashboard components.

Deliverables:

- `/dashboard`
- dashboard component folder

---

## Phase 7 — Quest Board

Branch:

```txt
feature/questboard
```

Suggested commit:

```txt
feat(quests): add quest browsing and application flow
```


Tasks:

- Build filter UI.
- Fetch jobs with query params.
- Build quest cards.
- Build quest detail modal.
- Implement apply flow.

Deliverables:

- `/questboard`
- `QuestCard`
- `QuestFilters`
- `QuestDetailDialog`

---

## Phase 8 — Party System

Branch:

```txt
feature/party-system
```

Suggested commit:

```txt
feat(parties): add party creation and join flow
```


Tasks:

- Fetch parties.
- Create party flow.
- Join party flow.
- Handle rank requirement errors.

Deliverables:

- `/party-management`
- `PartyCard`
- `CreatePartyDialog`

---

## Phase 9 — Leaderboard

Branch:

```txt
feature/leaderboard
```

Suggested commit:

```txt
feat(leaderboard): add XP ranking views
```


Tasks:

- Fetch leaderboard.
- Build top 3 section.
- Build full table.
- Add empty state.

Deliverables:

- `/leaderboard`
- `TopRankersSection`
- `FullLeaderboardTable`

---

## Phase 10 — Admin Panel

Branch:

```txt
feature/admin-panel
```

Suggested commit:

```txt
feat(admin): add protected job and application management
```


Tasks:

- Build admin layout.
- Build admin overview.
- Build job CRUD pages.
- Build application review page.
- Build invite-code page.

Deliverables:

- `/admin`
- `/admin/jobs`
- `/admin/applications`
- `/admin/invite`
- admin components

---

## Phase 11 — QA Pass

Branch:

```txt
fix/qa-pass
```

Suggested commit:

```txt
fix(qa): resolve build auth and RLS issues
```


Tasks:

- Run lint.
- Run build.
- Check auth redirects.
- Check RLS errors.
- Check duplicate application.
- Check XP award.
- Check rank update.
- Check responsive layout.
- Check admin permissions.

Deliverables:

- Clean build
- Bug fixes
- Final notes

---

## Phase 12 — Deployment Prep

Tasks:

- Add `.env.example`.
- Add deployment checklist.
- Verify production env names.
- Verify Supabase URL and anon key.
- Verify service role is server-only.
- Add Vercel notes.

Deliverables:

- Deployment-ready repo

---

## Phase Completion Git Checkpoint

At the end of every phase, Codex must provide:

```txt
Branch used:
Files changed:
Checks run:
Commit created or recommended:
Remaining work:
```

Before each commit:

```bash
git status
git diff --cached --stat
npm run lint
npm run build
```

If lint/build cannot run yet, state why and commit only when the change is still safely reviewable.
