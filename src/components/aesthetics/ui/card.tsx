import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ className, hover = true, padding = "md", children, ...props }: CardProps) {
  return (
    <div
      className={cn("aes-card", hover && "hover:-translate-y-0.5", paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}
