"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { getCurrentSeason, type Season } from "@/lib/aesthetics/motion";
import { useAesReducedMotion } from "./use-reduced-motion";

type Props = {
  season?: Season;
  className?: string;
};

/**
 * Minimal seasonal décor — plays once, never blocks content.
 */
export function SeasonalAccent({ season, className = "" }: Props) {
  const reduced = useAesReducedMotion();
  const active = season ?? getCurrentSeason();
  const seeds = useMemo(() => [0.18, 0.62], []);

  if (reduced) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {active === "autumn" &&
        seeds.map((left, i) => (
          <motion.span
            key={`leaf-${i}`}
            className="absolute top-0 block h-3 w-2 rounded-[40%_60%_55%_45%] bg-[rgba(181,142,74,0.45)]"
            style={{ left: `${left * 100}%`, rotate: i === 0 ? -18 : 12 }}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: ["0%", "70%", "110%"], x: [0, i === 0 ? 18 : -14, i === 0 ? 8 : -6], opacity: [0, 0.7, 0] }}
            transition={{ duration: 3.2 + i * 0.4, ease: "easeInOut", delay: 0.3 + i * 0.5 }}
          />
        ))}

      {active === "spring" &&
        seeds.map((left, i) => (
          <motion.span
            key={`petal-${i}`}
            className="absolute top-2 h-2 w-2 rounded-full bg-[rgba(255,182,193,0.55)]"
            style={{ left: `${left * 100}%` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, 90, 160], x: [0, i ? -20 : 16, i ? -8 : 10], opacity: [0, 0.65, 0], rotate: [0, 40, 80] }}
            transition={{ duration: 2.8 + i * 0.35, ease: "easeOut", delay: 0.4 + i * 0.45 }}
          />
        ))}

      {active === "winter" &&
        seeds.map((left, i) => (
          <motion.span
            key={`snow-${i}`}
            className="absolute top-0 h-1.5 w-1.5 rounded-full bg-white/70"
            style={{ left: `${(left + 0.08) * 100}%` }}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: ["0%", "85%"], opacity: [0, 0.55, 0] }}
            transition={{ duration: 3.4 + i * 0.3, ease: "linear", delay: 0.2 + i * 0.55 }}
          />
        ))}

      {active === "summer" && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 30% at 20% 15%, rgba(255,236,190,0.18), transparent 70%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0] }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
