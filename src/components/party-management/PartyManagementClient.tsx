"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Trophy } from "lucide-react";

import { CreatePartyDialog } from "@/components/party-management/CreatePartyDialog";
import { PartyCard } from "@/components/party-management/PartyCard";
import type {
  PartyMembershipState,
  PartyRank,
  PartyUserRank,
  PartyViewItem,
} from "@/components/party-management/types";
import {
  Card,
  EmptyState,
  LoadingState,
  PageHeader,
} from "@/components/ui";
import type { ApiResponse, PartyListItem } from "@/types/api";
import type { Party } from "@/types/db";

export type PartyManagementClientProps = {
  ranks: PartyRank[];
  currentUserId: string;
  currentRank: PartyUserRank;
};

export function PartyManagementClient({
  ranks,
  currentUserId,
  currentRank,
}: PartyManagementClientProps) {
  const [parties, setParties] = useState<PartyViewItem[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [joiningPartyId, setJoiningPartyId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "danger";
    message: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadParties() {
      setLoadState("loading");
      setLoadMessage(null);

      try {
        const response = await fetch("/api/parties?includeMembers=true", {
          signal: controller.signal,
        });
        const json = (await response.json()) as ApiResponse<PartyListItem[]>;

        if (!json.ok) {
          throw new Error(json.error.message);
        }

        setParties(json.data);
        setLoadState("ready");
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadState("error");
        setLoadMessage(
          error instanceof Error ? error.message : "Party network failed to load.",
        );
      }
    }

    loadParties();

    return () => {
      controller.abort();
    };
  }, []);

  const joinedPartyIds = useMemo(() => {
    const ids = new Set<number>();

    parties.forEach((party) => {
      if (party.members?.some((member) => member.user?.id === currentUserId)) {
        ids.add(party.id);
      }
    });

    return ids;
  }, [currentUserId, parties]);

  const lockedCount = parties.filter(
    (party) =>
      getMembershipState({
        party,
        currentRank,
        joined: joinedPartyIds.has(party.id),
      }) === "locked",
  ).length;

  async function joinParty(party: PartyViewItem) {
    if (joiningPartyId) return;

    setJoiningPartyId(party.id);
    setFeedback(null);

    try {
      const response = await fetch(`/api/parties/${party.id}/join`, {
        method: "POST",
      });
      const json = (await response.json()) as ApiResponse<unknown>;

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      setParties((current) =>
        current.map((item) =>
          item.id === party.id
            ? {
                ...item,
                member_count: item.member_count + 1,
                members: [
                  ...(item.members ?? []),
                  {
                    id: Date.now(),
                    role: "member",
                    joined_at: new Date().toISOString(),
                    user: {
                      id: currentUserId,
                      display_name: "You",
                      avatar_url: null,
                    },
                  },
                ],
              }
            : item,
        ),
      );
      setFeedback({
        tone: "success",
        message: json.message ?? "Party joined.",
      });
    } catch (error) {
      setFeedback({
        tone: "danger",
        message: error instanceof Error ? error.message : "Could not join party.",
      });
    } finally {
      setJoiningPartyId(null);
    }
  }

  function handleCreated(party: Party, message?: string) {
    const hydratedParty: PartyViewItem = {
      ...party,
      min_rank: ranks.find((rank) => rank.id === party.min_rank_id) ?? null,
      leader: {
        id: currentUserId,
        display_name: "You",
        avatar_url: null,
      },
      member_count: 1,
      members: [
        {
          id: Date.now(),
          role: "leader",
          joined_at: new Date().toISOString(),
          user: {
            id: currentUserId,
            display_name: "You",
            avatar_url: null,
          },
        },
      ],
    };

    setParties((current) => [hydratedParty, ...current]);
    setFeedback({
      tone: "success",
      message: message ?? "Party created.",
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Party Network"
        title="Build Your Squad"
        description="Create a tactical roster, inspect rank requirements, and join parties cleared for your current rank."
        actions={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-stretch">
            <NetworkStats
              parties={parties.length}
              joined={joinedPartyIds.size}
              locked={lockedCount}
            />
            <CreatePartyDialog ranks={ranks} onCreated={handleCreated} />
          </div>
        }
      />

      {feedback ? (
        <FeedbackBanner tone={feedback.tone} message={feedback.message} />
      ) : null}

      {loadState === "loading" ? (
        <Card>
          <LoadingState label="Syncing party network" rows={6} />
        </Card>
      ) : null}

      {loadState === "error" ? (
        <EmptyState
          title="Party network offline"
          description={loadMessage ?? "Existing parties could not be loaded."}
        />
      ) : null}

      {loadState === "ready" && parties.length === 0 ? (
        <EmptyState
          title="No parties assembled"
          description="Create the first roster and become its leader automatically."
        />
      ) : null}

      {loadState === "ready" && parties.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {parties.map((party) => {
            const membershipState = getMembershipState({
              party,
              currentRank,
              joined: joinedPartyIds.has(party.id),
            });

            return (
              <PartyCard
                key={party.id}
                party={party}
                currentRank={currentRank}
                membershipState={membershipState}
                isJoining={joiningPartyId === party.id}
                onJoin={() => joinParty(party)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function getMembershipState({
  party,
  currentRank,
  joined,
}: {
  party: PartyViewItem;
  currentRank: PartyUserRank;
  joined: boolean;
}): PartyMembershipState {
  if (joined) return "joined";
  if (party.min_rank && currentRank.min_xp < party.min_rank.min_xp) return "locked";

  return "available";
}

function NetworkStats({
  parties,
  joined,
  locked,
}: {
  parties: number;
  joined: number;
  locked: number;
}) {
  return (
    <div className="grid w-full grid-cols-3 border border-border bg-surface-container sm:w-auto sm:min-w-60">
      <Stat label="Parties" value={parties.toString()} />
      <Stat label="Joined" value={joined.toString()} />
      <Stat label="Locked" value={locked.toString()} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-border p-3 last:border-r-0">
      <p className="text-label-caps text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-secondary">{value}</p>
    </div>
  );
}

function FeedbackBanner({
  tone,
  message,
}: {
  tone: "success" | "danger";
  message: string;
}) {
  const Icon = tone === "success" ? Trophy : AlertTriangle;
  const toneClass =
    tone === "success"
      ? "border-success bg-success/10 text-success"
      : "border-danger bg-danger/10 text-danger";

  return (
    <div className={`flex items-center gap-3 border p-4 ${toneClass}`} role="status">
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="text-sm font-semibold">{message}</p>
    </div>
  );
}
