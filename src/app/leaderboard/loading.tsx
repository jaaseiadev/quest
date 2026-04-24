import { AppShell } from "@/components/shared";
import { Card, LoadingState, PageHeader } from "@/components/ui";

export default function LeaderboardLoading() {
  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          label="Global Leaderboard"
          title="Ranked by Completed Quest XP"
          description="Syncing the current XP ranking board."
        />
        <Card>
          <LoadingState label="Syncing XP ranking board" rows={7} />
        </Card>
      </div>
    </AppShell>
  );
}
