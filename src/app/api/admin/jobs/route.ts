import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import {
  authErrorResponse,
  logRouteError,
  parseJsonBody,
  routeError,
} from "@/lib/api/route-utils";
import { validateCreateJobPayload } from "@/lib/api/job-validation";
import { requireAdmin } from "@/lib/roles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AdminJobListItem } from "@/types/api";

type AdminJobRow = Omit<AdminJobListItem, "recommended_rank" | "creator"> & {
  recommended_rank:
    | AdminJobListItem["recommended_rank"]
    | AdminJobListItem["recommended_rank"][];
  creator: AdminJobListItem["creator"] | AdminJobListItem["creator"][];
};

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return authErrorResponse(auth);
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("jobs")
      .select(
        `
          id,
          title,
          description,
          category,
          company,
          pay,
          location,
          slots,
          reward_xp,
          status,
          deadline,
          recommended_rank_id,
          created_by,
          created_at,
          updated_at,
          recommended_rank:ranks(id, name, min_xp, max_xp),
          creator:profiles!jobs_created_by_fkey(id, display_name, email)
        `,
      )
      .order("created_at", { ascending: false })
      .returns<AdminJobRow[]>();

    if (error) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not fetch admin jobs.");
    }

    return successResponse(data.map(normalizeJobRow));
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not fetch admin jobs.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return authErrorResponse(auth);
    }

    const parsed = await parseJsonBody(request);

    if (!parsed.ok) {
      return parsed.response;
    }

    const payload = validateCreateJobPayload(parsed.data, auth.profile.id);

    if (!payload.ok) {
      return payload.response;
    }

    const supabase = createSupabaseAdminClient();
    const rankIsValid = await recommendedRankExists(payload.data.recommended_rank_id);

    if (!rankIsValid) {
      return routeError("BAD_REQUEST", "Recommended rank does not exist.");
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert(payload.data)
      .select(
        "id, title, description, category, company, pay, location, slots, reward_xp, status, deadline, recommended_rank_id, created_by, created_at, updated_at",
      )
      .single();

    if (error || !data) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not create job.");
    }

    return successResponse(data, {
      message: "Job created.",
      status: 201,
    });
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not create job.");
  }
}

async function recommendedRankExists(rankId: number | null | undefined) {
  if (!rankId) {
    return true;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("ranks")
    .select("id")
    .eq("id", rankId)
    .maybeSingle();

  return !error && Boolean(data);
}

function normalizeJobRow(row: AdminJobRow): AdminJobListItem {
  return {
    ...row,
    recommended_rank: normalizeRelation(row.recommended_rank),
    creator: normalizeRelation(row.creator),
  };
}

function normalizeRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}
