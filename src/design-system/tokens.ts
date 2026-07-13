/**
 * Aesthetics Design System — Design Tokens
 * Premium curated marketplace · Royal Blue + Warm Ivory
 */

export const colors = {
  royalBlue: {
    50: "#EEF4FC",
    100: "#D6E6F8",
    200: "#A8C9EE",
    300: "#7AACE4",
    400: "#4C8FDA",
    500: "#1B4F9C",
    600: "#164080",
    700: "#113164",
    800: "#0C2248",
    900: "#07132C",
  },
  dustyBlue: {
    50: "#F4F7FA",
    100: "#E8EDF4",
    200: "#D1DBE9",
    300: "#A8BDD4",
    400: "#7F9FBF",
    500: "#5A7FA3",
  },
  ivory: {
    50: "#FFFEF9",
    100: "#FDF9F3",
    200: "#F8F2E8",
    300: "#F0E8DC",
    400: "#E5DAC8",
  },
  charcoal: {
    50: "#F5F5F5",
    100: "#E5E5E5",
    200: "#CCCCCC",
    300: "#999999",
    400: "#666666",
    500: "#333333",
    600: "#2A2A2A",
    700: "#1F1F1F",
    800: "#141414",
    900: "#0A0A0A",
  },
  white: "#FFFFFF",
  success: "#2D6A4F",
  warning: "#B8860B",
  error: "#9B2335",
} as const;

export const typography = {
  fontFamily: {
    display: '"Cormorant Garamond", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"DM Mono", ui-monospace, monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeight: {
    tight: "1.15",
    snug: "1.35",
    normal: "1.5",
    relaxed: "1.625",
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.05em",
    wider: "0.1em",
    widest: "0.2em",
  },
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const radius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(10, 10, 10, 0.04)",
  md: "0 4px 16px rgba(10, 10, 10, 0.06)",
  lg: "0 8px 32px rgba(10, 10, 10, 0.08)",
  xl: "0 16px 48px rgba(10, 10, 10, 0.1)",
  card: "0 0 0 1px rgba(27, 79, 156, 0.04), 0 4px 24px rgba(10, 10, 10, 0.05)",
  cardHover: "0 0 0 1px rgba(27, 79, 156, 0.08), 0 12px 40px rgba(10, 10, 10, 0.1)",
  lift: "0 20px 60px rgba(27, 79, 156, 0.12)",
} as const;

export const motion = {
  duration: {
    fast: "150ms",
    normal: "250ms",
    slow: "400ms",
    slower: "600ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const;
