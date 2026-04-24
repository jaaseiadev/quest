# Codex Task Prompts

Use these prompts one by one. Each implementation task should happen on a focused branch from `develop` and end with a Git checkpoint summary.

---

## Task -1 — Git Workflow Setup

```txt
Read docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md. Inspect the current Git state with git branch --show-current and git status --short. If Git is not initialized, initialize it, add the documentation pack, commit it with "docs(project): add codex build documentation", rename the stable branch to main, and create develop. Do not start feature implementation yet. If Git user identity or remote is missing, tell me the exact commands I need to run.
```

---

## Task 0 — Inspect Repo

```txt
Read AGENTS.md and all docs/*.md files, especially docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md. Then inspect the current repository structure and Git branch. Do not code yet. Give me a concise implementation plan based on what already exists and what is missing. Recommend the first feature branch name.
```

---

## Task 1 — Project Foundation

Branch: `feature/project-foundation`  
Commit: `chore(project): add app foundation and shared utilities`

```txt
Create or switch to branch feature/project-foundation from develop. Implement Phase 0 from docs/11_IMPLEMENTATION_PLAN_CODEX.md. Set up the expected folder structure, shared utilities, API response helpers, base TypeScript types, and .env.example. Do not implement feature pages yet. Keep the project buildable. Run lint/build when practical. End with a Git checkpoint summary and commit using: chore(project): add app foundation and shared utilities
```

---

## Task 2 — Apex Protocol Design System

Branch: `feature/apex-design-system`  
Commit: `style(ui): implement Apex Protocol design foundation`

```txt
Create or switch to branch feature/apex-design-system from develop. Implement Phase 1 using docs/08_DESIGN_SYSTEM_APEX_PROTOCOL_REVISED.md and docs/10_COMPONENT_SPECIFICATIONS.md. Update globals.css, fonts, base layout styles, and reusable UI components. Make the UI dark, sharp, border-driven, and professional. Do not use flashy gradients or rounded SaaS styling. Run lint/build when practical. End with a Git checkpoint summary and commit using: style(ui): implement Apex Protocol design foundation
```

---

## Task 3 — Supabase Clients and Middleware

Branch: `feature/supabase-clients`  
Commit: `feat(auth): add Supabase clients and middleware`

```txt
Create or switch to branch feature/supabase-clients from develop. Implement Phase 2 using docs/07_FRONTEND_INTEGRATION_SUPABASE.md and docs/05_SUPABASE_RLS_AUTH_POLICIES.md. Create browser, server, and admin Supabase clients, auth helpers, role helpers, and middleware route protection. Never expose the service role key to client files. Run lint/build when practical. End with a Git checkpoint summary and commit using: feat(auth): add Supabase clients and middleware
```

---

## Task 4 — Database Migration

Branch: `feature/supabase-schema-rls`  
Commit: `feat(db): add Supabase schema triggers and RLS policies`

```txt
Create or switch to branch feature/supabase-schema-rls from develop. Implement Phase 3 using docs/04_DATABASE_SCHEMA_SUPABASE.md and docs/05_SUPABASE_RLS_AUTH_POLICIES.md. Create Supabase migration files for tables, constraints, triggers, seed roles/ranks, and RLS policies. Include the auto-profile trigger and XP/rank triggers. Run lint/build when practical. End with a Git checkpoint summary and commit using: feat(db): add Supabase schema triggers and RLS policies
```

---

## Task 5 — Auth Pages

Branch: `feature/auth-flow`  
Commit: `feat(auth): add login signup and OAuth callback`

```txt
Create or switch to branch feature/auth-flow from develop. Implement Phase 4. Build login, sign-up, forgot-password, logout behavior, and OAuth callback route if needed. Use Supabase Auth and the Apex Protocol access-terminal style. Run lint/build when practical. End with a Git checkpoint summary and commit using: feat(auth): add login signup and OAuth callback
```

---

## Task 6 — API Routes

Branch: `feature/api-routes`  
Commit: `feat(api): add jobs parties leaderboard and admin routes`

```txt
Create or switch to branch feature/api-routes from develop. Implement Phase 5 using docs/06_API_CONTRACTS.md. Build all public/student and admin route handlers. Use consistent API response shapes, auth checks, role checks, validation, and safe Supabase access patterns. Run lint/build when practical. End with a Git checkpoint summary and commit using: feat(api): add jobs parties leaderboard and admin routes
```

---

## Task 7 — Student Dashboard

Branch: `feature/student-dashboard`  
Commit: `feat(dashboard): add student progress overview`

