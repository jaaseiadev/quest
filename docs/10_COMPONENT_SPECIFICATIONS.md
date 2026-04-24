# 10 — Component Specifications

## UI Foundation Components

Create reusable components under:

```txt
src/components/ui/
```

Recommended:

- `Button.tsx`
- `Input.tsx`
- `Label.tsx`
- `Card.tsx`
- `Badge.tsx`
- `SegmentedProgress.tsx`
- `EmptyState.tsx`
- `LoadingState.tsx`
- `StatusChip.tsx`
- `PageHeader.tsx`
- `DataTable.tsx`

---

## Button

### Variants

| Variant | Use |
|---|---|
| `primary` | Main CTA |
| `secondary` | Secondary CTA |
| `ghost` | Low-emphasis action |
| `danger` | Delete/reject action |
| `gold` | Rank/prestige action |

### Sizes

| Size | Height |
|---|---|
| `sm` | 36px |
| `md` | 48px |
| `lg` | 56px |

### Style Rules

- Sharp corners
- Uppercase label
- Space Grotesk
- Letter spacing
- Instant hover color inversion

---

## Card

### Variants

| Variant | Use |
|---|---|
| `default` | Standard surfaces |
| `interactive` | Hoverable quest/party cards |
| `danger` | Admin warnings |
| `prestige` | Rank/leaderboard cards |

### Base Classes

```tsx
border border-border bg-card p-6 text-card-foreground
```

---

## Badge / StatusChip

### Rank Badge

Gold border and gold text.

### Quest Type Badge

Red border and primary-soft text.

### Status Colors

| Status | Style |
|---|---|
| pending | muted border |
| accepted | gold border |
| in_progress | primary border |
| completed | success border |
| rejected | danger border |

---

## SegmentedProgress

### Props

```ts
type SegmentedProgressProps = {
  value: number
  max: number
  segments?: number
  label?: string
}
```

### Behavior

- Default segments: 10
- Filled segments = rounded percentage
- Show numeric label if provided
- Use gold fill

---

## QuestCard

Path:

```txt
src/components/questboard/QuestCard.tsx
```

### Props

```ts
type QuestCardProps = {
  job: JobListItem
  hasApplied?: boolean
  onView?: () => void
  onApply?: () => void
}
```

### Displays

- Title
- Category
- Recommended rank
- Description preview
- Location
- Pay
- Slots
- Reward XP
- Deadline
- View details button
- Apply button

### States

- Available
- Already applied
- Full slots
- Deadline passed

---

## QuestFilters

Path:

```txt
src/components/questboard/QuestFilters.tsx
```

Fields:

- Search
- Difficulty
- Category
- Date posted

Should update query state and reload data.

---

## Dashboard Components

### `WelcomeSection`

Displays:

- Display name
- Rank label
- short motivational copy

### `StatsGrid`

Cards:

- Total XP
- Current rank
- Active applications
- Completed quests

### `RankProgressCard`

Displays:

- Current rank
- Next rank
- Segmented XP bar
- XP needed

### `RecentApplications`

Displays:

- Job title
- Status
- Date applied
- Reward XP

---

## Party Components

### `PartyCard`

Displays:

- Party name
- Category
- Leader
- Member count
- Minimum rank
- Join button / locked state

### `CreatePartyDialog`

Fields:

- name
- description
- category
- min_rank_id

---

## Leaderboard Components

### `TopRankersSection`

Displays top 3.

### `FullLeaderboardTable`

Displays:

- rank number
- display name
- party
- rank
- XP

---

## Admin Components

### `JobForm`

Fields:

- title
- description
- category
- company
- pay
- location
- slots
- reward_xp
- status
- deadline
- recommended_rank_id

### `AdminJobsTable`

Actions:

- edit
- close
- delete if needed

### `JobApplicationsTable`

Actions:

- accept
- reject
- in progress
- complete

### `AdminStatCards`

Stats:

- open jobs
- pending applications
- completed applications
- total students

---

## Shared Components

### `AppShell`

Student layout wrapper.

### `AdminShell`

Admin layout wrapper.

### `Topbar`

Shows logo, navigation, user menu.

### `MobileNav`

Use simple drawer or stacked nav. Keep four links only.

---

## Accessibility Rules

- Buttons must be real `<button>` or links.
- Inputs must have labels.
- Dialogs must trap focus if using modal behavior.
- Do not rely on color alone for statuses.
- Tables must have proper headers.
- Focus states must be visible.
