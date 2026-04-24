# AGENTS.md — Codex Instructions for Guild System

You are working on the **Guild-Based Job Opportunity Management System**, a Next.js + TypeScript + Supabase student project.

Before coding, read these files in order:

1. `docs/00_PROJECT_BRIEF.md`
2. `docs/01_PRODUCT_REQUIREMENTS.md`
3. `docs/03_APP_ARCHITECTURE.md`
4. `docs/04_DATABASE_SCHEMA_SUPABASE.md`
5. `docs/05_SUPABASE_RLS_AUTH_POLICIES.md`
6. `docs/06_API_CONTRACTS.md`
7. `docs/07_FRONTEND_INTEGRATION_SUPABASE.md`
8. `docs/08_DESIGN_SYSTEM_APEX_PROTOCOL_REVISED.md`
9. `docs/11_IMPLEMENTATION_PLAN_CODEX.md`
10. `docs/13_QA_ACCEPTANCE_CHECKLIST.md`
11. `docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md`

---

## Non-Negotiable Rules

### Tech Stack

Use:

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- API routes for protected server logic
- Framer Motion only for subtle micro-interactions
- Lucide React for icons
- Radix primitives only when useful for accessibility

### Security

- Never put `SUPABASE_SERVICE_ROLE_KEY` in client components.
- Never import service-role Supabase clients into files with `"use client"`.
- All admin mutations must happen in server route handlers.
- All admin endpoints must verify the current user role.
- Student users can only mutate their own applications, party membership, and profile data.
- Use database constraints to prevent duplicate applications and duplicate party memberships.

### Design

Follow `docs/08_DESIGN_SYSTEM_APEX_PROTOCOL_REVISED.md`.

The visual style is:

- Tactical
- Dark
- Modern
- Professional
- Subtle game feel
- No childish fantasy UI
- No flashy gradients
- No rounded soft SaaS look
- Sharp corners
- Border-based depth
- Command-console hierarchy

The student navbar must only contain:

1. Dashboard
2. Quest
3. Party
4. Leaderboard


### Git Workflow

Follow `docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md`.

- Keep `main` stable and demo-ready.
- Use `develop` as the integration branch.
- Use one `feature/*` or `fix/*` branch per implementation task.
- Never code or commit directly on `main`.
- Do not commit directly to `develop` unless the user explicitly asks or the change is documentation-only.
- Use Conventional Commits: `feat(scope): summary`, `fix(scope): summary`, `docs(scope): summary`, `style(scope): summary`, `chore(scope): summary`.
- Before committing, run `git status`, inspect staged files, and run `npm run lint` / `npm run build` when practical.
- Never stage `.env.local`, secrets, `node_modules/`, `.next/`, logs, or generated caches.
- If Git is not configured, provide the exact branch and commit commands instead of pretending the commit was made.

### Naming

- Components: PascalCase
- Utilities: camelCase or kebab-case
- Types: PascalCase for exported interfaces/types
- API routes: REST-like route folders
- Database tables: snake_case
- CSS variables: kebab-case

---

## Implementation Behavior

When implementing:

1. Inspect existing files before editing.
2. Keep changes minimal and connected to the current task.
3. Prefer server components for data-loading pages.
4. Use client components only for interactivity.
5. Add loading and empty states.
6. Add error handling for failed API calls.
7. Keep the app buildable after every task.
8. Run lint/build when practical.
9. Explain final changes and any remaining work.
10. At the end of every phase, provide a Git checkpoint summary: branch used, files changed, checks run, commit message used or recommended, and remaining work.

---

## Do Not

- Do not invent features outside the markdown spec.
- Do not add unnecessary libraries.
- Do not replace the design system with gradients, glassmorphism, or cute fantasy styling.
- Do not make the entire app client-side.
- Do not bypass Supabase RLS using client keys.
- Do not store sensitive values in local storage.
- Do not hardcode admin users in the frontend.
