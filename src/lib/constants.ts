export const CONFIRMATION_THRESHOLD = 3;
export const RESOLUTION_CONFIRM_THRESHOLD = 2;
export const DUPLICATE_RADIUS_METERS = 50;

/** Neutral world view — app centers on user via geolocation when available */
export const DEFAULT_MAP_CENTER = { lat: 20, lng: 0 };
export const DEFAULT_MAP_ZOOM = 3;
export const USER_LOCATION_ZOOM = 14;

export const TERMS_STORAGE_KEY = "civiclens_terms_accepted";

export const INCIDENT_STATUSES = {
  PENDING: "pending",
  ACTIVE: "active",
  RESOLVED: "resolved",
  DISPUTED: "disputed",
  POSITIVE_ACTIVE: "positive_active",
} as const;

export const MAX_PHOTOS_PER_REPORT = 2;

export const VISIBILITY = {
  HIDDEN: "hidden",
  PUBLIC: "public",
} as const;

/** Sample global cities for compare demo (worldwide, not US-only) */
export const GLOBAL_SAMPLE_PLACES = [
  { name: "London, UK", lat: 51.5074, lng: -0.1278 },
  { name: "Lagos, Nigeria", lat: 6.5244, lng: 3.3792 },
  { name: "Mumbai, India", lat: 19.076, lng: 72.8777 },
  { name: "São Paulo, Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
];
