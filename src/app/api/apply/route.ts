import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import {
  authErrorResponse,
  getRequiredUuid,
  isDuplicateError,
  logRouteError,
  parseJsonBody,
  routeError,
} from "@/lib/api/route-utils";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplyResponse } from "@/types/api";

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

    const jobId = getRequiredUuid(parsed.data, "jobId");

    if (!jobId) {
      return routeError("BAD_REQUEST", "A valid jobId is required.");
    }

    const adminSupabase = createSupabaseAdminClient();
    const { data: job, error: jobError } = await adminSupabase
      .from("jobs")
      .select("id, status, slots")
      .eq("id", jobId)
      .maybeSingle();

    if (jobError) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not verify job.");
    }

    if (!job) {
      return routeError("NOT_FOUND", "Job was not found.");
    }

    if (job.status !== "open") {
      return routeError("CONFLICT", "This job is closed.");
    }

    if (job.slots <= 0) {
      return routeError("CONFLICT", "This job has no available slots.");
    }

    const supabase = await createSupabaseServerClient();
    const { data: application, error } = await supabase
      .from("job_applications")
      .insert({
        job_id: jobId,
        user_id: auth.user.id,
      })
      .select("id, status")
      .single();

    if (isDuplicateError(error)) {
      return routeError("CONFLICT", "You have already applied to this job.");
    }

    if (error || !application) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not submit application.");
    }

    return successResponse<ApplyResponse>(
      {
        id: application.id,
        status: "pending",
      },
      {
        message: "Application submitted.",
        status: 201,
      },
    );
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not submit application.");
  }
}
