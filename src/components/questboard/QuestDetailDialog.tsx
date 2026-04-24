"use client";

import { useEffect } from "react";
import { CalendarClock, Coins, MapPin, Trophy, Users, X } from "lucide-react";

import { Badge, Button, StatusChip } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { JobListItem } from "@/types/api";
import type { ApplicationStatus } from "@/types/db";
import {
  formatPay,
  isDeadlinePassed,
  isDeadlineSoon,
} from "@/components/questboard/QuestCard";

export type QuestDetailDialogProps = {
  job: JobListItem | null;
  applicationStatus?: ApplicationStatus;
  isApplying?: boolean;
  onClose: () => void;
  onApply: () => void;
};

export function QuestDetailDialog({
  job,
  applicationStatus,
  isApplying = false,
  onClose,
  onApply,
}: QuestDetailDialogProps) {
  useEffect(() => {
    if (!job) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [job, onClose]);

  if (!job) return null;

  const expired = isDeadlinePassed(job.deadline);
  const full = job.slots <= 0;
  const applyDisabled = Boolean(applicationStatus) || full || expired || isApplying;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-surface-dim/90 p-0 md:items-center md:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quest-detail-title"
        className="max-h-[92vh] w-full overflow-y-auto border border-border-strong bg-surface-dim text-foreground md:mx-auto md:max-w-4xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5 md:p-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {job.category ? <Badge variant="quest">{job.category}</Badge> : null}
              {job.recommended_rank ? (
                <Badge variant="rank">{job.recommended_rank.name}</Badge>
              ) : (
                <Badge>Open Rank</Badge>
              )}
              {applicationStatus ? (
                <StatusChip status={applicationStatus}>Applied</StatusChip>
              ) : null}
            </div>
            <div>
              <p className="text-label-caps text-primary">Quest Intel</p>
              <h2
                id="quest-detail-title"
                className="mt-2 font-display text-3xl font-semibold text-foreground"
              >
                {job.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {job.company ?? "Guild Posting"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close quest detail"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[1.3fr_0.7fr] md:p-6">
          <div className="space-y-6">
            <section className="space-y-3">
              <p className="text-label-caps text-primary">Mission Brief</p>
              <p className="text-sm leading-7 text-muted-foreground">
                {job.description ??
                  "Mission details are limited. Apply to establish contact with command."}
              </p>
            </section>

            <section className="space-y-3">
              <p className="text-label-caps text-primary">Requirements</p>
              <div className="border border-border bg-surface-container-low p-4">
                <p className="font-display text-lg font-semibold text-foreground">
                  {job.recommended_rank?.name ?? "Unrestricted rank"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Recommended progression level for this operation. Final selection is
                  handled by admin review after application.
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-3">
            <IntelStat icon={MapPin} label="Location" value={job.location ?? "Flexible"} />
            <IntelStat icon={Coins} label="Pay" value={formatPay(job.pay)} />
            <IntelStat
              icon={Users}
              label="Slots"
              value={full ? "Full" : `${job.slots} available`}
              tone={full ? "danger" : undefined}
            />
            <IntelStat
              icon={Trophy}
              label="Reward"
              value={`${job.reward_xp} XP`}
              tone="gold"
            />
            <IntelStat
              icon={CalendarClock}
              label="Deadline"
              value={formatDate(job.deadline)}
              tone={expired ? "danger" : isDeadlineSoon(job.deadline) ? "warning" : undefined}
            />
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-border p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <p className="text-sm text-muted-foreground">
            {applicationStatus
              ? "Application logged. Track status updates from your dashboard."
              : "Submit once. Duplicate applications are blocked and shown as applied."}
          </p>
          <Button type="button" disabled={applyDisabled} onClick={onApply}>
            {applicationStatus
              ? "Applied"
              : isApplying
                ? "Applying"
                : full
                  ? "Slots Full"
                  : expired
                    ? "Expired"
                    : "Apply"}
          </Button>
        </div>
      </section>
    </div>
  );
}

function IntelStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: true }>;
  label: string;
  value: string;
  tone?: "gold" | "warning" | "danger";
}) {
  const toneClass =
    tone === "gold"
      ? "text-secondary"
      : tone === "warning"
        ? "text-warning"
        : tone === "danger"
          ? "text-danger"
          : "text-foreground";

  return (
    <div className="border border-border bg-surface-container p-4">
      <p className="flex items-center gap-2 text-label-caps text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" aria-hidden={true} />
        {label}
      </p>
      <p className={`mt-2 font-display text-lg font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

