# 16 — Git Branch and Commit Workflow

This project must use a clean Git workflow so the vibe-coded implementation stays reviewable, recoverable, and easy to present.

## Branch Model

Use three branch levels:

```txt
main
└── develop
    ├── feature/project-foundation
    ├── feature/apex-design-system
    ├── feature/supabase-schema-rls
    ├── feature/auth-flow
    ├── feature/api-routes
    ├── feature/student-dashboard
    ├── feature/questboard
    ├── feature/party-system
    ├── feature/leaderboard
    └── feature/admin-panel
```

### `main`

- Stable, demo-ready, and deployable.
- Only merge into `main` from `develop` after QA passes.
- Do not directly code on `main`.
- Do not commit broken builds to `main`.

### `develop`

- Integration branch for completed features.
- Feature branches start from `develop`.
- Merge completed feature branches back into `develop`.
- `develop` should stay buildable after every merge.

### `feature/*`

- One branch per focused task or phase.
- Branch names must be lowercase and kebab-case.
- Use this pattern:

```txt
feature/<short-scope>
```

Good examples:

```txt
feature/project-foundation
feature/apex-design-system
feature/supabase-schema-rls
feature/auth-flow
feature/questboard
feature/admin-applications
fix/duplicate-application
fix/xp-award-trigger
```

Avoid vague names:

```txt
feature/update
feature/final
feature/new-stuff
feature/codex-work
```

---

## First-Time Git Setup

Run this before letting Codex make the first large implementation pass.

```bash
git init
git add AGENTS.md README.md docs prompts .gitignore .env.example
git commit -m "docs(project): add codex build documentation"
git branch -M main
git checkout -b develop
```

If you already have a GitHub repository:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
git push -u origin develop
```

If the remote already exists:

```bash
git remote -v
git push -u origin main
git push -u origin develop
```

---

## Starting a New Feature

Always branch from `develop`.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<scope-name>
```

