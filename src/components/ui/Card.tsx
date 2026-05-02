import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva("min-w-0 border p-5 text-card-foreground md:p-6", {
  variants: {
    variant: {
      default: "border-border bg-card",
      interactive:
        "border-border bg-card transition-colors duration-100 hover:border-secondary hover:bg-surface-container-high focus-within:border-secondary",
      danger: "border-danger bg-surface-dim text-danger",
      prestige: "border-secondary bg-surface-container text-card-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type CardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />;
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-6 space-y-2", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "break-words font-display text-xl font-semibold leading-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export { cardVariants };
