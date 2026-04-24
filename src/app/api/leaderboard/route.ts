import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import {
  logRouteError,
  parsePagination,
  routeError,
} from "@/lib/api/route-utils";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LeaderboardEntry } from "@/types/api";

type LeaderboardRow = {
  user_id: string;
  xp: number;
  profiles:
    | {
        display_name: string | null;
        avatar_url: string | null;
      }
    | {
        display_name: string | null;
        avatar_url: string | null;
      }[]
    | null;
  ranks:
    | {
        id: number;
        name: string;
      }
    | {
        id: number;
        name: string;
      }[]
    | null;
};

type PartyMembershipRow = {
  user_id: string;
  parties:
    | {
        id: number;
        name: string;
      }
    | {
        id: number;
        name: string;
      }[]
    | null;
};

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const { searchParams } = request.nextUrl;
    const { limit, offset } = parsePagination(searchParams);

    const { data: rows, error } = await supabase
      .from("user_stats")
      .select(
        `
          user_id,
          xp,
          profiles(display_name, avatar_url),
          ranks(id, name)
        `,
      )
      .order("xp", { ascending: false })
      .range(offset, offset + limit - 1)
      .returns<LeaderboardRow[]>();

    if (error) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not fetch leaderboard.");
    }

    const userIds = rows.map((row) => row.user_id);
    const partyByUserId = await getPartyByUserId(userIds);

    const entries = rows.map<LeaderboardEntry>((row, index) => {
      const profile = normalizeRelation(row.profiles);
      const rank = normalizeRelation(row.ranks);

      return {
        rank_number: offset + index + 1,
        user_id: row.user_id,
        display_name: profile?.display_name ?? "Unknown Operative",
        avatar_url: profile?.avatar_url ?? null,
        xp: row.xp,
        rank,
        party: partyByUserId.get(row.user_id) ?? null,
      };
    });

    return successResponse(entries);
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not fetch leaderboard.");
  }
}

async function getPartyByUserId(userIds: string[]) {
  const partyByUserId = new Map<string, LeaderboardEntry["party"]>();

  if (userIds.length === 0) {
    return partyByUserId;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("party_members")
    .select("user_id, parties(id, name)")
    .in("user_id", userIds)
    .order("joined_at", { ascending: true })
    .returns<PartyMembershipRow[]>();

  if (error) {
    return partyByUserId;
  }

  data.forEach((row) => {
    if (!partyByUserId.has(row.user_id)) {
      partyByUserId.set(row.user_id, normalizeRelation(row.parties));
    }
  });

  return partyByUserId;
}

function normalizeRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}
