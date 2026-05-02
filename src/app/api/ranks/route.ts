import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import { logRouteError, routeError } from "@/lib/api/route-utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Rank } from "@/types/db";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("ranks")
      .select("id, name, min_xp, max_xp, created_at")
      .order("min_xp", { ascending: true })
      .returns<Rank[]>();

    if (error) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not fetch ranks.");
    }

    return successResponse(data);
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not fetch ranks.");
  }
}
