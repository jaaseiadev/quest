"use client";

import { LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type {
  PartyMembershipState,
  PartyUserRank,
  PartyViewItem,
} from "@/components/party-management/types";

export type PartyCardProps = {
  party: PartyViewItem;
  currentRank: PartyUserRank;
  membershipState: PartyMembershipState;
  isJoining?: boolean;
  onJoin: () => void;
};

export function PartyCard({
  party,
  currentRank,
  membershipState,
  isJoining = false,
  onJoin,
}: PartyCardProps) {
  const minRank = party.min_rank;
  const locked = membershipState === "locked";
  const joined = membershipState === "joined";
  const leaderName = party.leader?.display_name?.trim() || "Unassigned";
  const memberPreview = (party.members ?? [])
    .slice(0, 3)
    .map((member) => member.user?.display_name?.trim())
    .filter((name): name is string => Boolean(name));

  return (
    <Card
      variant="interactive"
      className={locked ? "border-border bg-surface-container-low opacity-80" : ""}
    >
      <CardHeader className="mb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <Badge variant={locked ? "default" : "quest"}>
              {party.category || "General"}
            </Badge>
            <CardTitle>{party.name}</CardTitle>
          </div>
          <Badge variant={locked ? "danger" : "rank"}>
            {minRank ? `Min ${minRank.name}` : "Open Rank"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="min-h-12 break-words text-sm leading-6 text-muted-foreground">
          {party.description ||
            "No party brief has been filed yet. Members can still assemble here for future quests."}
        </p>

        <div className="grid gap-3 border-y border-border py-4 sm:grid-cols-2">
          <PartyMetric label="Leader" value={leaderName} />
          <PartyMetric label="Members" value={party.member_count.toString()} />
          <PartyMetric
            label="Requirement"
            value={minRank ? `${minRank.name} / ${minRank.min_xp} XP` : "No minimum"}
          />
          <PartyMetric label="Your Rank" value={currentRank.name} />
        </div>

        {memberPreview.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <UsersRound className="h-4 w-4 text-secondary" aria-hidden="true" />
            <span>{memberPreview.join(", ")}</span>
            {party.member_count > memberPreview.length ? (
              <span>+{party.member_count - memberPreview.length} more</span>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UsersRound className="h-4 w-4 text-secondary" aria-hidden="true" />
            <span>No roster preview available.</span>
          </div>
        )}

        {locked ? (
          <LockedNotice requiredRank={minRank?.name ?? "higher"} />
        ) : null}

        <Button
          className="w-full"
          variant={joined ? "secondary" : locked ? "danger" : "primary"}
          disabled={joined || locked || isJoining}
          onClick={onJoin}
        >
          {joined ? (
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          ) : locked ? (
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          ) : null}
          {joined ? "Joined" : locked ? "Locked: Rank Too Low" : isJoining ? "Joining" : "Join Party"}
        </Button>
      </CardContent>
    </Card>
  );
}

function PartyMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-label-caps text-muted-foreground">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function LockedNotice({ requiredRank }: { requiredRank: string }) {
  return (
    <div className="border border-danger bg-danger/10 p-3 text-sm leading-6 text-danger">
      This party requires {requiredRank} rank or higher before entry can be cleared.
    </div>
  );
}

