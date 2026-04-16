import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline:
          "text-foreground",
        muted:
          "border-transparent bg-muted text-muted-foreground",
        success:
          "border-transparent bg-checkin-green text-white",
        mono:
          "bg-muted text-muted-foreground rounded-md text-[11px] font-mono px-1.5 py-0.5 border-border/50",
      },
      size: {
        default: "rounded-full px-2.5 py-0.5 text-xs",
        sm: "rounded-full px-2 py-0.5 text-[10px]",
        lg: "rounded-full px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Badge = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
