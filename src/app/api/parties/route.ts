import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import {
  authErrorResponse,
  getOptionalInteger,
  getOptionalString,
  getString,
  isDuplicateError,
  logRouteError,
  parseBooleanParam,
  parseJsonBody,
  routeError,
} from "@/lib/api/route-utils";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PartyListItem, PartyListMember } from "@/types/api";
import type { Party } from "@/types/db";

type PartyRow = Party & {
  min_rank: PartyListItem["min_rank"] | PartyListItem["min_rank"][];
  leader: PartyListItem["leader"] | PartyListItem["leader"][];
};

type PartyMemberRow = {
  id: number;
  party_id: number;
  role: "leader" | "member";
  joined_at: string;
  user:
    | {
        id: string;
        display_name: string | null;
        avatar_url: string | null;
      }
    | {
        id: string;
        display_name: string | null;
        avatar_url: string | null;
      }[]
    | null;
};

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdminClient();
    const includeMembers = parseBooleanParam(
      request.nextUrl.searchParams.get("includeMembers"),
    );

    const { data: parties, error } = await supabase
      .from("parties")
      .select(
        `
          id,
          name,
          description,
          leader_id,
          category,
          min_rank_id,
          created_at,
          updated_at,
          min_rank:ranks(id, name, min_xp),
          leader:profiles!parties_leader_id_fkey(id, display_name, avatar_url)
        `,
      )
      .order("created_at", { ascending: false })
      .returns<PartyRow[]>();

    if (error) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not fetch parties.");
    }

    const partyIds = parties.map((party) => party.id);
    const membersByPartyId = await getMembersByPartyId(partyIds, includeMembers);

    return successResponse(
      parties.map<PartyListItem>((party) => {
        const members = membersByPartyId.get(party.id) ?? [];

        return {
          ...party,
          min_rank: normalizeRelation(party.min_rank),
          leader: normalizeRelation(party.leader),
          member_count: members.length,
          ...(includeMembers ? { members } : {}),
        };
      }),
    );
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not fetch parties.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return authErrorResponse(auth);
    }

    const parsed = await parseJsonBody(request);

    if (!parsed.ok) {
      return parsed.response;
    }

    const name = getString(parsed.data, "name");
    const description = getOptionalString(parsed.data, "description");
    const category = getOptionalString(parsed.data, "category");
    const minRankId = getOptionalInteger(parsed.data, "min_rank_id");

    if (!name) {
      return routeError("BAD_REQUEST", "Party name is required.");
    }

    if (description === undefined || category === undefined || minRankId === undefined) {
      return routeError("BAD_REQUEST", "Party fields have invalid values.");
    }

    if (minRankId !== null && minRankId < 1) {
      return routeError("BAD_REQUEST", "Minimum rank must be valid.");
    }

    if (minRankId !== null) {
      const adminSupabase = createSupabaseAdminClient();
      const { data: rank, error: rankError } = await adminSupabase
        .from("ranks")
        .select("id")
        .eq("id", minRankId)
        .maybeSingle();

      if (rankError) {
        return routeError("INTERNAL_SERVER_ERROR", "Could not verify minimum rank.");
      }

      if (!rank) {
        return routeError("BAD_REQUEST", "Minimum rank does not exist.");
      }
    }

    const supabase = await createSupabaseServerClient();
    const { data: party, error } = await supabase
      .from("parties")
      .insert({
        name,
        description,
        category,
        min_rank_id: minRankId,
        leader_id: auth.user.id,
      })
      .select(
        "id, name, description, leader_id, category, min_rank_id, created_at, updated_at",
      )
      .single();

    if (isDuplicateError(error)) {
      return routeError("CONFLICT", "A party with this name already exists.");
    }

    if (error || !party) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not create party.");
    }

    return successResponse(party, {
      message: "Party created.",
      status: 201,
    });
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not create party.");
  }
}

async function getMembersByPartyId(partyIds: number[], includeMembers: boolean) {
  const membersByPartyId = new Map<number, PartyListMember[]>();

  partyIds.forEach((partyId) => membersByPartyId.set(partyId, []));

  if (partyIds.length === 0) {
    return membersByPartyId;
  }

  const supabase = createSupabaseAdminClient();
  const select = includeMembers
    ? `
        id,
        party_id,
        role,
        joined_at,
        user:profiles!party_members_user_id_fkey(id, display_name, avatar_url)
      `
    : "id, party_id, role, joined_at";

  const { data, error } = await supabase
    .from("party_members")
    .select(select)
    .in("party_id", partyIds)
    .order("joined_at", { ascending: true })
    .returns<PartyMemberRow[]>();

  if (error) {
    return membersByPartyId;
  }

  data.forEach((member) => {
    membersByPartyId.get(member.party_id)?.push({
      id: member.id,
      role: member.role,
      joined_at: member.joined_at,
      user: includeMembers ? normalizeRelation(member.user) : null,
    });
  });

  return membersByPartyId;
}

function normalizeRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}
