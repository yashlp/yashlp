export const SEED_CONFIRMATION_THRESHOLD = 3;
export const VERIFIED_CONFIRMATION_THRESHOLD = 10;
export const DISPUTE_REOPEN_THRESHOLD = 2;
export const RESOLUTION_CONFIRM_THRESHOLD = 2;
export const DUPLICATE_RADIUS_METERS = 50;
export const DAILY_CATEGORY_TTL_DAYS = 30;

/** @deprecated use SEED_CONFIRMATION_THRESHOLD */
export const CONFIRMATION_THRESHOLD = SEED_CONFIRMATION_THRESHOLD;

export const DEFAULT_MAP_CENTER = { lat: 20, lng: 0 };
export const DEFAULT_MAP_ZOOM = 3;
export const USER_LOCATION_ZOOM = 14;
export const STREET_LEVEL_ZOOM = 12;

export const TERMS_STORAGE_KEY = "civiclens_terms_accepted";

export const INCIDENT_STATUSES = {
  PENDING: "pending",
  ACTIVE: "active",
  RESOLVED: "resolved",
  DISPUTED: "disputed",
  POSITIVE_ACTIVE: "positive_active",
  RESOLUTION_PENDING: "resolution_pending",
} as const;

export const VISIBILITY_STAGE = {
  PRIVATE: "private",
  SEED: "seed",
  VERIFIED: "verified",
} as const;

export const VISIBILITY = {
  HIDDEN: "hidden",
  SEED: "seed",
  PUBLIC: "public",
} as const;

export const MAX_PHOTOS_PER_REPORT = 2;

export const POPULAR_CATEGORY_SLUGS = [
  "potholes-bad-roads",
  "broken-footpath-sidewalk",
  "broken-public-toilet",
  "garbage-pile-up",
  "no-shade-heat-hazard",
  "trusted-street-food-spot",
  "long-queue-government-office",
  "clean-public-toilet",
];

export const GLOBAL_SAMPLE_PLACES = [
  { name: "London, UK", lat: 51.5074, lng: -0.1278 },
  { name: "Lagos, Nigeria", lat: 6.5244, lng: 3.3792 },
  { name: "Mumbai, India", lat: 19.076, lng: 72.8777 },
  { name: "São Paulo, Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
  { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
];
