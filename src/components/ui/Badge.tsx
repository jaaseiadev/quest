import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "clip-chamfer inline-flex items-center border px-3 py-2 font-display text-xs font-bold uppercase",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-container text-muted-foreground",
        rank: "border-secondary bg-surface-container text-secondary",
        quest: "border-primary bg-primary/10 text-primary-soft",
        success: "border-success bg-success/10 text-success",
        warning: "border-warning bg-warning/10 text-warning",
        danger: "border-danger bg-danger/10 text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
