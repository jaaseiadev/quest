import { Activity, CheckCircle2, Shield, Trophy } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { Card } from "@/components/ui";
import type { DashboardStats } from "@/components/dashboard/types";

type StatCard = {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  prestige?: boolean;
};

export type StatsGridProps = {
  stats: DashboardStats;
};

export function StatsGrid({ stats }: StatsGridProps) {
  const cards: StatCard[] = [
    {
      label: "Total XP",
      value: `${stats.totalXp} XP`,
      detail: "Lifetime cleared quest reward",
      icon: Trophy,
      prestige: true,
    },
    {
      label: "Current Rank",
      value: stats.currentRank.name,
      detail: stats.nextRank ? `Next: ${stats.nextRank.name}` : "Top rank reached",
      icon: Shield,
      prestige: true,
    },
    {
      label: "Active Applications",
      value: String(stats.activeApplications),
      detail: "Pending, accepted, or in progress",
      icon: Activity,
    },
    {
      label: "Completed Quests",
      value: String(stats.completedQuests),
      detail: "XP-awarded completions",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.label} variant={card.prestige ? "prestige" : "default"}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4">
                <p className="text-label-caps text-muted-foreground">{card.label}</p>
                <p className="font-display text-3xl font-bold text-foreground">
                  {card.value}
                </p>
                <p className="text-sm text-muted-foreground">{card.detail}</p>
              </div>
              <Icon
                className={card.prestige ? "h-5 w-5 text-secondary" : "h-5 w-5 text-primary"}
                aria-hidden="true"
              />
            </div>
          </Card>
        );
      })}
    </section>
  );
}
