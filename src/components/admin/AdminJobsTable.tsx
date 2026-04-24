"use client";

import { Edit3, Lock } from "lucide-react";

import type { AdminJob } from "@/components/admin/types";
import { Badge, Button, DataTable } from "@/components/ui";

type AdminJobsTableProps = {
  jobs: AdminJob[];
  closingJobId: string | null;
  onEdit: (job: AdminJob) => void;
  onClose: (job: AdminJob) => void;
};

export function AdminJobsTable({
  jobs,
  closingJobId,
  onEdit,
  onClose,
}: AdminJobsTableProps) {
  return (
    <DataTable
      data={jobs}
      getRowKey={(row) => row.id}
      emptyMessage="No jobs have been created."
      columns={[
        {
          key: "title",
          header: "Title",
          cell: (row) => (
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{row.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {row.company || "No company"} / {row.location || "No location"}
              </p>
            </div>
          ),
        },
        {
          key: "category",
          header: "Category",
          cell: (row) => row.category || "Unassigned",
        },
        {
          key: "slots",
          header: "Slots",
          cell: (row) => row.slots,
        },
        {
          key: "reward",
          header: "Reward XP",
          cell: (row) => (
            <span className="font-display font-semibold text-secondary">
              {row.reward_xp}
            </span>
          ),
        },
        {
          key: "status",
          header: "Status",
          cell: (row) => (
            <Badge variant={row.status === "open" ? "success" : "danger"}>
              {row.status}
            </Badge>
          ),
        },
        {
          key: "deadline",
          header: "Deadline",
          cell: (row) => formatDate(row.deadline),
        },
        {
          key: "actions",
          header: "Actions",
          cell: (row) => (
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="secondary" onClick={() => onEdit(row)}>
                <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="danger"
                disabled={row.status === "closed" || closingJobId === row.id}
                onClick={() => onClose(row)}
              >
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                {closingJobId === row.id ? "Closing" : "Close"}
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}

function formatDate(value: string | null) {
  if (!value) return "No deadline";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
