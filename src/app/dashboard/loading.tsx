import { AppShell } from "@/components/shared";
import { Card, LoadingState } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <LoadingState label="Loading student command" rows={3} />
        </Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index}>
              <LoadingState label="Syncing stat" rows={2} />
            </Card>
          ))}
        </div>
        <Card>
          <LoadingState label="Loading quest activity" rows={5} />
        </Card>
      </div>
    </AppShell>
  );
}
