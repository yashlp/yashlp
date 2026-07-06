import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-lime-600";
  if (score >= 40) return "text-amber-600";
  return "text-rose-600";
}

export function scoreBg(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-lime-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

export function statusLabel(status: string, isPositive?: boolean): string {
  if (status === "under_review") return "⚖️ Under Legal Review";
  if (status === "resolution_pending") return "🟡 Resolution Pending";
  if (status === "positive_active" || (isPositive && status === "active"))
    return "🔵 Community Improvement";
  if (status === "resolved") return "🟢 Resolved";
  if (status === "disputed") return "🟡 Disputed";
  if (status === "active") return "🔴 Active Issue";
  return "⏳ Pending Verification";
}

export function visibilityStageLabel(stage?: string): string {
  if (stage === "verified") return "Verified";
  if (stage === "seed") return "Community Report (Unverified)";
  if (stage === "private") return "Pending Verification";
  return "Unknown";
}

export function confidenceLabel(score: number): string {
  if (score >= 0.8) return "High confidence";
  if (score >= 0.5) return "Moderate confidence";
  return "Low confidence";
}
