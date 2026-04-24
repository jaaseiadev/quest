"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RadioTower } from "lucide-react";

import { FullLeaderboardTable } from "@/components/leaderboard/FullLeaderboardTable";
import { TopRankersSection } from "@/components/leaderboard/TopRankersSection";
import type { LeaderboardViewEntry } from "@/components/leaderboard/types";
import {
  Card,
  EmptyState,
  LoadingState,
  PageHeader,
} from "@/components/ui";
import type { ApiResponse, LeaderboardEntry } from "@/types/api";

export function LeaderboardClient() {
  const [entries, setEntries] = useState<LeaderboardViewEntry[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadMessage, setLoadMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeaderboard() {
      setLoadState("loading");
      setLoadMessage(null);

      try {
        const response = await fetch("/api/leaderboard?limit=100", {
          signal: controller.signal,
        });
        const json = (await response.json()) as ApiResponse<LeaderboardEntry[]>;

        if (!json.ok) {
          throw new Error(json.error.message);
        }

        setEntries(json.data);
        setLoadState("ready");
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadState("error");
        setLoadMessage(
          error instanceof Error
            ? error.message
            : "Leaderboard data could not be loaded.",
        );
      }
    }

    loadLeaderboard();

    return () => {
      controller.abort();
    };
  }, []);

  const totalXp = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.xp, 0),
    [entries],
  );
  const partyCount = useMemo(
    () =>
      new Set(
        entries
          .map((entry) => entry.party?.id)
          .filter((partyId): partyId is number => typeof partyId === "number"),
      ).size,
    [entries],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        label="Global Leaderboard"
        title="Ranked by Completed Quest XP"
        description="Track the strongest student operatives by earned XP, verified rank, and current party affiliation."
        actions={
          <LeaderboardStats
            entries={entries.length}
            totalXp={totalXp}
            partyCount={partyCount}
          />
        }
      />

      {loadState === "loading" ? (
        <Card>
          <LoadingState label="Syncing XP ranking board" rows={7} />
        </Card>
      ) : null}

      {loadState === "error" ? (
        <div
          className="flex items-start gap-3 border border-danger bg-danger/10 p-4 text-danger"
          role="alert"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-display text-sm font-semibold uppercase">
              Ranking feed offline
            </p>
            <p className="mt-2 text-sm leading-6">
              {loadMessage ?? "Leaderboard data could not be loaded."}
            </p>
          </div>
        </div>
      ) : null}

      {loadState === "ready" && entries.length === 0 ? (
        <EmptyState
          title="No XP records available"
          description="Completed quests will populate this board once XP has been awarded."
        />
      ) : null}

      {loadState === "ready" && entries.length > 0 ? (
        <>
          <TopRankersSection entries={entries.slice(0, 3)} />
          <FullLeaderboardTable entries={entries} />
        </>
      ) : null}
    </div>
  );
}

function LeaderboardStats({
  entries,
  totalXp,
  partyCount,
}: {
  entries: number;
  totalXp: number;
  partyCount: number;
}) {
  return (
    <div className="grid min-w-72 grid-cols-3 border border-border bg-surface-container">
      <Stat label="Ranked" value={entries.toString()} />
      <Stat label="Total XP" value={totalXp.toLocaleString()} />
      <Stat label="Parties" value={partyCount.toString()} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-border p-3 last:border-r-0">
      <div className="flex items-center gap-2">
        <RadioTower className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <p className="text-label-caps text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 font-display text-xl font-semibold text-secondary">{value}</p>
    </div>
  );
}
