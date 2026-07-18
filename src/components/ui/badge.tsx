import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-accent-primary/20 text-accent-primary",
        secondary: "bg-elevated text-muted",
        success: "bg-accent-success/20 text-accent-success",
        warning: "bg-accent-warning/20 text-accent-warning",
        danger: "bg-accent-danger/20 text-accent-danger",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
