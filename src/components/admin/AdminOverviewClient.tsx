"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

import { AdminStatCards } from "@/components/admin/AdminStatCards";
import type { AdminApplication, AdminJob, AdminLoadState } from "@/components/admin/types";
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  LoadingState,
  PageHeader,
  StatusChip,
} from "@/components/ui";
import type { ApiResponse } from "@/types/api";

export function AdminOverviewClient() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loadState, setLoadState] = useState<AdminLoadState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOverview() {
      setLoadState("loading");
      setError(null);

      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          fetch("/api/admin/jobs", { signal: controller.signal }),
          fetch("/api/admin/job-applications", { signal: controller.signal }),
        ]);
        const [jobsJson, applicationsJson] = (await Promise.all([
          jobsResponse.json(),
          applicationsResponse.json(),
        ])) as [ApiResponse<AdminJob[]>, ApiResponse<AdminApplication[]>];

        if (!jobsJson.ok) throw new Error(jobsJson.error.message);
        if (!applicationsJson.ok) throw new Error(applicationsJson.error.message);

        setJobs(jobsJson.data);
        setApplications(applicationsJson.data);
        setLoadState("ready");
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadState("error");
        setError(
          error instanceof Error ? error.message : "Admin command data failed to load.",
        );
      }
    }

    loadOverview();

    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    const applicantIds = new Set(applications.map((application) => application.applicant.id));

    return {
      openJobs: jobs.filter((job) => job.status === "open").length,
      pendingApplications: applications.filter(
        (application) => application.status === "pending",
      ).length,
      completedApplications: applications.filter(
        (application) => application.status === "completed",
      ).length,
      totalApplicants: applicantIds.size,
    };
  }, [applications, jobs]);

  return (
    <div className="space-y-8">
      <PageHeader
        label="Admin Command Center"
        title="Manage Quests and Applicant Progression"
        description="Review operational load, route new postings, and move student applications through verified status changes."
        actions={
          <Button asChild>
            <Link href="/admin/jobs">
              Manage Jobs
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      {loadState === "loading" ? (
        <Card>
          <LoadingState label="Syncing admin command center" rows={7} />
        </Card>
      ) : null}

      {loadState === "error" ? (
        <div
          className="flex items-start gap-3 border border-danger bg-danger/10 p-4 text-danger"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">
            {error ?? "Admin command data failed to load."}
          </p>
        </div>
      ) : null}

      {loadState === "ready" ? (
        <>
          <AdminStatCards {...stats} />

          <section className="grid gap-6 xl:grid-cols-2">
            <Card className="space-y-4">
              <SectionHeader label="Recent Applications" href="/admin/applications" />
              {applications.length > 0 ? (
                <DataTable
                  data={applications.slice(0, 5)}
                  getRowKey={(row) => row.id}
                  emptyMessage="No application records."
                  columns={[
                    {
                      key: "student",
                      header: "Student",
                      cell: (row) => row.applicant.display_name || row.applicant.email,
                    },
                    {
                      key: "quest",
                      header: "Quest",
                      cell: (row) => row.job.title,
                    },
                    {
                      key: "status",
                      header: "Status",
                      cell: (row) => <StatusChip status={row.status}>{row.status}</StatusChip>,
                    },
                  ]}
                />
              ) : (
                <EmptyState
                  title="No applications submitted"
                  description="Student attempts will appear here once quests receive applicants."
                />
              )}
            </Card>

            <Card className="space-y-4">
              <SectionHeader label="Recent Jobs" href="/admin/jobs" />
              {jobs.length > 0 ? (
                <DataTable
                  data={jobs.slice(0, 5)}
                  getRowKey={(row) => row.id}
                  emptyMessage="No job records."
                  columns={[
                    {
                      key: "title",
                      header: "Title",
                      cell: (row) => row.title,
                    },
                    {
                      key: "slots",
                      header: "Slots",
                      cell: (row) => row.slots,
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
                  ]}
                />
              ) : (
                <EmptyState
                  title="No quests posted"
                  description="Create the first admin-managed quest from job control."
                />
              )}
            </Card>
          </section>
        </>
      ) : null}
    </div>
  );
}

function SectionHeader({ label, href }: { label: string; href: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
      <h2 className="font-display text-xl font-semibold text-foreground">{label}</h2>
      <Link
        href={href}
        className="font-display text-xs font-bold uppercase text-secondary transition-colors hover:text-secondary-hover"
      >
        Open
      </Link>
    </div>
  );
}
