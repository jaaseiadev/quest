import { EmptyState, StatusChip } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { APPLICATION_STATUS_META } from "@/types/ui";
import type { DashboardApplication } from "@/components/dashboard/types";

export type RecentApplicationsProps = {
  applications: DashboardApplication[];
};

export function RecentApplications({ applications }: RecentApplicationsProps) {
  if (applications.length === 0) {
    return (
      <EmptyState
        title="No applications submitted"
        description="Your recent quest attempts will appear here after you apply from the quest board."
      />
    );
  }

  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="hidden grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr] border-b border-border bg-surface-container-low px-4 py-3 text-label-caps text-muted-foreground md:grid">
        <span>Quest</span>
        <span>Status</span>
        <span>Applied</span>
        <span className="text-right">Reward</span>
      </div>
      <div className="divide-y divide-border">
        {applications.map((application) => (
          <div
            key={application.id}
            className="grid gap-4 bg-card p-4 transition-colors duration-100 hover:bg-surface-container-low md:grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr] md:items-center"
          >
            <div className="min-w-0">
              <p className="break-words font-display font-semibold text-foreground">
                {application.title}
              </p>
              <p className="mt-1 text-label-caps text-muted-foreground md:hidden">
                Applied {formatDate(application.appliedAt)}
              </p>
            </div>
            <div>
              <StatusChip status={application.status}>
                {APPLICATION_STATUS_META[application.status].label}
              </StatusChip>
            </div>
            <span className="hidden text-sm text-muted-foreground md:block">
              {formatDate(application.appliedAt)}
            </span>
            <span className="font-display text-sm font-bold text-secondary md:text-right">
              {application.rewardXp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
