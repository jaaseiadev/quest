# 00 — Project Brief

## Project Name

**Guild-Based Job Opportunity Management System**

## One-Line Description

A gamified job discovery and application platform where students browse job opportunities as quests, earn XP, progress through ranks, form parties, and track application progress while admins manage postings and applicants.

---

## Core Purpose

Enable students to explore and apply to job opportunities in a gamified environment using:

- Quest board metaphor
- XP rewards
- Rank progression
- Party/guild collaboration
- Leaderboard visibility
- Admin job and application management

---

## Target Users

### Students

Students use the system to:

- Browse available job opportunities
- Apply to jobs
- Track application status
- Earn XP from completed work
- Increase rank
- Create or join parties
- Compare progress through the leaderboard

### Administrators

Admins use the system to:

- Create job postings
- Edit job postings
- Delete/close job postings
- Review student applications
- Accept, reject, or complete applications
- Promote users to admin through an invite-code system

---

## MVP Success Criteria

The MVP is successful when:

1. A student can sign up, log in, and view the dashboard.
2. A student can browse and filter quests/jobs.
3. A student can apply to a job only once.
4. A student can see application status changes.
5. An admin can create and manage job posts.
6. An admin can update application statuses.
7. Completing an application awards XP once.
8. XP automatically maps to a rank.
9. Students can create and join parties.
10. A leaderboard displays top users by XP.
11. Routes are protected by authentication and role checks.
12. The UI follows the revised Apex Protocol design system.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Language | TypeScript |
| Framework | Next.js App Router |
| Runtime | React |
| Styling | Tailwind CSS |
| UI Helpers | Radix UI, Lucide React |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Animation | Framer Motion |
| Utility Styling | clsx, tailwind-merge, class-variance-authority |

---

## Product Metaphor

| Real Concept | Guild System Metaphor |
|---|---|
| Job posting | Quest |
| Application | Quest attempt |
| Applicant | Adventurer / operative |
| Completed job | Cleared quest |
| Student group | Party |
| Skill level | Rank |
| Career progress | XP progression |
| Admin panel | Command center |

---

## Tone

The product should feel like a professional command console, not a cartoon game.

Keywords:

- tactical
- elite
- precise
- rank-driven
- command-board
- subtle game interface
- professional esports
- high-stakes opportunity board
