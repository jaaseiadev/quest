import { redirect } from "next/navigation";

import { QuestBoardClient, type QuestApplicationState } from "@/components/questboard";
import { AppShell } from "@/components/shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicationStatus, Rank } from "@/types/db";

export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type UserStatsRow = {
  xp: number;
  current_rank: Pick<Rank, "id" | "name" | "min_xp" | "max_xp"> | Pick<Rank, "id" | "name" | "min_xp" | "max_xp">[] | null;
};

type ApplicationRow = {
  id: string;
  job_id: string;
  status: ApplicationStatus;
};

const BEGINNER_RANK = {
  id: 1,
  name: "Beginner",
  min_xp: 0,
  max_xp: 149,
};

export default async function QuestBoardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [profileResult, statsResult, ranksResult, applicationsResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, display_name, avatar_url")
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
      supabase
        .from("job_applications")
        .select("id, job_id, status")
        .eq("user_id", user.id)
        .returns<ApplicationRow[]>(),
    ]);

  const ranks = ranksResult.data ?? [];
  const currentRank =
    normalizeRelation(statsResult.data?.current_rank) ??
    findRankForXp(ranks, statsResult.data?.xp ?? 0) ??
    BEGINNER_RANK;
  const applications: QuestApplicationState[] = (applicationsResult.data ?? []).map(
    (application) => ({
      applicationId: application.id,
      jobId: application.job_id,
      status: application.status,
    }),
  );
  const displayName = getDisplayName(profileResult.data, user.email);

  return (
    <AppShell displayName={displayName} rankLabel={currentRank.name}>
      <QuestBoardClient ranks={ranks} initialApplications={applications} />
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
    ranks.find((rank) => xp >= rank.min_xp && (rank.max_xp === null || xp <= rank.max_xp)) ??
    null
  );
}

function getDisplayName(profile: ProfileRow | null, email?: string) {
  return profile?.display_name?.trim() || email?.split("@")[0] || "Operative";
}

