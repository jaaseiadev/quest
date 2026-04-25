import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import {
  getSupabasePublicKey,
  getSupabasePublicUrl,
} from "@/lib/supabase/config";
import type { Database, RoleName } from "@/types/db";

const AUTH_PATHS = ["/auth/login", "/auth/sign-up", "/auth/forgot-password"];
const PROTECTED_PATHS = [
  "/dashboard",
  "/questboard",
  "/party-management",
  "/leaderboard",
  "/admin",
];
const ADMIN_PATH = "/admin";

type RoleRelation = {
  name: RoleName;
};

type ProxyProfile = {
  roles: RoleRelation | RoleRelation[] | null;
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    getSupabasePublicUrl(),
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && isProtectedPath(pathname)) {
    return redirectToLogin(request, response);
  }

  if (user && isAuthPath(pathname)) {
    return redirectWithSupabaseCookies(
      new URL("/dashboard", request.url),
      response,
    );
  }

  if (user && isAdminPath(pathname)) {
    const isAdmin = await currentUserIsAdmin(supabase, user.id);

    if (!isAdmin) {
      return redirectWithSupabaseCookies(
        new URL("/dashboard", request.url),
        response,
      );
    }
  }

  return response;
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function isAdminPath(pathname: string) {
  return pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`);
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((path) => pathname === path);
}

function redirectToLogin(request: NextRequest, response: NextResponse) {
  const redirectUrl = new URL("/auth/login", request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  redirectUrl.searchParams.set("next", nextPath);

  return redirectWithSupabaseCookies(redirectUrl, response);
}

function redirectWithSupabaseCookies(url: URL, response: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);

  response.cookies.getAll().forEach(({ name, value, ...options }) => {
    redirectResponse.cookies.set(name, value, options);
  });

  return redirectResponse;
}

function getRoleName(profile: ProxyProfile | null) {
  if (!profile?.roles) {
    return null;
  }

  return Array.isArray(profile.roles)
    ? (profile.roles[0]?.name ?? null)
    : profile.roles.name;
}

async function currentUserIsAdmin(
  supabase: ReturnType<typeof createServerClient<Database>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("roles(name)")
    .eq("id", userId)
    .returns<ProxyProfile[]>()
    .maybeSingle();

  if (error) {
    return false;
  }

  return getRoleName(data) === "admin";
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
