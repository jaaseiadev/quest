"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Filter } from "lucide-react";

import { JobApplicationsTable } from "@/components/admin/JobApplicationsTable";
import type {
  AdminApplication,
  AdminLoadState,
} from "@/components/admin/types";
import {
  Card,
  EmptyState,
  LoadingState,
  PageHeader,
} from "@/components/ui";
import type { ApiResponse } from "@/types/api";
import type { ApplicationStatus } from "@/types/db";

const FILTERS: ("all" | ApplicationStatus)[] = [
  "all",
  "pending",
  "accepted",
  "in_progress",
  "completed",
  "rejected",
];

export function AdminApplicationsClient() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loadState, setLoadState] = useState<AdminLoadState>("loading");
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tone: "success" | "danger"; message: string } | null>(
    null,
  );
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [updatingApplicationId, setUpdatingApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadApplications() {
      setLoadState("loading");
      setLoadMessage(null);

      try {
        const response = await fetch("/api/admin/job-applications", {
          signal: controller.signal,
        });
        const json = (await response.json()) as ApiResponse<AdminApplication[]>;

        if (!json.ok) {
          throw new Error(json.error.message);
        }

        setApplications(json.data);
        setLoadState("ready");
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadState("error");
        setLoadMessage(
          error instanceof Error ? error.message : "Applications failed to load.",
        );
      }
    }

    loadApplications();

    return () => controller.abort();
  }, []);

  const filteredApplications = useMemo(() => {
    if (filter === "all") return applications;

    return applications.filter((application) => application.status === filter);
  }, [applications, filter]);

  async function updateStatus(
    application: AdminApplication,
    status: ApplicationStatus,
  ) {
    if (status === "completed") {
      const confirmed = window.confirm(
        "Mark this application completed? The database trigger will award XP once.",
      );

      if (!confirmed) return;
    }

    setUpdatingApplicationId(application.id);
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/job-applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: application.id,
          status,
        }),
      });
      const json = (await response.json()) as ApiResponse<{
        id: string;
        status: ApplicationStatus;
        xp_awarded: boolean;
      }>;

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      setApplications((current) =>
        current.map((item) =>
          item.id === application.id
            ? {
                ...item,
                status: json.data.status,
                xp_awarded: json.data.xp_awarded,
                job:
                  status === "accepted" && item.status !== "accepted"
                    ? { ...item.job, slots: Math.max(item.job.slots - 1, 0) }
                    : item.job,
              }
            : item,
        ),
      );
      setFeedback({
        tone: "success",
        message:
          status === "completed"
            ? "Application completed. XP award is handled by the database trigger."
            : json.message ?? "Application updated.",
      });
    } catch (error) {
      setFeedback({
        tone: "danger",
        message:
          error instanceof Error ? error.message : "Application status could not be updated.",
      });
    } finally {
      setUpdatingApplicationId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Admin / Application Review"
        title="Applicant Status Control"
        description="Accept, reject, move in progress, or complete applications using the protected status contract."
        actions={<ApplicationFilter value={filter} onChange={setFilter} />}
      />

      {feedback ? <FeedbackBanner tone={feedback.tone} message={feedback.message} /> : null}

      {loadState === "loading" ? (
        <Card>
          <LoadingState label="Loading application review queue" rows={8} />
        </Card>
      ) : null}

      {loadState === "error" ? (
        <EmptyState
          title="Application review unavailable"
          description={loadMessage ?? "Applications failed to load."}
        />
      ) : null}

      {loadState === "ready" ? (
        <JobApplicationsTable
          applications={filteredApplications}
          updatingApplicationId={updatingApplicationId}
          onStatusChange={updateStatus}
        />
      ) : null}
    </div>
  );
}

function ApplicationFilter({
  value,
  onChange,
}: {
  value: (typeof FILTERS)[number];
  onChange: (value: (typeof FILTERS)[number]) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border border-border bg-card p-2">
      <Filter className="h-4 w-4 text-primary" aria-hidden="true" />
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`border px-3 py-2 font-display text-xs font-bold uppercase transition-colors ${
            value === filter
              ? "border-primary bg-primary/10 text-primary-soft"
              : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
          }`}
          onClick={() => onChange(filter)}
        >
          {filter.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}

function FeedbackBanner({
  tone,
  message,
}: {
  tone: "success" | "danger";
  message: string;
}) {
  const toneClass =
    tone === "success"
      ? "border-success bg-success/10 text-success"
      : "border-danger bg-danger/10 text-danger";

  return (
    <div className={`flex items-center gap-3 border p-4 ${toneClass}`} role="status">
      <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
