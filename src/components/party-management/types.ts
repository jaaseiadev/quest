import type { PartyListItem } from "@/types/api";
import type { Rank } from "@/types/db";

export type PartyRank = Pick<Rank, "id" | "name" | "min_xp" | "max_xp">;

export type PartyUserRank = Pick<Rank, "id" | "name" | "min_xp">;

export type PartyViewItem = PartyListItem;

export type PartyMembershipState = "available" | "joined" | "locked";

