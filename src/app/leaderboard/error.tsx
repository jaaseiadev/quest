"use client";

import { AlertTriangle } from "lucide-react";

import { AppShell } from "@/components/shared";
import { PageHeader } from "@/components/ui";

export default function LeaderboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          label="Global Leaderboard"
          title="Ranking Feed Interrupted"
          description="The leaderboard shell loaded, but the ranking view hit an error."
        />
        <div
          className="flex items-start justify-between gap-4 border border-danger bg-danger/10 p-5 text-danger"
          role="alert"
        >
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-display text-sm font-semibold uppercase">
                Leaderboard unavailable
              </p>
              <p className="mt-2 text-sm leading-6">
                {error.message || "Ranking data could not be displayed."}
              </p>
            </div>
          </div>
          <button
            className="border border-danger px-4 py-2 font-display text-xs font-bold uppercase text-danger transition-colors hover:bg-danger hover:text-background"
            onClick={reset}
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    </AppShell>
  );
}
