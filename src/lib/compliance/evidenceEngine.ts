export type EvidenceInput = {
  hasPhoto: boolean;
  photoCount: number;
  latitude: number;
  longitude: number;
  pinLatitude: number;
  pinLongitude: number;
  categorySlug: string;
};

export type EvidenceResult = {
  gpsMatch: boolean;
  gpsDistanceMeters: number;
  photoPresent: boolean;
  evidenceScore: number;
  flags: string[];
};

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function assessEvidence(input: EvidenceInput): EvidenceResult {
  const flags: string[] = [];
  const distance = haversineM(
    input.latitude,
    input.longitude,
    input.pinLatitude,
    input.pinLongitude
  );

  const gpsMatch = distance <= 500;
  if (!gpsMatch) flags.push("gps_mismatch");
  if (distance > 2000) flags.push("gps_far");

  const photoPresent = input.hasPhoto && input.photoCount > 0;
  if (!photoPresent && ["potholes-bad-roads", "unhygienic-restaurant"].includes(input.categorySlug)) {
    flags.push("missing_photo_evidence");
  }

  let score = 0.5;
  if (gpsMatch) score += 0.25;
  if (photoPresent) score += 0.2;
  if (input.photoCount >= 2) score += 0.05;
  score = Math.min(1, Math.round(score * 100) / 100);

  return {
    gpsMatch,
    gpsDistanceMeters: Math.round(distance),
    photoPresent,
    evidenceScore: score,
    flags,
  };
}
