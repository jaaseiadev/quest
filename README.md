# Guild-Based Job Opportunity Management System — Codex Vibe Coding Pack

This folder contains the markdown files needed to guide Codex through building the **Guild-Based Job Opportunity Management System** with:

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Role-based access control
- Admin management
- Student quest workflow
- Revised **Apex Protocol** design system

The goal of this pack is to make Codex work like a project teammate, not just a code generator. Each file gives Codex a specific source of truth.

---

## Recommended File Placement

Copy these files into your project root:

```txt
your-project/
├── AGENTS.md
├── README.md
├── .env.example
├── .gitignore
├── .github/
│   └── pull_request_template.md
├── .vscode/
│   ├── extensions.json
│   └── settings.example.json
├── docs/
│   ├── 00_PROJECT_BRIEF.md
│   ├── 01_PRODUCT_REQUIREMENTS.md
│   ├── 02_INFORMATION_ARCHITECTURE.md
│   ├── 03_APP_ARCHITECTURE.md
│   ├── 04_DATABASE_SCHEMA_SUPABASE.md
│   ├── 05_SUPABASE_RLS_AUTH_POLICIES.md
│   ├── 06_API_CONTRACTS.md
│   ├── 07_FRONTEND_INTEGRATION_SUPABASE.md
│   ├── 08_DESIGN_SYSTEM_APEX_PROTOCOL_REVISED.md
│   ├── 09_UI_PAGE_BLUEPRINTS.md
│   ├── 10_COMPONENT_SPECIFICATIONS.md
│   ├── 11_IMPLEMENTATION_PLAN_CODEX.md
│   ├── 12_SEED_DATA_AND_DEMO_FLOW.md
│   ├── 13_QA_ACCEPTANCE_CHECKLIST.md
│   ├── 14_DEPLOYMENT_ENV.md
│   ├── 15_SOURCE_ALIGNMENT_NOTES.md
│   └── 16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md
└── prompts/
    ├── MASTER_BUILD_PROMPT.md
    └── CODEX_TASK_PROMPTS.md
```

---

## How to Use This Pack With Codex

### Step 1 — Start a Fresh Project

Create your Next.js app:

```bash
npx create-next-app@latest guild-system --ts --eslint --app --src-dir
cd guild-system
```

Install expected dependencies:

```bash
npm install @supabase/supabase-js @supabase/ssr framer-motion lucide-react clsx class-variance-authority tailwind-merge @radix-ui/react-label @radix-ui/react-slot
```

Then paste this pack into the project root.

---

### Step 2 — Set Up Git Branches Before Coding

Use `docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md` before starting the implementation.

Recommended starting commands:

```bash
git init
git add AGENTS.md README.md docs prompts .gitignore .env.example .github .vscode
git commit -m "docs(project): add codex build documentation"
git branch -M main
git checkout -b develop
```

For every feature or phase, branch from `develop`:

```bash
git checkout develop
git checkout -b feature/<scope-name>
```

Never code directly on `main`.

---

### Step 3 — Give Codex the Master Prompt

Open `prompts/MASTER_BUILD_PROMPT.md`, copy everything, and send it to Codex.

This prompt tells Codex to read the documentation first, follow the implementation phases, respect the Apex Protocol design system, and not invent features outside the spec.

---

### Step 4 — Build by Phases, Not All at Once

Use the task prompts in `prompts/CODEX_TASK_PROMPTS.md` one by one.

Recommended order:

1. Project cleanup and folder structure
2. Supabase clients and environment config
3. Database migration
4. Auth flow
5. API routes
6. Student pages
7. Party system
8. Leaderboard
9. Admin panel
10. Design polish
11. QA and bug fix pass
12. Deployment prep

Do not ask Codex to build everything in a single huge task unless the repo is still empty. Smaller tasks give cleaner diffs.

---

## Important Project Rules

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend.
- Use Supabase client-side only for auth/session and safe user-owned reads.
- Use API routes for admin operations and protected mutations.
- Protect `/admin/*` with middleware and server-side role checks.
- Create profiles automatically after signup using a Supabase trigger.
- Award XP only once when a job application is marked `completed`.
- Follow the Git workflow in `docs/16_GIT_BRANCH_AND_COMMIT_WORKFLOW.md`.
- Keep `main` stable, use `develop` for integration, and use `feature/*` branches for work.
- Use Conventional Commits for every checkpoint.
- Never commit secrets, `.env.local`, `.next/`, or `node_modules/`.
- Keep the nav limited to exactly four student links:
  - Dashboard
  - Quest
  - Party
  - Leaderboard

---

## Design Direction

Use the revised **Apex Protocol** design system:

- Dark command-console UI
- Solid colors only
- No flashy gradients
- Riot-inspired red for primary actions
- Tactical gold for rank and prestige moments
- Sharp corners
- Border-driven depth
- Segmented XP bars
- Subtle game feel, but still professional

See `docs/08_DESIGN_SYSTEM_APEX_PROTOCOL_REVISED.md`.

---

## Final Deliverable Target

Codex should produce a working MVP where:

- Students can sign up and log in.
- Students can browse quests/jobs.
- Students can apply to quests.
- Students can see XP, rank, and application status.
- Students can create and join parties.
- Students can view leaderboard rankings.
- Admins can create/manage jobs.
- Admins can review applications.
- Completing an application awards XP and updates rank.
- UI follows Apex Protocol consistently.
