import * as React from "react";

import { Topbar } from "@/components/shared/Topbar";

export type AppShellProps = {
  children: React.ReactNode;
  displayName?: string;
  rankLabel?: string;
};

export function AppShell({ children, displayName, rankLabel }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar displayName={displayName} rankLabel={rankLabel} />
      <main className="container-apex py-10 md:py-12">{children}</main>
    </div>
  );
}
