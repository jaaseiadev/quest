export type RoleName = "student" | "admin";

export type JobStatus = "open" | "closed";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "rejected";

export type PartyMemberRole = "leader" | "member";

export type Timestamp = string;

export type Role = {
  id: number;
  name: RoleName;
  description: string | null;
  created_at: Timestamp;
};

export type Rank = {
  id: number;
  name: string;
  min_xp: number;
  max_xp: number | null;
  created_at: Timestamp;
};

export type Profile = {
  id: string;
  auth_id: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  metadata: Record<string, unknown>;
  role_id: number;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type UserStats = {
  user_id: string;
  xp: number;
  current_rank_id: number | null;
  updated_at: Timestamp;
};

export type Job = {
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
  deadline: Timestamp | null;
  recommended_rank_id: number | null;
  created_by: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type JobApplication = {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  xp_awarded: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type Party = {
  id: number;
  name: string;
  description: string | null;
  leader_id: string | null;
  category: string | null;
  min_rank_id: number | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type PartyMember = {
  id: number;
  party_id: number;
  user_id: string;
  role: PartyMemberRole;
  joined_at: Timestamp;
};

export type Database = {
  public: {
    Tables: {
      roles: TableDefinition<Role, Omit<Role, "id" | "created_at">>;
      ranks: TableDefinition<Rank, Omit<Rank, "id" | "created_at">>;
      profiles: TableDefinition<Profile, ProfileInsert, ProfileUpdate>;
      user_stats: TableDefinition<UserStats, UserStatsInsert, UserStatsUpdate>;
      jobs: TableDefinition<Job, JobInsert, JobUpdate>;
      job_applications: TableDefinition<
        JobApplication,
        JobApplicationInsert,
        JobApplicationUpdate
      >;
      parties: TableDefinition<Party, PartyInsert, PartyUpdate>;
      party_members: TableDefinition<PartyMember, PartyMemberInsert>;
    };
  };
};

type TableDefinition<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
};

export type ProfileInsert = Omit<Profile, "created_at" | "updated_at"> &
  Partial<Pick<Profile, "created_at" | "updated_at">>;

export type ProfileUpdate = Partial<Omit<Profile, "id" | "created_at">>;

export type UserStatsInsert = Omit<UserStats, "updated_at"> &
  Partial<Pick<UserStats, "updated_at">>;

export type UserStatsUpdate = Partial<Omit<UserStats, "user_id">>;

export type JobInsert = Omit<Job, "id" | "created_at" | "updated_at"> &
  Partial<Pick<Job, "id" | "created_at" | "updated_at">>;

export type JobUpdate = Partial<Omit<Job, "id" | "created_at">>;

export type JobApplicationInsert = Omit<
  JobApplication,
  "id" | "created_at" | "updated_at" | "xp_awarded" | "status"
> &
  Partial<
    Pick<JobApplication, "id" | "created_at" | "updated_at" | "xp_awarded" | "status">
  >;

export type JobApplicationUpdate = Partial<
  Omit<JobApplication, "id" | "job_id" | "user_id" | "created_at">
>;

export type PartyInsert = Omit<Party, "id" | "created_at" | "updated_at"> &
  Partial<Pick<Party, "id" | "created_at" | "updated_at">>;

export type PartyUpdate = Partial<Omit<Party, "id" | "created_at">>;

export type PartyMemberInsert = Omit<PartyMember, "id" | "joined_at" | "role"> &
  Partial<Pick<PartyMember, "id" | "joined_at" | "role">>;
