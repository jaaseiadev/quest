"use client";

import {
  BriefcaseBusiness,
  CalendarClock,
  Coins,
  MapPin,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { Badge, Button, Card, StatusChip } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { JobListItem } from "@/types/api";
import type { ApplicationStatus } from "@/types/db";
import { APPLICATION_STATUS_META } from "@/types/ui";

export type QuestCardProps = {
  job: JobListItem;
  applicationStatus?: ApplicationStatus;
  isApplying?: boolean;
  onView?: () => void;
  onApply?: () => void;
};

export function QuestCard({
  job,
  applicationStatus,
  isApplying = false,
  onView,
  onApply,
}: QuestCardProps) {
  const expired = isDeadlinePassed(job.deadline);
  const full = job.slots <= 0;
  const hasApplied = Boolean(applicationStatus);
  const applyDisabled = hasApplied || full || expired || isApplying;

  return (
    <Card variant="interactive" className="flex h-full flex-col gap-5 md:gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {job.category ? <Badge variant="quest">{job.category}</Badge> : null}
        {job.recommended_rank ? (
          <Badge variant="rank">{job.recommended_rank.name}</Badge>
        ) : (
          <Badge>Open Rank</Badge>
        )}
        {applicationStatus ? (
          <StatusChip status={applicationStatus}>
            {APPLICATION_STATUS_META[applicationStatus].label}
          </StatusChip>
        ) : null}
      </div>

      <div className="space-y-3">
        <div>
          <h2 className="break-words font-display text-xl font-semibold leading-tight text-foreground md:text-2xl">
            {job.title}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <BriefcaseBusiness className="h-4 w-4 text-primary" aria-hidden="true" />
            {job.company ?? "Guild Posting"}
          </p>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {job.description ?? "Mission brief will be issued during application review."}
        </p>
      </div>

      <dl className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 sm:[&>*]:min-w-0">
        <QuestMeta icon={MapPin} label="Location" value={job.location ?? "Flexible"} />
        <QuestMeta icon={Coins} label="Pay" value={formatPay(job.pay)} />
        <QuestMeta
          icon={Users}
          label="Slots"
          value={full ? "Full" : `${job.slots} available`}
          tone={full ? "danger" : undefined}
        />
        <QuestMeta
          icon={Trophy}
          label="Reward"
          value={`${job.reward_xp} XP`}
          tone="gold"
        />
        <QuestMeta
          icon={CalendarClock}
          label="Deadline"
          value={formatDate(job.deadline)}
          tone={expired ? "danger" : isDeadlineSoon(job.deadline) ? "warning" : undefined}
        />
        <QuestMeta
          icon={ShieldCheck}
          label="Rank"
          value={job.recommended_rank?.name ?? "Unrestricted"}
          tone="gold"
        />
      </dl>

      <div className="mt-auto flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={onView}
        >
          View Intel
        </Button>
        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={applyDisabled}
          onClick={onApply}
        >
          {getApplyLabel({ applicationStatus, full, expired, isApplying })}
        </Button>
      </div>
    </Card>
  );
}

function QuestMeta({
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
    <div className="min-w-0 border border-border bg-surface-container px-3 py-3">
      <dt className="flex items-center gap-2 text-label-caps text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" aria-hidden={true} />
        {label}
      </dt>
      <dd className={`mt-2 break-words font-display text-sm font-semibold ${toneClass}`}>
        {value}
      </dd>
    </div>
  );
}

function getApplyLabel({
  applicationStatus,
  full,
  expired,
  isApplying,
}: {
  applicationStatus?: ApplicationStatus;
  full: boolean;
  expired: boolean;
  isApplying: boolean;
}) {
  if (applicationStatus) return "Applied";
  if (isApplying) return "Applying";
  if (full) return "Slots Full";
  if (expired) return "Expired";
  return "Apply";
}

export function isDeadlinePassed(deadline: string | null) {
  return deadline ? new Date(deadline).getTime() < Date.now() : false;
}

export function isDeadlineSoon(deadline: string | null) {
  if (!deadline) return false;

  const deadlineTime = new Date(deadline).getTime();
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;

  return deadlineTime >= now && deadlineTime - now <= sevenDays;
}

export function formatPay(pay: number | null) {
  if (pay === null) return "Undisclosed";

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(pay);
}

