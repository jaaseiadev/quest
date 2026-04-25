"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { STUDENT_NAV_ITEMS } from "@/types/ui";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Badge } from "@/components/ui/Badge";

export type TopbarProps = {
  displayName?: string;
  rankLabel?: string;
  isAdmin?: boolean;
};

export function Topbar({
  displayName = "Operative",
  rankLabel = "Beginner",
  isAdmin = false,
}: TopbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-dim">
      <div className="container-apex flex min-h-20 flex-col justify-center gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="font-display text-base font-bold uppercase text-foreground transition-colors hover:text-primary sm:text-lg"
          >
            Guild System
          </Link>
          <div className="flex items-center gap-2 lg:hidden">
            <Badge variant="rank">{rankLabel}</Badge>
            <LogoutButton />
          </div>
        </div>

        <nav
          aria-label="Student navigation"
          className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
        >
          {STUDENT_NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border border-transparent px-3 py-2 text-center font-display text-xs font-bold uppercase text-muted-foreground transition-colors duration-100 hover:border-border hover:text-foreground",
                  active &&
                    "border-primary bg-primary/10 text-primary-soft hover:border-primary hover:text-primary-soft",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {isAdmin ? (
            <Link
              href="/admin"
              className={cn(
                "flex items-center justify-center gap-2 border border-transparent px-3 py-2 text-center font-display text-xs font-bold uppercase text-muted-foreground transition-colors duration-100 hover:border-border hover:text-foreground",
                pathname === "/admin" || pathname.startsWith("/admin/")
                  ? "border-primary bg-primary/10 text-primary-soft hover:border-primary hover:text-primary-soft"
                  : "border-secondary/50 text-secondary hover:border-secondary hover:text-secondary",
              )}
            >
              <Shield className="h-4 w-4" aria-hidden="true" />
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Badge variant="rank">{rankLabel}</Badge>
          <div className="flex items-center gap-2 border border-border bg-surface-container px-3 py-2">
            <CircleUserRound className="h-4 w-4 text-secondary" aria-hidden="true" />
            <span className="text-label-caps text-foreground">{displayName}</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
