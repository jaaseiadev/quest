import { redirect } from "next/navigation";

import {
  ApplicationSummary,
  DashboardErrorBanner,
  RankProgressCard,
  RecentApplications,
  RecommendedQuests,
  StatsGrid,
  WelcomeSection,
  type DashboardApplication,
  type DashboardQuest,
  type DashboardRank,
  type DashboardStats,
} from "@/components/dashboard";
import { AppShell } from "@/components/shared";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/types/db";

export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type UserStatsRow = {
  xp: number;
  current_rank_id: number | null;
  current_rank: DashboardRank | DashboardRank[] | null;
};

type ApplicationJobRow = {
  id: string;
  title: string;
  reward_xp: number;
};

type ApplicationRow = {
  id: string;
  status: ApplicationStatus;
  created_at: string;
  job: ApplicationJobRow | ApplicationJobRow[] | null;
};

type QuestRow = {
  id: string;
  title: string;
  category: string | null;
  company: string | null;
  pay: number | null;
  location: string | null;
  slots: number;
  reward_xp: number;
  deadline: string | null;
  recommended_rank: DashboardRank | DashboardRank[] | null;
};

const APPLICATION_STATUSES: ApplicationStatus[] = [
  "pending",
  "accepted",
  "in_progress",
  "completed",
  "rejected",
];

const BEGINNER_RANK: DashboardRank = {
  id: 1,
  name: "Beginner",
  min_xp: 0,
  max_xp: 149,
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [profileResult, statsResult, ranksResult, applicationsResult, questsResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, display_name, avatar_url")
        .eq("id", user.id)
        .returns<ProfileRow[]>()
        .maybeSingle(),
      supabase
        .from("user_stats")
        .select("xp, current_rank_id, current_rank:ranks(id, name, min_xp, max_xp)")
        .eq("user_id", user.id)
        .returns<UserStatsRow[]>()
        .maybeSingle(),
      supabase
        .from("ranks")
        .select("id, name, min_xp, max_xp")
        .order("min_xp", { ascending: true })
        .returns<DashboardRank[]>(),
      supabase
        .from("job_applications")
        .select("id, status, created_at, job:jobs(id, title, reward_xp)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100)
        .returns<ApplicationRow[]>(),
      supabase
        .from("jobs")
        .select(
          `
            id,
            title,
            category,
            company,
            pay,
            location,
            slots,
            reward_xp,
            deadline,
            recommended_rank:ranks(id, name, min_xp, max_xp)
          `,
        )
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(12)
        .returns<QuestRow[]>(),
    ]);

  const errors = collectDashboardErrors({
    profileError: profileResult.error,
    statsError: statsResult.error,
    ranksError: ranksResult.error,
    applicationsError: applicationsResult.error,
    questsError: questsResult.error,
  });

  const profile = profileResult.data;
  const ranks = ranksResult.data ?? [];
  const totalXp = statsResult.data?.xp ?? 0;
  const currentRank =
    normalizeRelation(statsResult.data?.current_rank) ??
    findRankForXp(ranks, totalXp) ??
    BEGINNER_RANK;
  const stats = buildDashboardStats({
    totalXp,
    currentRank,
    ranks,
    applications: applicationsResult.data ?? [],
  });
  const displayName = getDisplayName(profile, user.email);
  const applications = normalizeApplications(applicationsResult.data ?? []);
  const appliedJobIds = new Set(
    (applicationsResult.data ?? [])
      .map((application) => normalizeRelation(application.job)?.id)
      .filter((jobId): jobId is string => Boolean(jobId)),
  );
  const recommendedQuests = getRecommendedQuests(
    questsResult.data ?? [],
    appliedJobIds,
    totalXp,
  );

  return (
    <AppShell displayName={displayName} rankLabel={currentRank.name}>
      <div className="space-y-8">
        <WelcomeSection displayName={displayName} rankLabel={currentRank.name} />
        <DashboardErrorBanner messages={errors} />
        <StatsGrid stats={stats} />
        <RankProgressCard stats={stats} />
        <ApplicationSummary stats={stats} />
        <DashboardSection
          label="Recent Applications"
          title="Latest Quest Attempts"
        >
          <RecentApplications applications={applications.slice(0, 5)} />
        </DashboardSection>
        <DashboardSection label="Recommended Quests" title="Operations In Range">
          <RecommendedQuests quests={recommendedQuests} />
        </DashboardSection>
      </div>
    </AppShell>
  );
}

