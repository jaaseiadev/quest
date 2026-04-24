import { Badge, DataTable } from "@/components/ui";
import type {
  DataTableColumn,
} from "@/components/ui/DataTable";
import type { LeaderboardViewEntry } from "@/components/leaderboard/types";

export type FullLeaderboardTableProps = {
  entries: LeaderboardViewEntry[];
};

const columns: DataTableColumn<LeaderboardViewEntry>[] = [
  {
    key: "rank",
    header: "Rank",
    className: "w-24",
    cell: (entry) => (
      <span className="font-display text-base font-semibold text-secondary">
        #{entry.rank_number}
      </span>
    ),
  },
  {
    key: "operative",
    header: "Operative",
    cell: (entry) => (
      <div className="flex items-center gap-3">
        <Avatar entry={entry} />
        <span className="font-semibold text-foreground">{entry.display_name}</span>
      </div>
    ),
  },
  {
    key: "party",
    header: "Party",
    cell: (entry) => (
      <span className="text-muted-foreground">{entry.party?.name ?? "Solo"}</span>
    ),
  },
  {
    key: "rank-title",
    header: "Rank",
    cell: (entry) => (
      <Badge variant={entry.rank ? "rank" : "default"}>
        {entry.rank?.name ?? "Unranked"}
      </Badge>
    ),
  },
  {
    key: "xp",
    header: "XP",
    className: "text-right",
    cell: (entry) => (
      <span className="font-display text-base font-semibold text-secondary">
        {entry.xp.toLocaleString()} XP
      </span>
    ),
  },
];

export function FullLeaderboardTable({ entries }: FullLeaderboardTableProps) {
  return (
    <section className="space-y-4" aria-labelledby="leaderboard-table-heading">
      <div className="border-b border-border pb-4">
        <p className="text-label-caps text-primary">Full Table</p>
        <h2
          id="leaderboard-table-heading"
          className="mt-2 font-display text-2xl font-semibold text-foreground"
        >
          XP Ranking Board
        </h2>
      </div>

      <DataTable
        columns={columns}
        data={entries}
        getRowKey={(entry) => entry.user_id}
        emptyMessage="No ranked operatives available."
      />
    </section>
  );
}

function Avatar({ entry }: { entry: LeaderboardViewEntry }) {
  const initials = getInitials(entry.display_name);

  return (
    <div
      className="grid h-10 w-10 shrink-0 place-items-center border border-border bg-surface-container font-display text-xs font-bold uppercase text-secondary"
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
