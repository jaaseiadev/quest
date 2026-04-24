"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";

import { AdminJobsTable } from "@/components/admin/AdminJobsTable";
import { JobForm } from "@/components/admin/JobForm";
import type { AdminJob, AdminLoadState, AdminRank } from "@/components/admin/types";
import {
  Card,
  EmptyState,
  Input,
  LoadingState,
  PageHeader,
} from "@/components/ui";
import type { ApiResponse } from "@/types/api";

export function AdminJobsClient() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [ranks, setRanks] = useState<AdminRank[]>([]);
  const [loadState, setLoadState] = useState<AdminLoadState>("loading");
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ tone: "success" | "danger"; message: string } | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [editingJob, setEditingJob] = useState<AdminJob | null>(null);
  const [closingJobId, setClosingJobId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadJobs() {
      setLoadState("loading");
      setLoadMessage(null);

      try {
        const [jobsResponse, ranksResponse] = await Promise.all([
          fetch("/api/admin/jobs", { signal: controller.signal }),
          fetch("/api/ranks", { signal: controller.signal }),
        ]);
        const [jobsJson, ranksJson] = (await Promise.all([
          jobsResponse.json(),
          ranksResponse.json(),
        ])) as [ApiResponse<AdminJob[]>, ApiResponse<AdminRank[]>];

        if (!jobsJson.ok) throw new Error(jobsJson.error.message);
        if (!ranksJson.ok) throw new Error(ranksJson.error.message);

        setJobs(jobsJson.data);
        setRanks(ranksJson.data);
        setLoadState("ready");
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadState("error");
        setLoadMessage(error instanceof Error ? error.message : "Jobs failed to load.");
      }
    }

    loadJobs();

    return () => controller.abort();
  }, []);

  const filteredJobs = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) return jobs;

    return jobs.filter((job) =>
      [job.title, job.company, job.category, job.location]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(needle)),
    );
  }, [jobs, query]);

  async function closeJob(job: AdminJob) {
    setClosingJobId(job.id);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "DELETE",
      });
      const json = (await response.json()) as ApiResponse<AdminJob>;

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      setJobs((current) => current.map((item) => (item.id === job.id ? json.data : item)));
      setFeedback({ tone: "success", message: json.message ?? "Job closed." });
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "Job could not be closed.",
      });
    } finally {
      setClosingJobId(null);
    }
  }

  function handleSaved(job: AdminJob, message?: string) {
    setJobs((current) => {
      const exists = current.some((item) => item.id === job.id);

      return exists
        ? current.map((item) => (item.id === job.id ? { ...item, ...job } : item))
        : [job, ...current];
    });
    setFeedback({
      tone: "success",
      message: message ?? "Job saved.",
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Admin / Job Control"
        title="Quest Posting Management"
        description="Create, update, and close job quests from the protected admin route handlers."
        actions={
          <JobForm
            key={editingJob?.id ?? "create-job"}
            ranks={ranks}
            editingJob={editingJob}
            onSaved={handleSaved}
            onCancelEdit={() => setEditingJob(null)}
          />
        }
      />

      {feedback ? <FeedbackBanner tone={feedback.tone} message={feedback.message} /> : null}

      <div className="flex items-center gap-3 border border-border bg-card px-4 py-3">
        <Search className="h-4 w-4 text-primary" aria-hidden="true" />
        <Input
          value={query}
          placeholder="Search title, company, category, or location"
          className="border-0 bg-transparent px-0 focus:border-0"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loadState === "loading" ? (
        <Card>
          <LoadingState label="Loading admin jobs" rows={8} />
        </Card>
      ) : null}

      {loadState === "error" ? (
        <EmptyState
          title="Job control unavailable"
          description={loadMessage ?? "Admin jobs failed to load."}
        />
      ) : null}

      {loadState === "ready" ? (
        <AdminJobsTable
          jobs={filteredJobs}
          closingJobId={closingJobId}
          onEdit={setEditingJob}
          onClose={closeJob}
        />
      ) : null}
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
