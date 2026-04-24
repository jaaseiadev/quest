"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  ClipboardList,
  KeyRound,
  LayoutDashboard,
  Shield,
} from "lucide-react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: ReactNode;
  displayName?: string | null;
};

const ADMIN_NAV = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Jobs",
    href: "/admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: ClipboardList,
  },
  {
    label: "Invite",
    href: "/admin/invite",
    icon: KeyRound,
  },
] as const;

export function AdminShell({ children, displayName }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-surface-dim">
        <div className="container-apex flex min-h-20 flex-col justify-center gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="border border-primary bg-primary/10 p-2 text-primary-soft">
              <Shield className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <Link
                href="/admin"
                className="font-display text-lg font-bold uppercase text-foreground transition-colors hover:text-primary"
              >
                Admin Command
              </Link>
              <p className="mt-1 text-label-caps text-muted-foreground">
                Server verified control surface
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="danger">Admin</Badge>
            <div className="border border-border bg-surface-container px-3 py-2">
              <p className="text-label-caps text-foreground">
                {displayName?.trim() || "Commander"}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="border border-border px-3 py-2 font-display text-xs font-bold uppercase text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
            >
              Student View
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="container-apex grid gap-8 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border border-border bg-card p-3 lg:sticky lg:top-8 lg:h-fit">
          <nav aria-label="Admin navigation" className="grid gap-2">
            {ADMIN_NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 border border-transparent px-3 py-3 font-display text-xs font-bold uppercase text-muted-foreground transition-colors",
                    "hover:border-border hover:bg-surface-container hover:text-foreground",
                    active &&
                      "border-primary bg-primary/10 text-primary-soft hover:border-primary hover:text-primary-soft",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