function DashboardSection({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="border-b border-border pb-4">
        <p className="text-label-caps text-primary">{label}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function collectDashboardErrors({
  profileError,
  statsError,
  ranksError,
  applicationsError,
  questsError,
}: {
  profileError: unknown;
  statsError: unknown;
  ranksError: unknown;
  applicationsError: unknown;
  questsError: unknown;
}) {
  const messages: string[] = [];

  if (profileError) messages.push("Profile data could not be loaded.");
  if (statsError) messages.push("XP and rank stats could not be loaded.");
  if (ranksError) messages.push("Rank thresholds could not be loaded.");
  if (applicationsError) messages.push("Application history could not be loaded.");
  if (questsError) messages.push("Recommended quests could not be loaded.");

  return messages;
}

function buildDashboardStats({
  totalXp,
  currentRank,
  ranks,
  applications,
}: {
  totalXp: number;
  currentRank: DashboardRank;
  ranks: DashboardRank[];
  applications: ApplicationRow[];
}): DashboardStats {
  const nextRank = ranks.find((rank) => rank.min_xp > totalXp) ?? null;
  const nextRankMinXp = nextRank?.min_xp ?? null;
  const xpRange = nextRankMinXp
    ? Math.max(nextRankMinXp - currentRank.min_xp, 1)
    : Math.max((currentRank.max_xp ?? totalXp) - currentRank.min_xp + 1, 1);
  const xpIntoRank = nextRankMinXp
    ? Math.max(totalXp - currentRank.min_xp, 0)
    : xpRange;
  const applicationCounts = createApplicationCounts();

  applications.forEach((application) => {
    applicationCounts[application.status] += 1;
  });

  return {
    totalXp,
    currentRank,
    nextRank,
    xpIntoRank,
    xpRange,
    xpToNextRank: nextRankMinXp ? Math.max(nextRankMinXp - totalXp, 0) : null,
    activeApplications:
      applicationCounts.pending +
      applicationCounts.accepted +
      applicationCounts.in_progress,
    completedQuests: applicationCounts.completed,
    applicationCounts,
  };
}

function createApplicationCounts() {
  return APPLICATION_STATUSES.reduce(
    (counts, status) => {
      counts[status] = 0;
      return counts;
    },
    {} as Record<ApplicationStatus, number>,
  );
}

function normalizeApplications(rows: ApplicationRow[]): DashboardApplication[] {
  return rows.map((row) => {
    const job = normalizeRelation(row.job);

    return {
      id: row.id,
      title: job?.title ?? "Quest intel restricted",
      status: row.status,
      appliedAt: row.created_at,
      rewardXp: job?.reward_xp ?? 0,
    };
  });
}

function getRecommendedQuests(
  rows: QuestRow[],
  appliedJobIds: Set<string>,
  totalXp: number,
) {
  const openQuests = rows
    .filter((row) => row.slots > 0 && !appliedJobIds.has(row.id))
    .map(normalizeQuest);
  const rankMatched = openQuests.filter(
    (quest) => !quest.recommendedRank || quest.recommendedRank.min_xp <= totalXp,
  );

  return (rankMatched.length > 0 ? rankMatched : openQuests).slice(0, 3);
}

function normalizeQuest(row: QuestRow): DashboardQuest {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    company: row.company,
    location: row.location,
    pay: row.pay,
    slots: row.slots,
    rewardXp: row.reward_xp,
    deadline: row.deadline,
    recommendedRank: normalizeRelation(row.recommended_rank),
  };
}

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function findRankForXp(ranks: DashboardRank[], xp: number) {
  return (
    ranks.find((rank) => xp >= rank.min_xp && (rank.max_xp === null || xp <= rank.max_xp)) ??
    null
  );
}

function getDisplayName(profile: ProfileRow | null, email?: string) {
  return profile?.display_name?.trim() || email?.split("@")[0] || "Operative";
}
