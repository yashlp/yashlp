"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Camera, CheckCircle, X, Zap } from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { DEFAULT_MAP_CENTER, MAX_PHOTOS_PER_REPORT, POPULAR_CATEGORY_SLUGS, POPULAR_POSITIVE_CATEGORY_SLUGS } from "@/lib/constants";
import { photoRuleLabel } from "@/lib/categories";
import { INSTITUTION_LABELS } from "@/lib/compliance";
import { CORRUPTION_DISCLAIMER } from "@/lib/compliance/types";
import { compressImageFile } from "@/lib/image-compress";
import { PlaceSearch } from "@/components/place-search";
import type { GeocodePlace } from "@/lib/geocode";

const LocationPicker = dynamic(
  () => import("@/components/map-picker").then((m) => m.LocationPicker),
  { ssr: false, loading: () => <div className="h-56 animate-pulse rounded-2xl bg-orange-50 sm:h-64" /> }
);

type Category = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  type: string;
  group: string;
  photoRule: string;
  description: string;
};

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [signalType, setSignalType] = useState<"issue" | "positive">("issue");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Category | null>(null);
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pinLocation, setPinLocation] = useState(DEFAULT_MAP_CENTER);
  const [selectedPlace, setSelectedPlace] = useState<GeocodePlace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState<{ id: string; title: string } | null>(null);
  const [institutionType, setInstitutionType] = useState("");
  const [servicePoint, setServicePoint] = useState("");
  const [corruptionIssueType, setCorruptionIssueType] = useState("");

  const isCorruptionReport = selected?.slug === "corruption-bribery";

  useEffect(() => {
    fetch(`/api/categories?type=${signalType}`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories));
    if (!searchParams.get("category")) {
      setSelected(null);
      setSearch("");
    }
  }, [signalType, searchParams]);

  useEffect(() => {
    const type = searchParams.get("type");
    const categorySlug = searchParams.get("category");
    if (type === "positive" || type === "issue") {
      setSignalType(type);
    }
    if (!categorySlug) return;

    fetch(`/api/categories?type=${type === "issue" ? "issue" : "positive"}`)
      .then((r) => r.json())
      .then((d: { categories: Category[] }) => {
        const match = d.categories.find((c) => c.slug === categorySlug);
        if (match) setSelected(match);
      });
  }, [searchParams]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setPinLocation(loc);
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        c.slug.includes(q)
    );
  }, [categories, search]);

  const popular = useMemo(() => {
    const slugs =
      signalType === "positive" ? POPULAR_POSITIVE_CATEGORY_SLUGS : POPULAR_CATEGORY_SLUGS;
    return categories.filter((c) => slugs.includes(c.slug));
  }, [categories, signalType]);

  const grouped = useMemo(() => {
    const map = new Map<string, Category[]>();
    for (const cat of filtered) {
      const list = map.get(cat.group) ?? [];
      list.push(cat);
      map.set(cat.group, list);
    }
    return map;
  }, [filtered]);

  const handlePhotos = async (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_PHOTOS_PER_REPORT - photos.length;
    const selected = Array.from(files).slice(0, remaining);

    for (const file of selected) {
      try {
        const compressed = await compressImageFile(file);
        setPhotos((prev) =>
          prev.length < MAX_PHOTOS_PER_REPORT ? [...prev, compressed] : prev
        );
      } catch {
        setError("Could not process one of the images. Try a different file.");
      }
    }
  };

  const useMyLocation = () => {
    if (userLocation) setPinLocation(userLocation);
    else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setPinLocation(loc);
      });
    }
  };

  const submit = async (attachToExisting?: string) => {
    if (!selected) return;
    if (selected.photoRule === "required" && photos.length === 0) {
      setError("Please add a photo for this report type.");
      return;
    }

    if (isCorruptionReport && !institutionType) {
      setError("Select the institution or service location. Corruption reports must be location-based only.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: selected.id,
        description: description || undefined,
        latitude: pinLocation.lat,
        longitude: pinLocation.lng,
        address: selectedPlace?.name,
        photoUrls: photos,
        attachToExisting,
        institutionType: institutionType || undefined,
        servicePoint: servicePoint || undefined,
        corruptionIssueType: corruptionIssueType || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to submit");
      return;
    }

    if (data.duplicate) {
      setDuplicate({ id: data.incident.id, title: data.incident.title });
      return;
    }

    router.push("/");
  };

  const pickCategory = (cat: Category) => {
    setSelected(cat);
    setDuplicate(null);
    setError("");
    setInstitutionType("");
    setServicePoint("");
    setCorruptionIssueType("");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <h1 className="text-2xl font-bold text-stone-900">Quick Report</h1>
      <p className="mt-1 text-sm text-stone-500">Search, snap a photo, pin location — done in seconds.</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setSignalType("issue")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold ${
            signalType === "issue"
              ? "bg-rose-100 text-rose-700 ring-2 ring-rose-200"
              : "bg-white text-stone-500 ring-1 ring-orange-100"
          }`}
        >
          <AlertTriangle className="h-4 w-4" /> Issue
        </button>
        <button
          onClick={() => setSignalType("positive")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold ${
            signalType === "positive"
              ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
              : "bg-white text-stone-500 ring-1 ring-orange-100"
          }`}
        >
          <CheckCircle className="h-4 w-4" /> Something good
        </button>
      </div>

      {!selected ? (
        <div className="mt-4 space-y-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search report type… pothole, garbage, lights"
            autoFocus
          />

          {!search && popular.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-orange-600">
                <Zap className="h-3.5 w-3.5" /> Popular
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {popular.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => pickCategory(cat)}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-orange-50"
                  >
                    <span>{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {Array.from(grouped.entries()).map(([group, cats]) => (
              <div key={group}>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-400">
                  {group}
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {cats.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => pickCategory(cat)}
                      className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-3 text-left active:scale-[0.99] hover:border-orange-300"
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-stone-800">{cat.name}</p>
                        <p className="text-xs text-stone-400">
                          {photoRuleLabel(cat.photoRule as "required" | "optional" | "allowed")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-stone-400">No report types match your search.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4">
            <span className="text-3xl">{selected.emoji}</span>
            <div className="flex-1">
              <p className="font-bold text-stone-900">{selected.name}</p>
              <p className="text-xs text-orange-600">{selected.group}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-sm font-medium text-orange-600">
              Change
            </button>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-stone-700">Photos</label>
              <span className="text-xs text-stone-400">
                {photoRuleLabel(selected.photoRule as "required" | "optional" | "allowed")}
              </span>
            </div>
            <div className="flex gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-orange-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute right-1 top-1 flex min-h-10 min-w-10 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS_PER_REPORT && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50/50 text-orange-600 active:bg-orange-100"
                >
                  <Camera className="h-7 w-7" />
                  <span className="mt-1 text-xs font-medium">Add photo</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handlePhotos(e.target.files)}
            />
          </div>

          {isCorruptionReport && (
            <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
              <p className="text-xs font-semibold text-amber-900">Location-based reporting only</p>
              <p className="text-xs text-amber-800">
                Do not name individuals, officials, or badge numbers. Report the institution or service
                point only.
              </p>
              <div>
                <label className="text-sm font-medium text-stone-700">Institution type *</label>
                <select
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value)}
                  className="input-field mt-1 w-full"
                >
                  <option value="">Select institution…</option>
                  {Object.entries(INSTITUTION_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Service point <span className="font-normal text-stone-400">(e.g. licensing desk)</span>
                </label>
                <input
                  value={servicePoint}
                  onChange={(e) => setServicePoint(e.target.value)}
                  placeholder="Counter area, department, or zone"
                  className="input-field mt-1 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Issue type</label>
                <select
                  value={corruptionIssueType}
                  onChange={(e) => setCorruptionIssueType(e.target.value)}
                  className="input-field mt-1 w-full"
                >
                  <option value="">Auto-detect from details</option>
                  <option value="bribery_allegation">Bribery allegation</option>
                  <option value="service_delay">Delay in service</option>
                  <option value="misconduct_pattern">Misconduct pattern</option>
                  <option value="irregular_practices">Irregular practices</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-stone-700">
              Details{" "}
              <span className="font-normal text-stone-400">
                {isCorruptionReport ? "(describe the service experience)" : "(optional)"}
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder={
                isCorruptionReport
                  ? "e.g. Unusual fee requested at the licensing counter"
                  : "Anything else we should know?"
              }
              className="input-field mt-1 w-full resize-none"
            />
            {isCorruptionReport && (
              <p className="mt-1 text-xs text-stone-400">{CORRUPTION_DISCLAIMER}</p>
            )}
          </div>

          <PlaceSearch
            selectedPlace={selectedPlace}
            onSelect={(place) => {
              setSelectedPlace(place);
              setPinLocation({ lat: place.lat, lng: place.lng });
            }}
            onClear={() => setSelectedPlace(null)}
            label="Search location"
            hint="Pick country first, then city, area, state, or pincode / postal code"
            className="mb-4"
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-stone-700">Fine-tune on map</label>
              <button
                type="button"
                onClick={useMyLocation}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Use my location
              </button>
            </div>
            <LocationPicker
              userLocation={userLocation}
              pinLocation={pinLocation}
              onPinChange={(lat, lng) => {
                setPinLocation({ lat, lng });
                setSelectedPlace(null);
              }}
            />
          </div>

          {duplicate && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">Already reported nearby</p>
              <p className="mt-1 text-sm text-amber-800">Confirm the existing pin instead?</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => submit(duplicate.id)}
                  className="flex-1 rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white"
                >
                  Yes, confirm it
                </button>
                <button
                  onClick={() => { setDuplicate(null); submit(); }}
                  className="rounded-xl border px-4 py-2.5 text-sm"
                >
                  New pin
                </button>
              </div>
            </div>
          )}

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          {!duplicate && (
            <button
              disabled={loading}
              onClick={() => submit()}
              className="w-full rounded-2xl bg-orange-600 py-4 text-lg font-bold text-white shadow-lg shadow-orange-200 hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Submit report"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
