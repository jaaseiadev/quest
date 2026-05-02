import { AppShell } from "@/components/shared";
import { Card, LoadingState } from "@/components/ui";

export default function PartyManagementLoading() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <LoadingState label="Loading party network" rows={3} />
        </Card>
        <Card>
          <LoadingState label="Syncing roster data" rows={6} />
        </Card>
      </div>
    </AppShell>
  );
}

