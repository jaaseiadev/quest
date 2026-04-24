import Link from "next/link";
import { ArrowRight, ShieldCheck, Trophy } from "lucide-react";

import { AppShell } from "@/components/shared/AppShell";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
  SegmentedProgress,
  StatusChip,
} from "@/components/ui";

export default function Home() {
  return (
    <AppShell displayName="Cadet" rankLabel="Beginner">
      <PageHeader
        label="Student Command"
        title="Apex Protocol foundation"
        description="The MVP design layer is ready for dashboard, quest, party, and leaderboard screens."
        actions={
          <Button asChild>
            <Link href="/dashboard">
              Enter Console
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card variant="interactive">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="quest">Quest Board</Badge>
              <StatusChip status="in_progress">Phase 1</StatusChip>
            </div>
            <CardTitle>Border-driven tactical surfaces</CardTitle>
            <CardDescription>
              Cards, buttons, badges, inputs, progress bars, and tables now share
              the dark Apex Protocol vocabulary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SegmentedProgress value={4} max={10} label="Foundation Progress" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="prestige">
          <CardHeader>
            <Badge variant="rank">Beginner</Badge>
            <CardTitle>Rank treatment</CardTitle>
            <CardDescription>
              Gold is reserved for XP, ranks, and prestige moments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between border border-border bg-surface-container-low p-4">
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-secondary" aria-hidden="true" />
                  Current XP
                </span>
                <span className="font-display font-bold text-secondary">120</span>
              </div>
              <div className="flex items-center justify-between border border-border bg-surface-container-low p-4">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Status
                </span>
                <StatusChip status="pending">Pending</StatusChip>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
