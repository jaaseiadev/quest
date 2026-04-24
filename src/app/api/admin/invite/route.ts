import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import {
  authErrorResponse,
  getString,
  logRouteError,
  parseJsonBody,
  routeError,
} from "@/lib/api/route-utils";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return authErrorResponse(auth);
    }

    const inviteCode = process.env.ADMIN_INVITE_CODE;

    if (!inviteCode) {
      return routeError("INTERNAL_SERVER_ERROR", "Admin invite is not configured.");
    }

    const parsed = await parseJsonBody(request);

    if (!parsed.ok) {
      return parsed.response;
    }

    const submittedCode = getString(parsed.data, "inviteCode");

    if (!submittedCode) {
      return routeError("BAD_REQUEST", "Invite code is required.");
    }

    if (submittedCode !== inviteCode) {
      return routeError("FORBIDDEN", "Invite code is invalid.");
    }

    const supabase = createSupabaseAdminClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .update({ role_id: 2 })
      .eq("id", auth.user.id)
      .select("id, email, display_name, avatar_url, role_id")
      .maybeSingle();

    if (error) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not promote user.");
    }

    if (!profile) {
      return routeError("NOT_FOUND", "Profile was not found.");
    }

    return successResponse(profile, {
      message: "Admin access granted.",
    });
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not process invite.");
  }
}
