# 15 — Source Alignment Notes

This pack is based on the Guild-Based Job Opportunity Management System technical documentation and expands it into implementation-ready files.

## Preserved from the Technical Documentation

- Next.js + TypeScript + Supabase + Tailwind stack
- App Router architecture
- API route pattern under `/app/api`
- Student modules:
  - dashboard
  - questboard
  - party-management
  - leaderboard
- Admin module
- Supabase Auth
- RBAC with student/admin roles
- Tables:
  - roles
  - ranks
  - profiles
  - user_stats
  - jobs
  - job_applications
  - parties
  - party_members
- Application statuses:
  - pending
  - accepted
  - in_progress
  - completed
  - rejected
- Rank thresholds:
  - Beginner
  - Apprentice
  - Specialist
  - Expert
  - Master
  - Grandmaster

## Improvements Added for Vibe Coding Readiness

The original technical documentation listed some known limitations. This pack turns those limitations into implementation tasks:

1. Missing migrations are solved with a complete Supabase schema.
2. Missing auto-profile creation is solved with an Auth trigger.
3. XP/rank automation is specified with database triggers.
4. XP double-awarding is prevented with `xp_awarded`.
5. RLS policies are included.
6. Frontend/Supabase integration files are specified.
7. A full Codex implementation plan is included.
8. The design system is revised into implementation-ready tokens and component recipes.

## Design System Revision

The pasted Apex Protocol design direction is preserved but clarified:

- Primary action red is standardized as `#D13639`.
- Gold is standardized as `#C89B3C`.
- The softer pasted values are retained as supporting tokens.
- The style remains dark, sharp, tactical, and professional.
- The implementation avoids flashy gradients and playful game UI.
