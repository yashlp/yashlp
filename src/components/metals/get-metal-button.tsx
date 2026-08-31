"use client";

import { ArrowRight } from "lucide-react";
import { useMetals } from "./metals-provider";

type GetMetalButtonProps = {
  label?: string;
  size?: "default" | "large";
  className?: string;
  prefill?: {
    grade?: string;
    shape?: string;
  };
};

export function GetMetalButton({
  label = "Get Metal",
  size = "default",
  className = "",
  prefill,
}: GetMetalButtonProps) {
  const { openGetMetal } = useMetals();
  const large = size === "large";

  return (
    <button
      type="button"
      onClick={() => openGetMetal(prefill)}
      className={`nox-get-metal group ${large ? "nox-get-metal-lg" : ""} ${className}`}
    >
      <span className="nox-get-metal-label">{label}</span>
      <span className="nox-get-metal-icon" aria-hidden>
        <ArrowRight size={large ? 22 : 16} strokeWidth={2.5} />
      </span>
    </button>
  );
}
