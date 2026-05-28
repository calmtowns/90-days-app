import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-semibold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variant === "primary" && "bg-brown-500 text-white shadow-warm-sm hover:bg-brown-600",
          variant === "secondary" && "bg-beige-100 dark:bg-dark-100 text-brown-600 dark:text-beige-200 border border-beige-200 dark:border-dark-50",
          variant === "ghost" && "text-brown-500 dark:text-beige-300 hover:bg-beige-100 dark:hover:bg-dark-100",
          variant === "danger" && "bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-800",
          size === "sm" && "text-sm px-4 py-2",
          size === "md" && "text-base px-6 py-3",
          size === "lg" && "text-lg px-8 py-4",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
