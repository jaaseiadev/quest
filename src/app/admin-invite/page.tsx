import { redirect } from "next/navigation";

import { AdminInviteClient } from "@/components/admin";
import { AppShell } from "@/components/shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Rank, RoleName } from "@/types/db";

export const dynamic = "force-dynamic";

type RoleRelation = {
  name: RoleName;
};

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  roles: RoleRelation | RoleRelation[] | null;
};

type UserStatsRow = {
  xp: number;
  current_rank:
    | Pick<Rank, "id" | "name" | "min_xp" | "max_xp">
    | Pick<Rank, "id" | "name" | "min_xp" | "max_xp">[]
    | null;
};

const BEGINNER_RANK = {
  id: 1,
  name: "Beginner",
  min_xp: 0,
  max_xp: 149,
};

export default async function AdminInvitePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [profileResult, statsResult, ranksResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url, roles(name)")
      .eq("id", user.id)
      .returns<ProfileRow[]>()
      .maybeSingle(),
    supabase
      .from("user_stats")
      .select("xp, current_rank:ranks(id, name, min_xp, max_xp)")
      .eq("user_id", user.id)
      .returns<UserStatsRow[]>()
      .maybeSingle(),
    supabase
      .from("ranks")
      .select("id, name, min_xp, max_xp")
      .order("min_xp", { ascending: true })
      .returns<Pick<Rank, "id" | "name" | "min_xp" | "max_xp">[]>(),
  ]);

  const ranks = ranksResult.data ?? [];
  const currentRank =
    normalizeRelation(statsResult.data?.current_rank) ??
    findRankForXp(ranks, statsResult.data?.xp ?? 0) ??
    BEGINNER_RANK;
  const profile = profileResult.data;
  const displayName = getDisplayName(profile, user.email);

  return (
    <AppShell
      displayName={displayName}
      rankLabel={currentRank.name}
      isAdmin={getRoleName(profile) === "admin"}
    >
      <AdminInviteClient />
    </AppShell>
  );
}

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function findRankForXp(
  ranks: Pick<Rank, "id" | "name" | "min_xp" | "max_xp">[],
  xp: number,
) {
  return (
    ranks.find(
      (rank) => xp >= rank.min_xp && (rank.max_xp === null || xp <= rank.max_xp),
    ) ?? null
  );
}

function getDisplayName(profile: ProfileRow | null, email?: string) {
  return profile?.display_name?.trim() || email?.split("@")[0] || "Operative";
}

function getRoleName(profile: ProfileRow | null) {
  return normalizeRelation(profile?.roles)?.name ?? null;
}
