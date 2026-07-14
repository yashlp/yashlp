"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAesReducedMotion } from "./use-reduced-motion";

/**
 * Thin editorial loading line — replaces generic spinners on route changes.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduced = useAesReducedMotion();
  const [active, setActive] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
    if (reduced) return;
    setActive(true);
    const done = window.setTimeout(() => setActive(false), 520);
    return () => window.clearTimeout(done);
  }, [pathname, searchParams, reduced]);

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[480]" aria-hidden>
      <AnimatePresence>
        {active && (
          <motion.div
            key={key}
            className="h-[2px] origin-left bg-[var(--aes-pink)]"
            style={{ boxShadow: "0 0 8px rgba(255,42,95,0.25)" }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
