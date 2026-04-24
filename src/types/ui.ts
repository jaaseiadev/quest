import type { ApplicationStatus } from "@/types/db";

export type NavItem = {
  label: string;
  href: string;
};

export type StatusTone =
  | "default"
  | "primary"
  | "prestige"
  | "success"
  | "warning"
  | "danger";

export type EmptyStateContent = {
  title: string;
  description?: string;
  actionLabel?: string;
};

export type ApplicationStatusMeta = {
  label: string;
  tone: StatusTone;
};

export const APPLICATION_STATUS_META: Record<
  ApplicationStatus,
  ApplicationStatusMeta
> = {
  pending: {
    label: "Pending",
    tone: "default",
  },
  accepted: {
    label: "Accepted",
    tone: "prestige",
  },
  in_progress: {
    label: "In Progress",
    tone: "primary",
  },
  completed: {
    label: "Completed",
    tone: "success",
  },
  rejected: {
    label: "Rejected",
    tone: "danger",
  },
};

export const STUDENT_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Quest",
    href: "/questboard",
  },
  {
    label: "Party",
    href: "/party-management",
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
  },
];
