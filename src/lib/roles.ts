import type { Profile, RoleName } from "@/types/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RoleRelation = {
  name: RoleName;
};

export type CurrentProfile = Pick<
  Profile,
  "id" | "email" | "display_name" | "avatar_url" | "role_id"
> & {
  roles: RoleRelation | RoleRelation[] | null;
};

export function getProfileRoleName(profile: CurrentProfile | null) {
  if (!profile?.roles) {
    return null;
  }

  return Array.isArray(profile.roles)
    ? (profile.roles[0]?.name ?? null)
    : profile.roles.name;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, display_name, avatar_url, role_id, roles(name)")
    .eq("id", userData.user.id)
    .returns<CurrentProfile[]>()
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      ok: false as const,
      status: 401,
      message: "Authentication required.",
    };
  }

  if (getProfileRoleName(profile) !== "admin") {
    return {
      ok: false as const,
      status: 403,
      message: "Admin access required.",
    };
  }

  return {
    ok: true as const,
    profile,
  };
}
