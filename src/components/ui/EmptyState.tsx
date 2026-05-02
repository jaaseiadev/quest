import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border border-dashed border-border bg-surface-container-low p-6 text-center md:p-8",
        className,
      )}
      {...props}
    >
      <p className="font-display text-lg font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actionLabel && onAction ? (
        <Button className="mt-6" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
