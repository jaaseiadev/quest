# 09 — UI Page Blueprints

This file gives Codex page-by-page layout instructions.

## Global Student Shell

### Header

```txt
┌──────────────────────────────────────────────────────────────┐
│ GUILD SYSTEM                     Dashboard Quest Party Leaderboard │
│ Rank Badge / Avatar                                         │
└──────────────────────────────────────────────────────────────┘
```

Rules:

- Navbar has exactly four links.
- Active link uses primary red underline or left bracket marker.
- Header is sticky only if it does not hurt mobile usability.
- Use sharp borders.

---

## Dashboard Page

### Purpose

Personal progression overview.

### Layout

```txt
[PAGE LABEL: STUDENT COMMAND]
Welcome back, {display_name}

┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ Current Rank        │ │ Total XP            │ │ Active Applications │
│ Beginner            │ │ 120 XP              │ │ 3 Pending           │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘

[XP PROGRESSION]
Segmented progress bar

[RECENT APPLICATIONS]
Table / compact cards

[RECOMMENDED QUESTS]
3 quest cards
```

### Components

- `WelcomeSection`
- `StatsGrid`
- `RankProgressCard`
- `RecentApplications`
- `RecommendedQuests`

---

## Quest Board Page

### Purpose

Browse and apply to opportunities.

### Layout

```txt
[PAGE LABEL: QUEST BOARD]
Available Operations

[FILTER BAR]
Difficulty | Category | Date Posted | Search

┌─────────────────────────────────────────────────────────────┐
│ QUEST CARD                                                  │
│ Title                                                       │
│ Category / Recommended Rank / Slots                         │
│ Description preview                                         │
│ Pay / Location / Deadline / Reward XP                       │
│ [View Intel] [Apply]                                        │
└─────────────────────────────────────────────────────────────┘
```

### Quest Card Rules

- Reward XP uses gold.
- Apply button uses red.
- Recommended rank badge uses gold border.
- Deadline warning uses danger if near expiration.
- Closed jobs are not shown here.

---

## Quest Detail Modal

### Sections

1. Quest title
2. Company/location/pay
3. Mission brief/description
4. Requirements or recommended rank
5. Available slots
6. Reward XP
7. Deadline
8. Apply CTA

### Modal Style

- Solid dark overlay
- No blur required
- Sharp rectangular panel
- Red close/focus accents

---

## Party Management Page

### Purpose

Create and join student parties.

### Layout

```txt
[PAGE LABEL: PARTY NETWORK]
Build your squad for future quests.

[Create Party Button]

┌──────────────────────────────┐ ┌──────────────────────────────┐
│ PARTY CARD                   │ │ PARTY CARD                   │
│ Frontend Raiders             │ │ Data Sentinels               │
│ Category: Technology         │ │ Category: Analytics          │
│ Min Rank: Apprentice         │ │ Min Rank: Specialist         │
│ Members: 4                   │ │ Members: 2                   │
│ [Join Party]                 │ │ [Locked: Rank Too Low]       │
└──────────────────────────────┘ └──────────────────────────────┘
```

### Create Party Form

Fields:

- Name
- Description
- Category
- Minimum rank

---

## Leaderboard Page

### Purpose

Show top users by XP.

### Layout

```txt
[PAGE LABEL: GLOBAL LEADERBOARD]
Ranked by completed quest XP.

[TOP 3 SECTION]
┌──────────┐ ┌──────────┐ ┌──────────┐
│ #2       │ │ #1       │ │ #3       │
│ Name     │ │ Name     │ │ Name     │
│ XP/Rank  │ │ XP/Rank  │ │ XP/Rank  │
└──────────┘ └──────────┘ └──────────┘

[FULL TABLE]
Rank | Operative | Party | Rank | XP
```

### Rules

- #1 gets strongest gold treatment.
- #2 and #3 get muted prestige treatment.
- Full table remains clean and readable.

---

## Admin Dashboard

### Purpose

Admin overview.

### Layout

```txt
[ADMIN COMMAND CENTER]
Manage quests and applicant progression.

┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ Open Jobs           │ │ Pending Apps        │ │ Completed Quests    │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘

[Recent Applications]
[Recent Jobs]
```

---

## Admin Jobs Page

### Purpose

Create, edit, close jobs.

### Layout

```txt
[ADMIN / JOB CONTROL]
[Create New Quest]

Table:
Title | Category | Slots | Reward XP | Status | Deadline | Actions
```

### Job Form Fields

- Title
- Description
- Category
- Company
- Pay
- Location
- Slots
- Reward XP
- Status
- Deadline
- Recommended rank

---

## Admin Applications Page

### Purpose

Review student applications.

### Layout

```txt
[ADMIN / APPLICATION REVIEW]

Table:
Student | Quest | Status | Submitted | Actions
```

### Actions

- Accept
- Reject
- Mark In Progress
- Complete

### Rules

- Status changes require confirmation only for `completed`.
- Completing must explain that XP will be awarded.

---

## Auth Pages

### Login

```txt
┌──────────────────────────────┐
│ GUILD ACCESS                 │
│ Email                        │
│ Password                     │
│ [Enter Command Center]       │
│ Google OAuth optional        │
└──────────────────────────────┘
```

### Sign Up

```txt
┌──────────────────────────────┐
│ JOIN THE GUILD               │
│ Display Name                 │
│ Email                        │
│ Password                     │
│ [Create Account]             │
└──────────────────────────────┘
```

Auth pages should feel like secure access terminals.
