import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#222222] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#0A82DF] text-white border border-[#0A82DF] rounded-[10px] hover:bg-[#0B6AB2] hover:border-[#0B6AB2] active:bg-[#06528A] active:border-[#06528A] text-sm",
        secondary:
          "bg-[#222222] text-white border border-[#222222] rounded-[10px] hover:bg-[#333333] active:bg-[#111111] text-sm",
        outline:
          "bg-[#FAFAFA] text-[#222222] border border-[#EBEBEB] rounded-[10px] font-medium shadow-elevation-03 hover:bg-[#F0F0F0] hover:shadow-elevation-02 transition-all text-sm",
        ghost:
          "text-[#717171] hover:text-[#222222] hover:bg-[#F7F7F7] rounded-[10px] font-medium text-sm",
        destructive:
          "bg-[#D32F2F] text-white border border-[#D32F2F] rounded-[10px] hover:bg-[#B71C1C] text-sm",
        link:
          "text-[#0A82DF] underline-offset-4 hover:underline font-medium text-sm",
      },
      size: {
        default: "h-[46px] px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-[52px] px-8 text-base",
        icon: "h-[46px] w-[46px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
