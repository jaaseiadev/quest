import { NextResponse, type NextRequest } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth-redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(nextPath, request.url));
    }

    return redirectWithError(request, error.message);
  }

  const providerError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error") ??
    "Authentication callback failed.";

  return redirectWithError(request, providerError);
}

function redirectWithError(request: NextRequest, message: string) {
  const redirectUrl = new URL("/auth/login", request.url);
  redirectUrl.searchParams.set("error", message);

  return NextResponse.redirect(redirectUrl);
}
