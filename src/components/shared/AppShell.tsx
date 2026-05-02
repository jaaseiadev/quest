import * as React from "react";

import { Topbar } from "@/components/shared/Topbar";

export type AppShellProps = {
  children: React.ReactNode;
  displayName?: string;
  rankLabel?: string;
  isAdmin?: boolean;
};

export function AppShell({
  children,
  displayName,
  rankLabel,
  isAdmin,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar displayName={displayName} rankLabel={rankLabel} isAdmin={isAdmin} />
      <main className="container-apex py-8 md:py-12">{children}</main>
    </div>
  );
}
