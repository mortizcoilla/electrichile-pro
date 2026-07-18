import * as React from "react";
import { cn } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, suffix, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-[10px] border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40",
            icon && "pl-10",
            suffix && "pr-12",
            className
          )}
          ref={ref}
          {...props}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