Example:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/auth-flow
```

---

## Commit Rules

Use Conventional Commits.

```txt
<type>(<scope>): <short action>
```

Allowed types:

| Type | Use for |
|---|---|
| `feat` | New feature or user-facing behavior |
| `fix` | Bug fix |
| `docs` | Markdown/docs changes |
| `style` | Styling-only UI/CSS changes |
| `refactor` | Code restructuring with no behavior change |
| `test` | Test-related changes |
| `chore` | Tooling, config, maintenance |
| `build` | Build system, dependencies, deployment config |
| `ci` | GitHub Actions or CI config |

Good examples:

```bash
git commit -m "feat(auth): add Supabase login and signup flow"
git commit -m "feat(quests): add questboard filters and apply modal"
git commit -m "fix(applications): prevent duplicate application submission"
git commit -m "style(ui): apply Apex Protocol card and button states"
git commit -m "docs(git): add branch workflow and commit rules"
git commit -m "build(env): add deployment environment example"
```

Bad examples:

```bash
git commit -m "update"
git commit -m "final"
git commit -m "changes"
git commit -m "codex did stuff"
```

---

## Commit Size Rules

Each commit should represent one understandable unit of work.

Good commit size:

- Add Supabase clients.
- Add auth pages.
- Add jobs API route.
- Add quest card UI.
- Fix one RLS policy issue.

Bad commit size:

- Entire app in one commit.
- Mixed auth, UI, admin, and schema changes in one commit.
- Secret keys included by accident.
- Formatting-only changes mixed with logic changes.

---

## Safety Checklist Before Every Commit

Run these before committing:

```bash
git status
npm run lint
npm run build
```

If the project does not have lint/build scripts yet, Codex must explain that clearly and run the closest available check.

Check these manually before committing:

- `.env.local` is not staged.
- `SUPABASE_SERVICE_ROLE_KEY` is not in any committed file.
- `node_modules/` is not staged.
- `.next/` is not staged.
- Supabase local cache files are not staged.
- Feature branch name matches the task.
- The commit message follows Conventional Commits.

Use this command to inspect staged files:

```bash
git diff --cached --stat
git diff --cached --name-only
```

---

## Codex Git Behavior Rules

Codex must follow these rules when editing the project:

1. Before coding, run or inspect:

```bash
git branch --show-current
git status --short
```

2. If currently on `main`, Codex must create or switch to `develop`, then create a feature branch.
3. Codex must not commit directly to `main`.
4. Codex must not commit directly to `develop` unless the task is documentation-only or explicitly approved.
5. Codex must create a feature branch for each implementation phase.
6. Codex must keep commits small and named with Conventional Commits.
7. Codex must run lint/build when practical before committing.
8. Codex must never stage secrets, `.env.local`, `node_modules`, `.next`, or generated cache folders.
9. Codex must show a final summary containing:

```txt
Branch used:
Files changed:
Checks run:
Commit created:
Remaining work:
```

10. If Codex cannot commit because Git is not configured, it must still provide the exact commands and commit message to run manually.

---

## Recommended Phase-to-Branch Map

| Phase | Branch | Commit example |
|---|---|---|
| Phase 0 | `feature/project-foundation` | `chore(project): add app foundation and shared utilities` |
| Phase 1 | `feature/apex-design-system` | `style(ui): implement Apex Protocol design foundation` |
| Phase 2 | `feature/supabase-clients` | `feat(auth): add Supabase clients and middleware` |
| Phase 3 | `feature/supabase-schema-rls` | `feat(db): add Supabase schema triggers and RLS policies` |
| Phase 4 | `feature/auth-flow` | `feat(auth): add login signup and OAuth callback` |
| Phase 5 | `feature/api-routes` | `feat(api): add jobs parties leaderboard and admin routes` |
| Phase 6 | `feature/student-dashboard` | `feat(dashboard): add student progress overview` |
| Phase 7 | `feature/questboard` | `feat(quests): add quest browsing and application flow` |
| Phase 8 | `feature/party-system` | `feat(parties): add party creation and join flow` |
| Phase 9 | `feature/leaderboard` | `feat(leaderboard): add XP ranking views` |
| Phase 10 | `feature/admin-panel` | `feat(admin): add protected job and application management` |
| Phase 11 | `fix/qa-pass` | `fix(qa): resolve build auth and RLS issues` |
| Phase 12 | `build(deploy)` branch optional | `build(deploy): prepare Vercel and Supabase deployment docs` |

---

## Merging Feature Branches

After a feature branch is complete:

```bash
git checkout develop
git pull origin develop
git merge --no-ff feature/<scope-name>
npm run lint
npm run build
git push origin develop
```

If using GitHub, create a pull request from:

```txt
feature/<scope-name> → develop
```

Review the diff before merging.

---

## Releasing to Main

Only do this when the app is demo-ready.

```bash
git checkout develop
npm run lint
npm run build
git checkout main
git pull origin main
git merge --no-ff develop
git tag -a v0.1.0 -m "Guild System MVP v0.1.0"
git push origin main --tags
```

---

## Emergency Fix Flow

For urgent fixes after merging:

```bash
git checkout develop
git pull origin develop
git checkout -b fix/<bug-name>
```

Example:

```bash
git checkout -b fix/xp-award-trigger
```

Commit format:

```bash
git commit -m "fix(xp): award completion XP only once"
```

---

## Files That Must Never Be Committed

Never commit these:

```txt
.env
.env.local
.env.*.local
SUPABASE_SERVICE_ROLE_KEY values
node_modules/
.next/
out/
.vercel/
coverage/
.DS_Store
*.log
```

Use `.env.example` for placeholder environment names only.

---

## Simple Manual Workflow for You

When you want Codex to build a part, do this:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/questboard
```

Then paste the relevant task prompt into Codex.

After Codex finishes:

```bash
npm run lint
npm run build
git status
git add .
git commit -m "feat(quests): add questboard browsing and apply flow"
git push -u origin feature/questboard
```

Then merge it into `develop` using GitHub pull request or locally with `git merge --no-ff`.
