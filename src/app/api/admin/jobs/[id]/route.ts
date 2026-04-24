import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import {
  authErrorResponse,
  isUuid,
  logRouteError,
  parseJsonBody,
  routeError,
} from "@/lib/api/route-utils";
import { validateUpdateJobPayload } from "@/lib/api/job-validation";
import { requireAdmin } from "@/lib/roles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AdminJobListItem } from "@/types/api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type AdminJobRow = Omit<AdminJobListItem, "recommended_rank" | "creator"> & {
  recommended_rank:
    | AdminJobListItem["recommended_rank"]
    | AdminJobListItem["recommended_rank"][];
  creator: AdminJobListItem["creator"] | AdminJobListItem["creator"][];
};

const ADMIN_JOB_SELECT = `
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
`;

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return authErrorResponse(auth);
    }

    const { id } = await context.params;

    if (!isUuid(id)) {
      return routeError("BAD_REQUEST", "A valid job id is required.");
    }

    const parsed = await parseJsonBody(request);

    if (!parsed.ok) {
      return parsed.response;
    }

    const payload = validateUpdateJobPayload(parsed.data);

    if (!payload.ok) {
      return payload.response;
    }

    if (Object.keys(payload.data).length === 0) {
      return routeError("BAD_REQUEST", "At least one job field is required.");
    }

    const supabase = createSupabaseAdminClient();
    const rankIsValid = await recommendedRankExists(payload.data.recommended_rank_id);

    if (!rankIsValid) {
      return routeError("BAD_REQUEST", "Recommended rank does not exist.");
    }

    const { data, error } = await supabase
      .from("jobs")
      .update(payload.data)
      .eq("id", id)
      .select(ADMIN_JOB_SELECT)
      .returns<AdminJobRow[]>()
      .maybeSingle();

    if (error) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not update job.");
    }

    if (!data) {
      return routeError("NOT_FOUND", "Job was not found.");
    }

    return successResponse(normalizeJobRow(data), {
      message: "Job updated.",
    });
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not update job.");
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return authErrorResponse(auth);
    }

    const { id } = await context.params;

    if (!isUuid(id)) {
      return routeError("BAD_REQUEST", "A valid job id is required.");
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("jobs")
      .update({ status: "closed" })
      .eq("id", id)
      .select(ADMIN_JOB_SELECT)
      .returns<AdminJobRow[]>()
      .maybeSingle();

    if (error) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not close job.");
    }

    if (!data) {
      return routeError("NOT_FOUND", "Job was not found.");
    }

    return successResponse(normalizeJobRow(data), {
      message: "Job closed.",
    });
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not close job.");
  }
}

async function recommendedRankExists(rankId: number | null | undefined) {
  if (rankId === undefined || rankId === null) {
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
