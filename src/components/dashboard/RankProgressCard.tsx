import { Badge, Card, CardContent, CardHeader, CardTitle, SegmentedProgress } from "@/components/ui";
import type { DashboardStats } from "@/components/dashboard/types";

export type RankProgressCardProps = {
  stats: DashboardStats;
};

export function RankProgressCard({ stats }: RankProgressCardProps) {
  return (
    <Card variant="prestige">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-label-caps text-secondary">XP Progression</p>
          <CardTitle>{stats.currentRank.name} Rank Track</CardTitle>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="rank">{stats.currentRank.name}</Badge>
          {stats.nextRank ? <Badge>{stats.nextRank.name}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        <SegmentedProgress
          value={stats.xpIntoRank}
          max={stats.xpRange}
          segments={10}
          label={stats.nextRank ? `To ${stats.nextRank.name}` : "Rank Complete"}
        />
        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="border border-border bg-surface-container-low p-4">
            <p className="text-label-caps text-muted-foreground">Current XP</p>
            <p className="mt-2 font-display text-xl font-bold text-secondary">
              {stats.totalXp}
            </p>
          </div>
          <div className="border border-border bg-surface-container-low p-4">
            <p className="text-label-caps text-muted-foreground">Next Rank</p>
            <p className="mt-2 font-display text-xl font-bold text-foreground">
              {stats.nextRank?.name ?? "Max Rank"}
            </p>
          </div>
          <div className="border border-border bg-surface-container-low p-4">
            <p className="text-label-caps text-muted-foreground">XP Needed</p>
            <p className="mt-2 font-display text-xl font-bold text-secondary">
              {stats.xpToNextRank ?? 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
