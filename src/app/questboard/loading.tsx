import { AppShell } from "@/components/shared";
import { Card, LoadingState } from "@/components/ui";

export default function QuestBoardLoading() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <LoadingState label="Loading quest board" rows={3} />
        </Card>
        <Card>
          <LoadingState label="Syncing open operations" rows={6} />
        </Card>
      </div>
    </AppShell>
  );
}