```txt
Create or switch to branch feature/student-dashboard from develop. Implement Phase 6. Build /dashboard using docs/09_UI_PAGE_BLUEPRINTS.md and docs/10_COMPONENT_SPECIFICATIONS.md. Show profile, rank, XP, segmented progress, application summary, and recommended quests. Include loading, empty, and error states. Run lint/build when practical. End with a Git checkpoint summary and commit using: feat(dashboard): add student progress overview
```

---

## Task 8 — Quest Board

Branch: `feature/questboard`  
Commit: `feat(quests): add quest browsing and application flow`

```txt
Create or switch to branch feature/questboard from develop. Implement Phase 7. Build /questboard with filters, quest cards, quest detail modal, and application flow. Use /api/jobs and /api/apply. Prevent confusing duplicate apply UI and follow the Apex Protocol card/button styling. Run lint/build when practical. End with a Git checkpoint summary and commit using: feat(quests): add quest browsing and application flow
```

---

## Task 9 — Party System

Branch: `feature/party-system`  
Commit: `feat(parties): add party creation and join flow`

```txt
Create or switch to branch feature/party-system from develop. Implement Phase 8. Build /party-management with party list, create party dialog, join flow, member counts, min rank display, and locked states when rank is too low. Run lint/build when practical. End with a Git checkpoint summary and commit using: feat(parties): add party creation and join flow
```

---

## Task 10 — Leaderboard

Branch: `feature/leaderboard`  
Commit: `feat(leaderboard): add XP ranking views`

```txt
Create or switch to branch feature/leaderboard from develop. Implement Phase 9. Build /leaderboard with top 3 cards and full leaderboard table. Use XP sorting and show rank and party affiliation. Keep the design tactical, readable, and not flashy. Run lint/build when practical. End with a Git checkpoint summary and commit using: feat(leaderboard): add XP ranking views
```

---

## Task 11 — Admin Panel

Branch: `feature/admin-panel`  
Commit: `feat(admin): add protected job and application management`

```txt
Create or switch to branch feature/admin-panel from develop. Implement Phase 10. Build protected admin layout, admin overview, admin jobs management, job form, and application review. Status updates must follow docs/06_API_CONTRACTS.md. Completing an application must award XP once through the database trigger. Run lint/build when practical. End with a Git checkpoint summary and commit using: feat(admin): add protected job and application management
```

---

## Task 12 — QA Pass

Branch: `fix/qa-pass`  
Commit: `fix(qa): resolve build auth and RLS issues`

```txt
Create or switch to branch fix/qa-pass from develop. Run a QA pass using docs/13_QA_ACCEPTANCE_CHECKLIST.md. Fix build errors, TypeScript errors, auth redirect issues, RLS/query issues, and obvious UI inconsistencies. Do not add new features unless needed to satisfy the checklist. Run lint/build. End with a Git checkpoint summary and commit using: fix(qa): resolve build auth and RLS issues
```

---

## Task 13 — Deployment Prep

Branch: `build/deployment-prep`  
Commit: `build(deploy): prepare deployment configuration and docs`

```txt
Create or switch to branch build/deployment-prep from develop. Prepare the project for deployment using docs/14_DEPLOYMENT_ENV.md. Verify .env.example, update README setup steps if needed, check build, and document any remaining manual Supabase setup steps. End with a Git checkpoint summary and commit using: build(deploy): prepare deployment configuration and docs
```

---

## Task 14 — UI Polish

Branch: `style/ui-polish`  
Commit: `style(ui): polish Apex Protocol responsive details`

```txt
Create or switch to branch style/ui-polish from develop. Polish the UI using docs/08_DESIGN_SYSTEM_APEX_PROTOCOL_REVISED.md. Make spacing, typography, borders, hover states, XP bars, badges, status chips, tables, and mobile responsiveness consistent. Do not introduce gradients, glassmorphism, or rounded SaaS styling. Run lint/build when practical. End with a Git checkpoint summary and commit using: style(ui): polish Apex Protocol responsive details
```

---

## Emergency Bugfix Prompt

```txt
Create or switch to a fix/<bug-name> branch from develop. Find and fix the cause of the current error. Inspect the relevant files first, make the smallest safe fix, keep the app aligned with the docs, run the relevant check, then end with a Git checkpoint summary and a Conventional Commit message.
```

---

## Review Prompt

```txt
Review the current implementation against docs/13_QA_ACCEPTANCE_CHECKLIST.md and docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md. Create a prioritized list of missing or weak parts, then fix the top issues that block a clean demo. Use a focused fix/* branch and end with a Git checkpoint summary.
```
