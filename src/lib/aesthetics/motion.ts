/**
 * Only Aesthetics — Signature Motion System
 * Calm, gallery-like presets. Prefer 200–500ms. No playful bounce.
 */

export const AES_EASE = [0.22, 1, 0.36, 1] as const;
export const AES_EASE_SOFT = [0.33, 1, 0.68, 1] as const;

export const AES_DURATION = {
  fast: 0.22,
  base: 0.35,
  slow: 0.48,
  morning: 1.5,
} as const;

/** Luxury accent for wishlist ribbon */
export const AES_LUXURY = "#B58E4A";

export const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: AES_DURATION.slow, ease: AES_EASE },
  },
};

export const fadeUpReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export const editorialReveal = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: AES_DURATION.slow, ease: AES_EASE_SOFT },
  },
};

export const editorialStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const cardHover = {
  rest: { y: 0, boxShadow: "0 2px 12px rgba(26, 26, 26, 0.06)" },
  hover: {
    y: -4,
    boxShadow: "0 10px 28px rgba(26, 26, 26, 0.08)",
    transition: { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.7 },
  },
};

export const productLift = {
  rest: { scale: 1, filter: "brightness(1)" },
  hover: {
    scale: 1.03,
    filter: "brightness(1.06)",
    transition: { duration: AES_DURATION.slow, ease: AES_EASE },
  },
};

export const quickAddReveal = {
  rest: { opacity: 0, y: 6 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: AES_DURATION.base, ease: AES_EASE },
  },
};

export const notificationSlide = {
  initial: { opacity: 0, y: -12, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: AES_DURATION.base, ease: AES_EASE },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: AES_DURATION.fast, ease: AES_EASE },
  },
};

export const bookmarkRibbon = {
  initial: { opacity: 0, scale: 0.85, y: -4 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: AES_DURATION.base, ease: AES_EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: AES_DURATION.fast },
  },
};

export const bagPulse = {
  rest: { scale: 1 },
  pulse: {
    scale: [1, 1.12, 1],
    transition: { duration: 0.42, ease: AES_EASE },
  },
};

export const footerReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: AES_DURATION.slow, ease: AES_EASE },
  },
};

export type Season = "spring" | "summer" | "autumn" | "winter";

/** Hemisphere-aware season for India / northern latitudes */
export function getCurrentSeason(date = new Date()): Season {
  const m = date.getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hapticLight(): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(12);
    } catch {
      // ignore
    }
  }
}
