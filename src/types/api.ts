import type {
  ApplicationStatus,
  JobStatus,
  Party,
  Profile,
  Rank,
} from "@/types/db";

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  message?: string;
};

export type ApiError = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR";

export type PaginationParams = {
  limit: number;
  offset: number;
};

export type JobListItem = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  company: string | null;
  pay: number | null;
  location: string | null;
  slots: number;
  reward_xp: number;
  status: JobStatus;
  deadline: string | null;
  created_at: string;
  recommended_rank: Rank | null;
};

export type ApplyResponse = {
  id: string;
  status: Extract<ApplicationStatus, "pending">;
};

export type LeaderboardEntry = {
  rank_number: number;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  rank: Pick<Rank, "id" | "name"> | null;
  party: Pick<Party, "id" | "name"> | null;
};

export type AdminApplicationListItem = {
  id: string;
  status: ApplicationStatus;
  created_at: string;
  xp_awarded: boolean;
  job: Pick<JobListItem, "id" | "title" | "reward_xp" | "slots">;
  applicant: Pick<Profile, "id" | "display_name" | "avatar_url" | "email">;
};
