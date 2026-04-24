"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Trophy } from "lucide-react";

import {
  Card,
  EmptyState,
  LoadingState,
  PageHeader,
} from "@/components/ui";
import { QuestCard } from "@/components/questboard/QuestCard";
import { QuestDetailDialog } from "@/components/questboard/QuestDetailDialog";
import { QuestFilters } from "@/components/questboard/QuestFilters";
import type {
  QuestApplicationState,
  QuestFiltersState,
  QuestRank,
} from "@/components/questboard/types";
import type { ApiResponse, ApplyResponse, JobListItem } from "@/types/api";
import type { ApplicationStatus } from "@/types/db";

export type QuestBoardClientProps = {
  ranks: QuestRank[];
  initialApplications: QuestApplicationState[];
};

const DEFAULT_FILTERS: QuestFiltersState = {
  search: "",
  difficulty: "",
  category: "",
  datePosted: "",
};

export function QuestBoardClient({
  ranks,
  initialApplications,
}: QuestBoardClientProps) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobListItem | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applicationMessage, setApplicationMessage] = useState<string | null>(null);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [applications, setApplications] = useState(() =>
    createApplicationMap(initialApplications),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadJobs() {
      setLoadState("loading");
      setLoadMessage(null);

      const params = new URLSearchParams({
        limit: "100",
      });

      if (filters.difficulty) params.set("difficulty", filters.difficulty);
      if (filters.category) params.set("category", filters.category);
      if (filters.datePosted) params.set("datePosted", filters.datePosted);

      try {
        const response = await fetch(`/api/jobs?${params.toString()}`, {
          signal: controller.signal,
        });
        const json = (await response.json()) as ApiResponse<JobListItem[]>;

        if (!json.ok) {
          throw new Error(json.error.message);
        }

        setJobs(json.data);
        setLoadState("ready");
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadState("error");
        setLoadMessage(
          error instanceof Error ? error.message : "Quest board failed to load.",
        );
      }
    }

    loadJobs();

    return () => {
      controller.abort();
    };
  }, [filters.category, filters.datePosted, filters.difficulty]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          jobs
            .map((job) => job.category)
            .filter((category): category is string => Boolean(category?.trim())),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [jobs],
  );

  const visibleJobs = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    if (!search) return jobs;

    return jobs.filter((job) =>
      [job.title, job.description, job.company, job.location, job.category]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(search)),
    );
  }, [filters.search, jobs]);

  const selectedApplicationStatus = selectedJob
    ? applications.get(selectedJob.id)?.status
    : undefined;

  async function applyToQuest(job: JobListItem) {
    if (applications.has(job.id) || applyingJobId) return;

    setApplyingJobId(job.id);
    setApplicationMessage(null);
    setApplicationError(null);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: job.id }),
      });
      const json = (await response.json()) as ApiResponse<ApplyResponse>;

      if (!json.ok) {
        if (json.error.code === "CONFLICT") {
          setApplications((current) => {
            const next = new Map(current);

            next.set(job.id, {
              applicationId: "existing",
              status: "pending",
            });

            return next;
          });
        }

        throw new Error(json.error.message);
      }

      setApplications((current) => {
        const next = new Map(current);

        next.set(job.id, {
          applicationId: json.data.id,
          status: json.data.status,
        });

        return next;
      });
      setApplicationMessage(json.message ?? "Application submitted.");
    } catch (error) {
      setApplicationError(
        error instanceof Error ? error.message : "Application could not be submitted.",
      );
    } finally {
      setApplyingJobId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Quest Board"
        title="Available Operations"
        description="Browse open opportunities, inspect the mission brief, and submit a single application for each quest."
        actions={
          <div className="grid w-full grid-cols-2 border border-border bg-surface-container sm:w-auto sm:min-w-48">
            <BoardStat label="Open" value={jobs.length.toString()} />
            <BoardStat label="Applied" value={applications.size.toString()} />
          </div>
        }
      />

      <QuestFilters
        filters={filters}
        ranks={ranks}
        categories={categories}
        onChange={setFilters}
      />

      {applicationMessage ? (
        <FeedbackBanner tone="success" message={applicationMessage} />
      ) : null}
      {applicationError ? <FeedbackBanner tone="danger" message={applicationError} /> : null}

      {loadState === "loading" ? (
        <Card>
          <LoadingState label="Syncing quest board" rows={6} />
        </Card>
      ) : null}

      {loadState === "error" ? (
        <EmptyState
          title="Quest board offline"
          description={loadMessage ?? "Open operations could not be loaded."}
        />
      ) : null}

      {loadState === "ready" && visibleJobs.length === 0 ? (
        <EmptyState
          title="No quests match current filters"
          description="Adjust rank, category, date, or search terms to widen the operation scan."
        />
      ) : null}

      {loadState === "ready" && visibleJobs.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {visibleJobs.map((job) => {
            const applicationStatus = applications.get(job.id)?.status;

            return (
              <QuestCard
                key={job.id}
                job={job}
                applicationStatus={applicationStatus}
                isApplying={applyingJobId === job.id}
                onView={() => setSelectedJob(job)}
                onApply={() => applyToQuest(job)}
              />
            );
          })}
        </div>
      ) : null}

      <QuestDetailDialog
        job={selectedJob}
        applicationStatus={selectedApplicationStatus}
        isApplying={selectedJob ? applyingJobId === selectedJob.id : false}
        onClose={() => setSelectedJob(null)}
        onApply={() => {
          if (selectedJob) {
            applyToQuest(selectedJob);
          }
        }}
      />
    </div>
  );
}

function BoardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-border p-3 last:border-r-0">
      <p className="text-label-caps text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-secondary">{value}</p>
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
  const Icon = tone === "success" ? Trophy : AlertTriangle;
  const toneClass =
    tone === "success"
      ? "border-success bg-success/10 text-success"
      : "border-danger bg-danger/10 text-danger";

  return (
    <div className={`flex items-center gap-3 border p-4 ${toneClass}`} role="status">
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}

function createApplicationMap(applications: QuestApplicationState[]) {
  const map = new Map<string, { applicationId: string; status: ApplicationStatus }>();

  applications.forEach((application) => {
    map.set(application.jobId, {
      applicationId: application.applicationId,
      status: application.status,
    });
  });

  return map;
}
