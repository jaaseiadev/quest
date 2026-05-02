import { type NextRequest } from "next/server";

import { successResponse } from "@/lib/api-response";
import {
  authErrorResponse,
  getRequiredUuid,
  isApplicationStatus,
  logRouteError,
  parseJsonBody,
  routeError,
} from "@/lib/api/route-utils";
import { requireAdmin } from "@/lib/roles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { AdminApplicationListItem } from "@/types/api";
import type { ApplicationStatus } from "@/types/db";

type ApplicationRow = Omit<AdminApplicationListItem, "job" | "applicant"> & {
  job:
    | AdminApplicationListItem["job"]
    | AdminApplicationListItem["job"][]
    | null;
  applicant:
    | AdminApplicationListItem["applicant"]
    | AdminApplicationListItem["applicant"][]
    | null;
};

type ApplicationStatusRow = {
  id: string;
  job_id: string;
  status: ApplicationStatus;
  jobs:
    | {
        slots: number;
      }
    | {
        slots: number;
      }[]
    | null;
};

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return authErrorResponse(auth);
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("job_applications")
      .select(
        `
          id,
          status,
          created_at,
          xp_awarded,
          job:jobs(id, title, reward_xp, slots),
          applicant:profiles!job_applications_user_id_fkey(
            id,
            display_name,
            avatar_url,
            email
          )
        `,
      )
      .order("created_at", { ascending: false })
      .returns<ApplicationRow[]>();

    if (error) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not fetch applications.");
    }

    return successResponse(
      data.map((application) => ({
        ...application,
        job: normalizeRelation(application.job),
        applicant: normalizeRelation(application.applicant),
      })),
    );
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not fetch applications.");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin();

    if (!auth.ok) {
      return authErrorResponse(auth);
    }

    const parsed = await parseJsonBody(request);

    if (!parsed.ok) {
      return parsed.response;
    }

    const applicationId = getRequiredUuid(parsed.data, "applicationId");
    const status = parsed.data.status;

    if (!applicationId) {
      return routeError("BAD_REQUEST", "A valid applicationId is required.");
    }

    if (!isApplicationStatus(status)) {
      return routeError("BAD_REQUEST", "Application status is invalid.");
    }

    const supabase = createSupabaseAdminClient();
    const { data: application, error: applicationError } = await supabase
      .from("job_applications")
      .select("id, job_id, status, jobs(slots)")
      .eq("id", applicationId)
      .returns<ApplicationStatusRow[]>()
      .maybeSingle();

    if (applicationError) {
      return routeError("INTERNAL_SERVER_ERROR", "Could not verify application.");
    }

    if (!application) {
      return routeError("NOT_FOUND", "Application was not found.");
    }

    const job = normalizeRelation(application.jobs);

    if (status === "accepted" && !usesJobSlot(application.status)) {
      const slotResult = await decrementJobSlot(application.job_id, job?.slots ?? 0);

      if (!slotResult.ok) {
        return slotResult.response;
      }
    }

    const { data: updatedApplication, error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", applicationId)
      .select("id, job_id, user_id, status, xp_awarded, created_at, updated_at")
      .maybeSingle();

    if (error) {
      if (status === "accepted" && !usesJobSlot(application.status)) {
        await restoreJobSlot(application.job_id);
      }

      return routeError("INTERNAL_SERVER_ERROR", "Could not update application.");
    }

    if (!updatedApplication) {
      return routeError("NOT_FOUND", "Application was not found.");
    }

    return successResponse(updatedApplication, {
      message: "Application updated.",
    });
  } catch (error) {
    logRouteError(request, error);
    return routeError("INTERNAL_SERVER_ERROR", "Could not update application.");
  }
}

async function decrementJobSlot(jobId: string, currentSlots: number) {
  if (currentSlots <= 0) {
    return {
      ok: false as const,
      response: routeError("CONFLICT", "No slots are available for this job."),
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("jobs")
    .update({ slots: currentSlots - 1 })
    .eq("id", jobId)
    .eq("slots", currentSlots)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      ok: false as const,
      response: routeError("INTERNAL_SERVER_ERROR", "Could not reserve job slot."),
    };
  }

  if (!data) {
    return {
      ok: false as const,
      response: routeError("CONFLICT", "No slots are available for this job."),
    };
  }

  return {
    ok: true as const,
  };
}

async function restoreJobSlot(jobId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: job } = await supabase
    .from("jobs")
    .select("slots")
    .eq("id", jobId)
    .maybeSingle();

  if (job) {
    await supabase
      .from("jobs")
      .update({ slots: job.slots + 1 })
      .eq("id", jobId)
      .eq("slots", job.slots);
  }
}

function normalizeRelation<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function usesJobSlot(status: ApplicationStatus) {
  return status === "accepted" || status === "in_progress" || status === "completed";
}
