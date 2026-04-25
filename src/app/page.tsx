import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  Crown,
  Gauge,
  ShieldCheck,
  Trophy,
  UsersRound,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SegmentedProgress,
  StatusChip,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Guild System | Tactical Career Quest Platform",
  description:
    "A guild-based job opportunity management system for students to discover quests, earn XP, join parties, and track career progression.",
};

const metrics = [
  {
    label: "Quest board",
    value: "Open jobs",
    detail: "Filtered by rank, category, recency, and slots.",
  },
  {
    label: "Rank engine",
    value: "XP tracked",
    detail: "Completed applications advance student rank.",
  },
  {
    label: "Party system",
    value: "Squad ready",
    detail: "Students create or join focused career groups.",
  },
  {
    label: "Admin control",
    value: "Secured ops",
    detail: "Server-verified job and application management.",
  },
];

const modules = [
  {
    title: "Quest Discovery",
    description:
      "Students browse open job opportunities as mission cards with reward XP, deadline, location, pay, slots, and recommended rank.",
    icon: ClipboardList,
  },
  {
    title: "Application Workflow",
    description:
      "Each quest attempt moves through pending, accepted, in progress, completed, or rejected states with duplicate attempts blocked.",
    icon: CheckCircle2,
  },
  {
    title: "XP Rank Progression",
    description:
      "Completion rewards XP once, then maps students through Beginner, Apprentice, Specialist, Expert, Master, and Grandmaster ranks.",
    icon: Trophy,
  },
  {
    title: "Party And Leaderboard",
    description:
      "Students form parties, meet rank requirements, and compare progress on an XP-driven leaderboard.",
    icon: UsersRound,
  },
];

const operationSteps = [
  "Authenticate as student or admin",
  "Scan the quest board for available work",
  "Submit one protected quest application",
  "Track status updates and completion XP",
  "Join parties and climb the leaderboard",
];

