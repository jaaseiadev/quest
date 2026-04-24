import * as React from "react";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

export type AuthTerminalProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function AuthTerminal({
  children,
  eyebrow,
  title,
  description,
  className,
}: AuthTerminalProps) {
  return (
    <section
      className={cn(
        "w-full border border-border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="border-b border-border bg-surface-container-low px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-label-caps text-primary-soft">{eyebrow}</span>
          <ShieldCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
        </div>
      </div>
      <div className="space-y-6 p-6">
        <div className="space-y-3">
          <h1 className="font-display text-2xl font-bold uppercase text-foreground">
            {title}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
