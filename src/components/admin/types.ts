import type { AdminApplicationListItem, AdminJobListItem } from "@/types/api";
import type { Rank } from "@/types/db";

export type AdminJob = AdminJobListItem;

export type AdminApplication = AdminApplicationListItem;

export type AdminRank = Pick<Rank, "id" | "name" | "min_xp" | "max_xp">;

export type AdminLoadState = "loading" | "ready" | "error";
