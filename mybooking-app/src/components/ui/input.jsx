import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[46px] w-full rounded-[10px] border border-[#EBEBEB] bg-white px-4 py-3 text-base text-[#222222] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:border-[#0A82DF] focus-visible:ring-2 focus-visible:ring-[#0A82DF]/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
