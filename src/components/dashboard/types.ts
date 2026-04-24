import type { ApplicationStatus } from "@/types/db";

export type DashboardRank = {
  id: number;
  name: string;
  min_xp: number;
  max_xp: number | null;
};

export type DashboardStats = {
  totalXp: number;
  currentRank: DashboardRank;
  nextRank: DashboardRank | null;
  xpIntoRank: number;
  xpRange: number;
  xpToNextRank: number | null;
  activeApplications: number;
  completedQuests: number;
  applicationCounts: Record<ApplicationStatus, number>;
};

export type DashboardApplication = {
  id: string;
  title: string;
  status: ApplicationStatus;
  appliedAt: string;
  rewardXp: number;
};

export type DashboardQuest = {
  id: string;
  title: string;
  category: string | null;
  company: string | null;
  location: string | null;
  pay: number | null;
  slots: number;
  rewardXp: number;
  deadline: string | null;
  recommendedRank: DashboardRank | null;
};
