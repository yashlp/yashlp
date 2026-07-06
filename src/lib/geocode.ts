export type GeocodePlace = {
  name: string;
  lat: number;
  lng: number;
  countryCode?: string;
  city?: string;
  state?: string;
  postcode?: string;
  suburb?: string;
};

export function placeQueryString(place: GeocodePlace): string {
  const params = new URLSearchParams({
    lat: String(place.lat),
    lng: String(place.lng),
    place: place.name,
  });
  if (place.countryCode) params.set("country", place.countryCode);
  return params.toString();
}

export function parsePlaceFromSearchParams(params: {
  get: (key: string) => string | null;
}): GeocodePlace | null {
  const lat = parseFloat(params.get("lat") ?? "");
  const lng = parseFloat(params.get("lng") ?? "");
  const name = params.get("place");
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !name) return null;
  return {
    lat,
    lng,
    name,
    countryCode: params.get("country") ?? undefined,
  };
}
