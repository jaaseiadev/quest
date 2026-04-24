# 08 — Revised Design System: Apex Protocol

## Design System Name

**Apex Protocol**

## Design Goal

Apex Protocol turns the Guild System into a serious tactical career platform. It should feel like a command console for elite student operators viewing missions, ranks, and progression.

The design must be modern and creative, but not flashy.

Avoid:

- neon overload
- childish fantasy styling
- colorful gradients
- soft SaaS cards
- excessive blur/glassmorphism
- over-rounded corners

Use:

- solid dark surfaces
- strong typography
- sharp cards
- border-driven hierarchy
- tactical red
- prestige gold
- segmented progression
- precise data layout

---

## Brand Keywords

- tactical
- professional
- elite
- command board
- rank progression
- structured
- disciplined
- esports broadcast
- Solo Leveling-inspired system UI
- Riot-style confidence, but less flashy

---

## Revised Color Tokens

The pasted design used multiple related red and gold tokens. This revised version keeps the mood but makes the token roles clearer for implementation.

```css
:root {
  --background: #121414;
  --foreground: #e2e2e2;

  --surface: #121414;
  --surface-dim: #0c0f0f;
  --surface-container-low: #1a1c1c;
  --surface-container: #1e2020;
  --surface-container-high: #282a2b;
  --surface-container-highest: #333535;

  --primary: #d13639;
  --primary-hover: #ff4d4f;
  --primary-soft: #ffb3ae;
  --on-primary: #fff4f3;

  --secondary: #c89b3c;
  --secondary-hover: #f0bf5c;
  --secondary-soft: #ffe9c6;
  --on-secondary: #261900;

  --tertiary: #c8c6c5;
  --muted: #727171;
  --muted-foreground: #9c9c9c;

  --border: #38393a;
  --border-strong: #5a403e;
  --outline: #aa8986;

  --success: #7bbf6a;
  --warning: #f0bf5c;
  --danger: #ffb4ab;

  --card: #1a1c1c;
  --card-foreground: #e2e2e2;

  --input: #282a2b;
  --ring: #d13639;

  --radius: 0px;
}
```

---

## Tailwind CSS 4 Theme Mapping

