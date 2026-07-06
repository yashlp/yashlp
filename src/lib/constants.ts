export const CONFIRMATION_THRESHOLD = 3;
export const RESOLUTION_CONFIRM_THRESHOLD = 2;
export const DUPLICATE_RADIUS_METERS = 50;
export const DEFAULT_MAP_CENTER = { lat: 40.7128, lng: -74.006 };
export const DEFAULT_MAP_ZOOM = 13;

export const INCIDENT_STATUSES = {
  PENDING: "pending",
  ACTIVE: "active",
  RESOLVED: "resolved",
  DISPUTED: "disputed",
} as const;

export const VISIBILITY = {
  HIDDEN: "hidden",
  PUBLIC: "public",
} as const;
