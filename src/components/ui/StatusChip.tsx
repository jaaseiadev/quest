import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusChipVariants = cva(
  "clip-chamfer inline-flex items-center border px-3 py-1.5 font-display text-[11px] font-bold uppercase",
  {
    variants: {
      status: {
        pending: "border-muted bg-surface-container text-muted-foreground",
        accepted: "border-secondary bg-secondary/10 text-secondary",
        in_progress: "border-primary bg-primary/10 text-primary-soft",
        completed: "border-success bg-success/10 text-success",
        rejected: "border-danger bg-danger/10 text-danger",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  },
);

export type StatusChipProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusChipVariants>;

export function StatusChip({ className, status, ...props }: StatusChipProps) {
  return (
    <span
      className={cn(statusChipVariants({ status }), className)}
      data-status={status}
      {...props}
    />
  );
}

export { statusChipVariants };