Add this to `src/app/globals.css` and adjust if Tailwind generated defaults already exist.

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-surface: var(--surface);
  --color-surface-dim: var(--surface-dim);
  --color-surface-container-low: var(--surface-container-low);
  --color-surface-container: var(--surface-container);
  --color-surface-container-high: var(--surface-container-high);
  --color-surface-container-highest: var(--surface-container-highest);

  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-soft: var(--primary-soft);
  --color-on-primary: var(--on-primary);

  --color-secondary: var(--secondary);
  --color-secondary-hover: var(--secondary-hover);
  --color-secondary-soft: var(--secondary-soft);
  --color-on-secondary: var(--on-secondary);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-outline: var(--outline);

  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --font-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;

  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
}
```

---

## Font Imports

Use either `next/font/google` or CSS import.

Preferred with `next/font/google` in `src/app/layout.tsx`:

```ts
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})
```

Then map CSS:

```css
:root {
  --font-display: var(--font-space-grotesk);
  --font-sans: var(--font-inter);
}
```

---

## Typography Scale

| Token | Font | Size | Weight | Use |
|---|---|---:|---:|---|
| `display-lg` | Space Grotesk | 72px | 700 | Hero statements |
| `headline-xl` | Space Grotesk | 48px | 700 | Page headers |
| `headline-lg` | Space Grotesk | 36px | 700 | Section headers |
| `headline-md` | Space Grotesk | 24px | 600 | Card titles |
| `body-lg` | Inter | 18px | 400 | Large body |
| `body-md` | Inter | 16px | 400 | Body |
| `body-sm` | Inter | 14px | 400 | Metadata |
| `label-caps` | Space Grotesk | 12px | 700 | Status labels |

### Utility Classes

```css
@layer utilities {
  .text-display-lg {
    font-family: var(--font-display);
    font-size: clamp(3rem, 7vw, 4.5rem);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .text-headline-xl {
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 5vw, 3rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  .text-headline-md {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }

  .text-label-caps {
    font-family: var(--font-display);
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
}
```

---

## Layout System

### Grid

- Desktop: fixed 12-column grid
- Max width: `1440px`
- Edge margin: `64px` on desktop
- Mobile margin: `16px`
- Gutter: `24px`

### Main Container

```tsx
<div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-16">
  {children}
</div>
```

### Page Rhythm

- Page header margin bottom: `32px`
- Major sections gap: `48px`
- Card internal padding: `24px`
- Dense table padding: `16px`

---

## Shape Language

Use sharp corners everywhere.

```txt
border-radius: 0px
```

For special rank badges and quest chips, use chamfered corners:

```css
.clip-chamfer {
  clip-path: polygon(
    10px 0,
    100% 0,
    100% calc(100% - 10px),
    calc(100% - 10px) 100%,
    0 100%,
    0 10px
  );
}
```

---

## Elevation and Depth

No soft shadows.

Use:

- solid surfaces
- 1px borders
- 2px active borders
- subtle grid lines
- tonal layering

Recommended layers:

| Layer | Color |
|---|---|
| Background | `#121414` |
| Low container | `#1a1c1c` |
| Card | `#1e2020` |
| Raised/hover | `#282a2b` |
| Modal | `#0c0f0f` with solid overlay |

---

## Motion Rules

Use Framer Motion only for small interaction feedback.

Allowed:

- opacity fade in
- 4px vertical slide
- border color change
- instant hover inversion

Avoid:

- bouncing
- rubber motion
- excessive page animations
- spinning game effects

Recommended transition:

```txt
duration: 120ms
ease: linear or easeOut
```

---

## Component Recipes

### Primary Button

```tsx
className="
  inline-flex h-12 items-center justify-center border-2 border-primary
  bg-primary px-6 font-display text-xs font-bold uppercase tracking-[0.14em]
  text-on-primary transition-colors duration-100
  hover:bg-transparent hover:text-primary
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
"
```

### Secondary Button

```tsx
className="
  inline-flex h-12 items-center justify-center border-2 border-border-strong
  bg-transparent px-6 font-display text-xs font-bold uppercase tracking-[0.14em]
  text-foreground transition-colors duration-100
  hover:border-secondary hover:text-secondary
"
```

### Quest Card

```tsx
className="
  border border-border bg-card p-6 text-card-foreground
  transition-colors duration-100
  hover:border-secondary hover:bg-surface-container-high
"
```

### Rank Badge

```tsx
className="
  clip-chamfer inline-flex items-center border border-secondary
  bg-surface-container px-3 py-2 font-display text-xs font-bold
  uppercase tracking-[0.14em] text-secondary
"
```

### Status Chip

```tsx
className="
  clip-chamfer inline-flex items-center border border-primary
  bg-primary/10 px-3 py-1.5 font-display text-[11px] font-bold
  uppercase tracking-[0.14em] text-primary-soft
"
```

### Input

```tsx
className="
  h-12 w-full border border-border bg-surface-container px-4
  text-foreground placeholder:text-muted-foreground
  focus:border-primary focus:outline-none focus:ring-0
"
```

### Segmented XP Bar

Use 10 segments.

```tsx
<div className="grid grid-cols-10 gap-1">
  {segments.map((active) => (
    <div
      className={active ? "h-2 bg-secondary" : "h-2 bg-surface-container-high"}
    />
  ))}
</div>
```

---

## Page-Level Visual Direction

### Dashboard

Feel:

- command overview
- personal progression console

Main elements:

- rank badge
- segmented XP bar
- application status cards
- recommended quest strip

### Quest Board

Feel:

- mission selection board

Main elements:

- filter row
- quest cards
- reward XP emphasis
- apply CTA

### Party

Feel:

- guild roster terminal

Main elements:

- party cards
- rank requirement badge
- leader marker
- join CTA

### Leaderboard

Feel:

- ranked operations board

Main elements:

- top 3 podium cards
- tactical table
- XP and rank badges

### Admin

Feel:

- high-authority command center

Main elements:

- warning/admin label
- dense tables
- job forms
- status management controls

---

## Final Design Rule

When unsure, choose:

```txt
dark + solid + sharp + bordered + readable
```

Do not choose:

```txt
bright + gradient + rounded + playful + decorative
```
