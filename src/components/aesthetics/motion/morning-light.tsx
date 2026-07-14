"use client";

import { motion } from "framer-motion";
import { useAesReducedMotion } from "./use-reduced-motion";
import { AES_DURATION } from "@/lib/aesthetics/motion";

/**
 * Soft morning sunlight sweep — Collections hero only, once on enter.
 */
export function MorningLight({ className = "" }: { className?: string }) {
  const reduced = useAesReducedMotion();
  if (reduced) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <motion.div
        className="absolute inset-y-[-10%] w-[42%]"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, rgba(255,252,245,0.14) 42%, rgba(255,248,230,0.22) 50%, rgba(255,252,245,0.12) 58%, transparent 100%)",
          mixBlendMode: "soft-light",
        }}
        initial={{ x: "-45%", opacity: 0 }}
        animate={{ x: "160%", opacity: [0, 1, 1, 0] }}
        transition={{
          duration: AES_DURATION.morning,
          ease: [0.45, 0.05, 0.55, 0.95],
          times: [0, 0.15, 0.75, 1],
        }}
      />
    </div>
  );
}
