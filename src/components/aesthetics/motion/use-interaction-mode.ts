"use client";

import { useEffect, useState } from "react";

export type InteractionMode = {
  /** Pointer can hover — enable desktop hover motion */
  canHover: boolean;
  /** User prefers reduced motion */
  reducedMotion: boolean;
  /** Enable hover choreography (fine pointer + not reduced) */
  enableHoverMotion: boolean;
};

/**
 * Cross-platform interaction flags.
 * Hover UI/motion only when (hover: hover) and (pointer: fine).
 */
export function useInteractionMode(): InteractionMode {
  const [mode, setMode] = useState<InteractionMode>({
    canHover: false,
    reducedMotion: false,
    enableHoverMotion: false,
  });

  useEffect(() => {
    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      const hover = hoverMq.matches;
      const reduced = motionMq.matches;
      setMode({
        canHover: hover,
        reducedMotion: reduced,
        enableHoverMotion: hover && !reduced,
      });
    };

    sync();
    hoverMq.addEventListener("change", sync);
    motionMq.addEventListener("change", sync);
    return () => {
      hoverMq.removeEventListener("change", sync);
      motionMq.removeEventListener("change", sync);
    };
  }, []);

  return mode;
}

/** Back-compat for existing call sites */
export function useAesReducedMotion() {
  return useInteractionMode().reducedMotion;
}
