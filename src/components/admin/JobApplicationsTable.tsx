"use client";

import { Check, CircleDot, Play, X } from "lucide-react";

import type { AdminApplication } from "@/components/admin/types";
import { Button, DataTable, StatusChip } from "@/components/ui";
import type { ApplicationStatus } from "@/types/db";

type JobApplicationsTableProps = {
  applications: AdminApplication[];
  updatingApplicationId: string | null;
  onStatusChange: (application: AdminApplication, status: ApplicationStatus) => void;
};

const ACTIONS: {
  label: string;
  status: ApplicationStatus;
  icon: typeof Check;
  variant: "secondary" | "danger" | "gold";
}[] = [
  {
    label: "Accept",
    status: "accepted",
    icon: Check,
    variant: "gold",
  },
  {
    label: "Reject",
    status: "rejected",
    icon: X,
    variant: "danger",
  },
  {
    label: "In Progress",
    status: "in_progress",
    icon: Play,
    variant: "secondary",
  },
  {
    label: "Complete",
    status: "completed",
    icon: CircleDot,
    variant: "gold",
  },
];

export function JobApplicationsTable({
  applications,
  updatingApplicationId,
  onStatusChange,
}: JobApplicationsTableProps) {
  return (
    <DataTable
      data={applications}
      getRowKey={(row) => row.id}
      emptyMessage="No applications require review."
      columns={[
        {
          key: "student",
          header: "Student",
          cell: (row) => (
            <div className="min-w-0">
              <p className="font-semibold text-foreground">
                {row.applicant.display_name || "Unnamed operative"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {row.applicant.email || "No email"}
              </p>
            </div>
          ),
        },
        {
          key: "quest",
          header: "Quest",
          cell: (row) => (
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{row.job.title}</p>
              <p className="mt-1 text-xs text-secondary">
                {row.job.reward_xp} XP / {row.job.slots} slots
              </p>
            </div>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (row) => <StatusChip status={row.status}>{formatStatus(row.status)}</StatusChip>,
        },
        {
          key: "submitted",
          header: "Submitted",
          cell: (row) => formatDate(row.created_at),
        },
        {
          key: "actions",
          header: "Actions",
          cell: (row) => (
            <div className="flex min-w-72 flex-wrap gap-2">
              {ACTIONS.map((action) => {
                const Icon = action.icon;

                return (
                  <Button
                    key={action.status}
                    type="button"
                    size="sm"
                    variant={action.variant}
                    disabled={
                      updatingApplicationId === row.id || row.status === action.status
                    }
                    onClick={() => onStatusChange(row, action.status)}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          ),
        },
      ]}
    />
  );
}

function formatStatus(status: ApplicationStatus) {
  return status.replace("_", " ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
