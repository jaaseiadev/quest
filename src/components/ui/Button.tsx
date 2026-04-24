import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 border-2 font-display text-xs font-bold uppercase transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-on-primary hover:bg-transparent hover:text-primary",
        secondary:
          "border-border-strong bg-transparent text-foreground hover:border-secondary hover:text-secondary",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-surface-container hover:text-foreground",
        danger:
          "border-danger bg-transparent text-danger hover:bg-danger hover:text-background",
        gold:
          "border-secondary bg-secondary text-on-secondary hover:bg-transparent hover:text-secondary",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-12 px-6",
        lg: "h-14 px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
