# Master Build Prompt for Codex

You are Codex working inside my repository for the **Guild-Based Job Opportunity Management System**.

Your job is to build the MVP using the markdown documentation in this repo as the source of truth.

Before writing code, read:

1. `AGENTS.md`
2. `docs/00_PROJECT_BRIEF.md`
3. `docs/01_PRODUCT_REQUIREMENTS.md`
4. `docs/02_INFORMATION_ARCHITECTURE.md`
5. `docs/03_APP_ARCHITECTURE.md`
6. `docs/04_DATABASE_SCHEMA_SUPABASE.md`
7. `docs/05_SUPABASE_RLS_AUTH_POLICIES.md`
8. `docs/06_API_CONTRACTS.md`
9. `docs/07_FRONTEND_INTEGRATION_SUPABASE.md`
10. `docs/08_DESIGN_SYSTEM_APEX_PROTOCOL_REVISED.md`
11. `docs/09_UI_PAGE_BLUEPRINTS.md`
12. `docs/10_COMPONENT_SPECIFICATIONS.md`
13. `docs/11_IMPLEMENTATION_PLAN_CODEX.md`
14. `docs/13_QA_ACCEPTANCE_CHECKLIST.md`
15. `docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md`

## Build Goal

Create a working Next.js + TypeScript + Supabase MVP where:

- Students can sign up, log in, and log out.
- Students can view dashboard stats.
- Students can browse jobs as quests.
- Students can apply to quests.
- Students can create and join parties.
- Students can view leaderboard rankings.
- Admins can create and manage jobs.
- Admins can review applications.
- Completing an application awards XP once.
- XP automatically maps to ranks.
- The UI follows the revised Apex Protocol design system.

## Important Design Rule

Follow `docs/08_DESIGN_SYSTEM_APEX_PROTOCOL_REVISED.md`.

The UI must be:

- dark
- sharp
- professional
- border-driven
- tactical
- not flashy
- not gradient-heavy
- not rounded SaaS style

The navbar must only have:

- Dashboard
- Quest
- Party
- Leaderboard

## Important Security Rule

- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Use server route handlers for admin logic.
- Use Supabase RLS.
- Use middleware for route protection.
- Verify admin role server-side.

## Git Workflow Instructions

Before coding:

1. Check the current branch and working tree:

```bash
git branch --show-current
git status --short
```

2. Do not work directly on `main`.
3. Use `main` as the stable/demo branch.
4. Use `develop` as the integration branch.
5. Use a focused `feature/*` or `fix/*` branch for the current phase.
6. Follow `docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md`.
7. Use Conventional Commits.
8. Never stage secrets, `.env.local`, `.next/`, `node_modules/`, or logs.
9. At the end of each phase, provide a Git checkpoint summary.

If Git is not initialized, initialize it and create `main` and `develop` before feature implementation. If Git user identity or remote is missing, do not fake a commit or push; provide the exact command the user needs.

## Implementation Instructions

Work in phases from `docs/11_IMPLEMENTATION_PLAN_CODEX.md`.

For each phase:

1. Inspect existing files first.
2. Implement only what belongs to the current phase.
3. Keep code typed.
4. Add useful loading, empty, and error states.
5. Keep UI consistent with Apex Protocol.
6. Run lint/build when practical.
7. Report what changed and what remains.

Start with Phase -1, Phase 0, and Phase 1 unless the project already contains those parts.
