import { BriefcaseBusiness, CheckCircle2, ClipboardList, Users } from "lucide-react";

import { Card } from "@/components/ui";

export type AdminStatCardsProps = {
  openJobs: number;
  pendingApplications: number;
  completedApplications: number;
  totalApplicants: number;
};

export function AdminStatCards({
  openJobs,
  pendingApplications,
  completedApplications,
  totalApplicants,
}: AdminStatCardsProps) {
  const stats = [
    {
      label: "Open Jobs",
      value: openJobs,
      icon: BriefcaseBusiness,
    },
    {
      label: "Pending Apps",
      value: pendingApplications,
      icon: ClipboardList,
    },
    {
      label: "Completed",
      value: completedApplications,
      icon: CheckCircle2,
    },
    {
      label: "Applicants",
      value: totalApplicants,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} className="p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-label-caps text-muted-foreground">{stat.label}</p>
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <p className="mt-4 break-words font-display text-3xl font-semibold text-secondary md:text-4xl">
              {stat.value.toLocaleString()}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
