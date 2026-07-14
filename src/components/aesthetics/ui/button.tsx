import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 py-2.5",
  md: "min-h-11 px-6 py-3",
  lg: "min-h-12 px-8 py-4",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "aes-btn aes-touch",
        variant === "primary" && "aes-btn-primary",
        variant === "secondary" && "aes-btn-secondary",
        variant === "ghost" && "aes-btn-ghost",
        variant === "light" && "aes-btn-light",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
