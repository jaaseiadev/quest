import type { ApplicationStatus } from "@/types/db";
import { APPLICATION_STATUS_META } from "@/types/ui";
import { Card, StatusChip } from "@/components/ui";
import type { DashboardStats } from "@/components/dashboard/types";

const STATUS_ORDER: ApplicationStatus[] = [
  "pending",
  "accepted",
  "in_progress",
  "completed",
  "rejected",
];

export type ApplicationSummaryProps = {
  stats: DashboardStats;
};

export function ApplicationSummary({ stats }: ApplicationSummaryProps) {
  return (
    <Card>
      <div className="mb-6 flex flex-col gap-2 border-b border-border pb-5">
        <p className="text-label-caps text-primary">Application Summary</p>
        <h2 className="font-display text-xl font-semibold text-foreground">
          Quest Attempt Status
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {STATUS_ORDER.map((status) => (
          <div
            key={status}
            className="min-w-0 border border-border bg-surface-container-low p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <StatusChip status={status}>{APPLICATION_STATUS_META[status].label}</StatusChip>
              <span className="font-display text-2xl font-bold text-foreground">
                {stats.applicationCounts[status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
