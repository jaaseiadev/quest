import { timingSafeEqual } from "crypto";
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { logRouteError } from "@/lib/api/route-utils";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireUser();

    if (!auth.ok) {
      return inviteError(auth.message, auth.status);
    }

    const inviteCode = process.env.ADMIN_INVITE_CODE?.trim();

    if (!inviteCode) {
      return inviteError("Admin invite is not configured.", 500);
    }

    const parsed = await parseInviteBody(request);

    if (!parsed.ok) {
      return inviteError(parsed.error, 400);
    }

    if (!parsed.inviteCode) {
      return inviteError("Invite code is required.", 400);
    }

    if (!inviteCodesMatch(parsed.inviteCode, inviteCode)) {
      return inviteError("Invalid invite code.", 403);
    }

    const supabase = createSupabaseAdminClient();
    const { data: adminRole, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "admin")
      .maybeSingle();

    if (roleError || !adminRole) {
      return inviteError("Admin role was not found.", 500);
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({ role_id: adminRole.id })
      .eq("id", auth.user.id)
      .select("id, email, display_name, avatar_url, role_id")
      .maybeSingle();

    if (error) {
      return inviteError("Could not promote user.", 500);
    }

    if (!profile) {
      return inviteError("Profile was not found.", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Admin access granted.",
    });
  } catch (error) {
    logRouteError(request, error);
    return inviteError("Could not process invite.", 500);
  }
}

function inviteError(error: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  );
}

async function parseInviteBody(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

    if (!isRecord(body)) {
      return {
        ok: false as const,
        error: "Request body must be a JSON object.",
      };
    }

    const inviteCode = body.inviteCode;

    return {
      ok: true as const,
      inviteCode: typeof inviteCode === "string" ? inviteCode.trim() : null,
    };
  } catch {
    return {
      ok: false as const,
      error: "Request body must be valid JSON.",
    };
  }
}

function inviteCodesMatch(submittedCode: string, inviteCode: string) {
  const submittedBuffer = Buffer.from(submittedCode);
  const inviteBuffer = Buffer.from(inviteCode);

  return (
    submittedBuffer.length === inviteBuffer.length &&
    timingSafeEqual(submittedBuffer, inviteBuffer)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
