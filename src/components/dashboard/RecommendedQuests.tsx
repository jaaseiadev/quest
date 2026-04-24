import Link from "next/link";
import { MapPin, Trophy } from "lucide-react";

import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { DashboardQuest } from "@/components/dashboard/types";

export type RecommendedQuestsProps = {
  quests: DashboardQuest[];
};

export function RecommendedQuests({ quests }: RecommendedQuestsProps) {
  if (quests.length === 0) {
    return (
      <EmptyState
        title="No recommended quests online"
        description="Open operations that match your current progression will appear here."
      />
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {quests.map((quest) => (
        <Card key={quest.id} variant="interactive" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {quest.category ? <Badge variant="quest">{quest.category}</Badge> : null}
            {quest.recommendedRank ? (
              <Badge variant="rank">{quest.recommendedRank.name}</Badge>
            ) : null}
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl font-semibold text-foreground">
              {quest.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {quest.company ?? "Guild Posting"}
            </p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              {quest.location ?? "Location flexible"}
            </span>
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-secondary" aria-hidden="true" />
              <span className="font-display font-bold text-secondary">
                {quest.rewardXp} XP
              </span>
              <span>/ {quest.slots} slots</span>
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
            <span className="text-label-caps text-muted-foreground">
              {formatDate(quest.deadline)}
            </span>
            <Button asChild variant="secondary" size="sm">
              <Link href="/questboard">View Intel</Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
