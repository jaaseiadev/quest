import { Medal, Trophy } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { LeaderboardViewEntry } from "@/components/leaderboard/types";

export type TopRankersSectionProps = {
  entries: LeaderboardViewEntry[];
};

const podiumOrder = [2, 1, 3];

export function TopRankersSection({ entries }: TopRankersSectionProps) {
  const topEntries = podiumOrder
    .map((rankNumber) =>
      entries.find((entry) => entry.rank_number === rankNumber),
    )
    .filter((entry): entry is LeaderboardViewEntry => Boolean(entry));

  if (topEntries.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4" aria-labelledby="top-rankers-heading">
      <div className="border-b border-border pb-4">
        <p className="text-label-caps text-primary">Top 3 Section</p>
        <h2
          id="top-rankers-heading"
          className="mt-2 font-display text-2xl font-semibold text-foreground"
        >
          Current Vanguard
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:items-end">
        {topEntries.map((entry) => (
          <TopRankerCard key={entry.user_id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

function TopRankerCard({ entry }: { entry: LeaderboardViewEntry }) {
  const isFirst = entry.rank_number === 1;
  const Icon = isFirst ? Trophy : Medal;

  return (
    <Card
      variant={isFirst ? "prestige" : "default"}
      className={cn(
        "relative overflow-hidden",
        isFirst
          ? "border-secondary bg-surface-container-high p-7 lg:min-h-80"
          : "bg-surface-container-low lg:min-h-72",
      )}
    >
      <div className="absolute right-4 top-4 font-display text-6xl font-bold text-muted/20">
        #{entry.rank_number}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div className="flex items-start justify-between gap-4">
          <Avatar entry={entry} size={isFirst ? "lg" : "md"} />
          <Badge variant={isFirst ? "rank" : "default"}>
            {isFirst ? "Lead Operative" : "Elite Cell"}
          </Badge>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-label-caps text-muted-foreground">
              Rank #{entry.rank_number}
            </p>
            <h3
              className={cn(
                "mt-3 font-display font-semibold text-foreground",
                isFirst ? "text-3xl" : "text-2xl",
              )}
            >
              {entry.display_name}
            </h3>
          </div>

          <div className="grid gap-3 border-y border-border py-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <Metric label="XP" value={entry.xp.toLocaleString()} prestige />
            <Metric label="Rank" value={entry.rank?.name ?? "Unranked"} />
            <Metric label="Party" value={entry.party?.name ?? "Solo"} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon
            className={cn("h-4 w-4", isFirst ? "text-secondary" : "text-muted")}
            aria-hidden="true"
          />
          <span>{isFirst ? "Highest confirmed XP total" : "Podium confirmed"}</span>
        </div>
      </div>
    </Card>
  );
}

function Avatar({
  entry,
  size,
}: {
  entry: LeaderboardViewEntry;
  size: "md" | "lg";
}) {
  const initials = getInitials(entry.display_name);
  const dimensionClass = size === "lg" ? "h-20 w-20 text-2xl" : "h-16 w-16 text-xl";

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center border border-secondary bg-surface-dim font-display font-bold uppercase text-secondary",
        dimensionClass,
      )}
      style={
        entry.avatar_url
          ? {
              backgroundImage: `url(${entry.avatar_url})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : undefined
      }
      aria-label={`${entry.display_name} avatar`}
    >
      {entry.avatar_url ? <span className="sr-only">{initials}</span> : initials}
    </div>
  );
}

function Metric({
  label,
  value,
  prestige = false,
}: {
  label: string;
  value: string;
  prestige?: boolean;
}) {
  return (
    <div>
      <p className="text-label-caps text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 truncate text-sm font-semibold text-foreground",
          prestige && "font-display text-lg text-secondary",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function getInitials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "OP";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