const sampleQuests = [
  {
    title: "Frontend Intern",
    meta: "Apex Labs / Remote",
    reward: "120 XP",
    rank: "Beginner",
    status: "Open",
  },
  {
    title: "Data Cleanup Operator",
    meta: "Guild Admin / Hybrid",
    reward: "80 XP",
    rank: "Apprentice",
    status: "Slots 3",
  },
  {
    title: "QA Mission Analyst",
    meta: "Command Center / On-site",
    reward: "150 XP",
    rank: "Specialist",
    status: "Priority",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <LandingTopbar />

      <section className="container-apex grid gap-10 py-12 md:py-16 xl:grid-cols-[1.08fr_0.92fr] xl:items-center xl:py-20">
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="quest">Apex Protocol</Badge>
            <StatusChip status="in_progress">MVP Command Board</StatusChip>
          </div>

          <div className="max-w-4xl space-y-6">
            <h1 className="text-display-lg max-w-5xl text-balance">
              Turn student job hunting into tactical quest progression.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Guild System converts job opportunities into quests, applications
              into tracked attempts, and completed work into XP, ranks, parties,
              and leaderboard standing.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">
                Create Account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/auth/login">Access Console</Link>
            </Button>
          </div>

          <div className="grid border border-border bg-surface-dim sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-b border-border p-5 sm:border-r sm:last:border-r-0 lg:border-b-0"
              >
                <p className="text-label-caps text-primary">{metric.label}</p>
                <p className="mt-3 font-display text-xl font-bold text-foreground">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <CommandPreview />
      </section>

      <section className="container-apex space-y-6 pb-14 md:pb-20">
        <SectionHeader
          label="Core System"
          title="Built around the actual MVP modules"
          description="The landing page mirrors the implemented product flow: protected auth, student quest activity, rank growth, party formation, leaderboard visibility, and admin review."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Card key={module.title} variant="interactive" className="h-full">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center border border-border bg-surface-container-high">
                    <Icon className="h-5 w-5 text-secondary" aria-hidden="true" />
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container-apex grid gap-6 pb-14 md:pb-20 lg:grid-cols-[0.85fr_1.15fr]">
        <Card variant="prestige">
          <CardHeader>
            <Badge variant="rank">Rank Pipeline</Badge>
            <CardTitle>Progression stays measurable.</CardTitle>
            <CardDescription>
              XP belongs to completed work, not vanity counters. Rank thresholds
              are handled by the database so the interface stays consistent.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SegmentedProgress value={340} max={500} label="Apprentice Progress" />
            <div className="grid gap-3 text-sm text-muted-foreground">
              <RankRow label="Current Rank" value="Apprentice" />
              <RankRow label="Next Threshold" value="500 XP" />
              <RankRow label="Leaderboard Signal" value="Sorted by XP" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="quest">Operational Flow</Badge>
              <Badge>Student Safe</Badge>
            </div>
            <CardTitle>From opportunity scan to completed quest.</CardTitle>
            <CardDescription>
              The system keeps student actions scoped to their own profile,
              applications, and party membership while admin mutations stay
              behind server route handlers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {operationSteps.map((step, index) => (
                <div
                  key={step}
                  className="grid grid-cols-[3rem_1fr] border border-border bg-surface-container-low"
                >
                  <div className="flex items-center justify-center border-r border-border font-display text-sm font-bold text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="p-4 text-sm leading-6 text-foreground">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="border-y border-border bg-surface-dim">
        <div className="container-apex grid gap-6 py-12 md:py-16 lg:grid-cols-3">
          <FeatureSignal
            icon={BriefcaseBusiness}
            label="Quest Board"
            title="Browse open jobs only"
            description="Closed jobs stay out of the student quest feed, while filters keep available work readable."
          />
          <FeatureSignal
            icon={ShieldCheck}
            label="RLS + API"
            title="Protected mutations"
            description="Admin actions require server-side role checks. Students only mutate their owned records."
          />
          <FeatureSignal
            icon={Crown}
            label="Prestige Layer"
            title="Ranks, parties, standings"
            description="Gold is reserved for XP, rank, and high-signal progress moments across the interface."
          />
        </div>
      </section>
    </main>
  );
}

function LandingTopbar() {
  return (
    <header className="border-b border-border bg-surface-dim">
      <div className="container-apex flex min-h-20 flex-col justify-center gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="font-display text-base font-bold uppercase text-foreground transition-colors hover:text-primary sm:text-lg"
        >
          Guild System
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/questboard">Quest</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function CommandPreview() {
  return (
    <aside className="border border-border bg-surface-dim p-4 md:p-5">
      <div className="border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div>
            <p className="text-label-caps text-primary">Live Console Preview</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
              Quest Operations
            </h2>
          </div>
          <Badge variant="rank">Beginner</Badge>
        </div>

        <div className="space-y-4 p-4 md:p-5">
          {sampleQuests.map((quest) => (
            <div
              key={quest.title}
              className="border border-border bg-surface-container-low p-4 transition-colors duration-100 hover:border-secondary"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {quest.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{quest.meta}</p>
                </div>
                <StatusChip status="pending">{quest.status}</StatusChip>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <IntelBlock label="Reward" value={quest.reward} />
                <IntelBlock label="Rank" value={quest.rank} />
                <IntelBlock label="Slots" value="Available" />
              </div>
            </div>
          ))}

          <div className="grid gap-3 border border-border bg-surface-container p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-label-caps text-muted-foreground">
                <Gauge className="h-4 w-4 text-secondary" aria-hidden="true" />
                Career Signal
              </span>
              <span className="font-display text-sm font-bold text-secondary">
                340 XP
              </span>
            </div>
            <SegmentedProgress value={7} max={10} />
          </div>
        </div>
      </div>
    </aside>
  );
}

function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl border-b border-border pb-5">
      <p className="text-label-caps text-primary">{label}</p>
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function RankRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-border bg-surface-container-low p-4">
      <span>{label}</span>
      <span className="font-display font-bold text-secondary">{value}</span>
    </div>
  );
}

function IntelBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-surface-container p-3">
      <p className="text-label-caps text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

function FeatureSignal({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center border border-border bg-surface-container-high">
          <Icon className="h-5 w-5 text-primary-soft" aria-hidden="true" />
        </div>
        <p className="text-label-caps text-primary">{label}</p>
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
