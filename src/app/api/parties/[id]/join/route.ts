import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import {
  authErrorResponse,
  isDuplicateError,
  logRouteError,
  routeError,
} from "@/lib/api/route-utils";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type PartyRankRow = {
  id: number;
  min_rank:
    | {
        id: number;
        min_xp: number;
        name: string;
      }
    | {
        id: number;
        min_xp: number;
        name: string;
      }[]
    | null;
};

type UserRankRow = {
  xp: number;
  current_rank:
    | {
        id: number;
        min_xp: number;
        name: string;
      }
    | {
        id: number;
        min_xp: number;
        name: string;
      }[]
    | null;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return authErrorResponse(auth);
    }

    const { id } = await context.params;
    const partyId = Number.parseInt(id, 10);

    if (!Number.isInteger(partyId) || partyId < 1) {
      return routeError("BAD_REQUEST", "A valid party id is required.");
    }

    const adminSupabase = createSupabaseAdminClient();
    const { data: party, error: partyError } = await adminSupabase
      .from("parties")
      .select("id, min_rank:ranks(id, name, min_xp)")
      .eq("id", partyId)
      .returns<PartyRankRow[]>()
      .maybeSingle();

    if (partyError) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not verify party.");
    }

    if (!party) {
      return routeError("NOT_FOUND", "Party was not found.");
    }

    const { data: stats, error: statsError } = await adminSupabase
      .from("user_stats")
      .select("xp, current_rank:ranks(id, name, min_xp)")
      .eq("user_id", auth.user.id)
      .returns<UserRankRow[]>()
      .maybeSingle();

    if (statsError) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not verify your rank.");
    }

    if (!stats) {
      return routeError("NOT_FOUND", "User stats were not found.");
    }

    const minimumRank = normalizeRelation(party.min_rank);
    const currentRank = normalizeRelation(stats.current_rank);

    if (minimumRank && (!currentRank || currentRank.min_xp < minimumRank.min_xp)) {
      return routeError(
        "FORBIDDEN",
        `This party requires ${minimumRank.name} rank or higher.`,
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data: membership, error } = await supabase
      .from("party_members")
      .insert({
        party_id: partyId,
        user_id: auth.user.id,
        role: "member",
      })
      .select("id, party_id, user_id, role, joined_at")
      .single();

    if (isDuplicateError(error)) {
      return routeError("CONFLICT", "You are already a member of this party.");
    }

    if (error || !membership) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not join party.");
    }

    return successResponse(membership, {
      message: "Party joined.",
      status: 201,
    });
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not join party.");
  }
}

function normalizeRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}
