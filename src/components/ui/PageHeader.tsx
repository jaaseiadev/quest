import * as React from "react";

import { cn } from "@/lib/utils";

export type PageHeaderProps = React.HTMLAttributes<HTMLElement> & {
  label: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function PageHeader({
  label,
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 flex min-w-0 flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 max-w-3xl space-y-3">
        <p className="text-label-caps text-primary">{label}</p>
        <h1 className="break-words text-headline-xl text-foreground">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full flex-wrap gap-3 sm:w-auto">{actions}</div>
      ) : null}
    </header>
  );
}
