import type { ApplicationStatus, Rank } from "@/types/db";

export type QuestRank = Pick<Rank, "id" | "name" | "min_xp" | "max_xp">;

export type QuestApplicationState = {
  applicationId: string;
  jobId: string;
  status: ApplicationStatus;
};

export type QuestFiltersState = {
  search: string;
  difficulty: string;
  category: string;
  datePosted: string;
};

