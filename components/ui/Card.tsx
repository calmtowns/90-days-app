import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl",
          variant === "default" && "bg-white dark:bg-dark-100 shadow-warm-sm border border-beige-200/50 dark:border-white/5",
          variant === "glass" && "glass dark:glass-dark",
          variant === "elevated" && "bg-white dark:bg-dark-100 shadow-warm-lg border border-beige-100/50 dark:border-white/5",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
