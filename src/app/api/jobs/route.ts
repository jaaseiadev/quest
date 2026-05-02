import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import {
  logRouteError,
  parsePagination,
  routeError,
} from "@/lib/api/route-utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { JobListItem } from "@/types/api";

type JobRow = Omit<JobListItem, "recommended_rank"> & {
  recommended_rank: JobListItem["recommended_rank"] | JobListItem["recommended_rank"][];
};

const DATE_FILTERS: Record<string, number | null> = {
  "Last Week": 7,
  "Last Month": 30,
  Recent: 14,
  "All Time": null,
};

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = request.nextUrl;
    const { limit, offset } = parsePagination(searchParams);
    const difficulty = searchParams.get("difficulty")?.trim();
    const category = searchParams.get("category")?.trim();
    const datePosted = searchParams.get("datePosted")?.trim();

    let recommendedRankId: number | null = null;

    if (difficulty) {
      const { data: rank, error: rankError } = await supabase
        .from("ranks")
        .select("id")
        .eq("name", difficulty)
        .maybeSingle();

      if (rankError) {
        return routeError("INTERNAL_SERVER_ERROR", "Could not resolve rank filter.");
      }

      if (!rank) {
        return successResponse<JobListItem[]>([]);
      }

      recommendedRankId = rank.id;
    }

    let query = supabase
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
          created_at,
          recommended_rank:ranks(id, name, min_xp, max_xp)
        `,
      )
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("category", category);
    }

    if (recommendedRankId) {
      query = query.eq("recommended_rank_id", recommendedRankId);
    }

    const days = datePosted ? DATE_FILTERS[datePosted] : undefined;

    if (days) {
      const since = new Date();
      since.setDate(since.getDate() - days);
      query = query.gte("created_at", since.toISOString());
    }

    const { data, error } = await query.returns<JobRow[]>();

    if (error) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not fetch jobs.");
    }

    return successResponse(data.map(normalizeJobRow));
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not fetch jobs.");
  }
}

function normalizeJobRow(row: JobRow): JobListItem {
  return {
    ...row,
    recommended_rank: Array.isArray(row.recommended_rank)
      ? (row.recommended_rank[0] ?? null)
      : row.recommended_rank,
  };
}
