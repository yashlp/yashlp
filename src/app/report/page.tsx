"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Camera, CheckCircle, MapPin, X } from "lucide-react";
import { DEFAULT_MAP_CENTER, MAX_PHOTOS_PER_REPORT } from "@/lib/constants";
import { photoRuleLabel } from "@/lib/categories";

type Category = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  type: string;
  group: string;
  photoRequired: boolean;
  photoRule: string;
  description: string;
};

export default function ReportPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [signalType, setSignalType] = useState<"issue" | "positive">("issue");
  const [selected, setSelected] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [location, setLocation] = useState(DEFAULT_MAP_CENTER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetch(`/api/categories?type=${signalType}`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories));
  }, [signalType]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Category[]>();
    for (const cat of categories) {
      const list = map.get(cat.group) ?? [];
      list.push(cat);
      map.set(cat.group, list);
    }
    return map;
  }, [categories]);

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_PHOTOS_PER_REPORT - photos.length;
    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setPhotos((prev) =>
            prev.length < MAX_PHOTOS_PER_REPORT
              ? [...prev, reader.result as string]
              : prev
          );
        };
        reader.readAsDataURL(file);
      });
  };

  const submit = async (attachToExisting?: string) => {
    if (!selected) return;

    if (selected.photoRule === "required" && photos.length === 0) {
      setError("Photo evidence is required for this category.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: selected.id,
        title: title || `${selected.emoji} ${selected.name}`,
        description,
        latitude: location.lat,
        longitude: location.lng,
        photoUrls: photos,
        attachToExisting,
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-28">
      <h1 className="text-2xl font-bold text-stone-900">Report to your community</h1>
      <p className="mt-1 text-stone-500">
        Share an issue or positive signal. CivicLens merges nearby duplicates into one pin.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => { setSignalType("issue"); setSelected(null); setPhotos([]); }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            signalType === "issue"
              ? "bg-rose-100 text-rose-700 ring-2 ring-rose-200"
              : "bg-white text-stone-500 ring-1 ring-orange-100"
          }`}
        >
          <AlertTriangle className="h-4 w-4" /> Civic Issue
        </button>
        <button
          onClick={() => { setSignalType("positive"); setSelected(null); setPhotos([]); }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
            signalType === "positive"
              ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
              : "bg-white text-stone-500 ring-1 ring-orange-100"
          }`}
        >
          <CheckCircle className="h-4 w-4" /> Positive Signal
        </button>
      </div>

      {!selected ? (
        <div className="mt-6 space-y-6">
          {Array.from(grouped.entries()).map(([group, cats]) => (
            <div key={group}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                {group}
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {cats.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelected(cat)}
                    className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white p-3 text-left transition hover:border-orange-300 hover:shadow-md hover:shadow-orange-50"
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-800">{cat.name}</p>
                      <p className="text-xs text-stone-400">
                        {photoRuleLabel(cat.photoRule as "required" | "optional" | "allowed")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <span className="text-3xl">{selected.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-stone-900">{selected.name}</p>
              <p className="text-xs text-orange-600">{selected.group}</p>
              <p className="mt-0.5 text-sm text-stone-500">{selected.description}</p>
            </div>
            <button
              onClick={() => { setSelected(null); setPhotos([]); }}
              className="text-sm font-medium text-orange-600"
            >
              Change
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`${selected.name} nearby`}
              className="input-field mt-1 w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700">Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What did you observe?"
              className="input-field mt-1 w-full resize-none"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-stone-700">
                Photos{" "}
                <span className="text-stone-400">
                  ({photos.length}/{MAX_PHOTOS_PER_REPORT})
                </span>
              </label>
              <span
                className={`text-xs font-medium ${
                  selected.photoRule === "required" ? "text-rose-600" : "text-stone-400"
                }`}
              >
                {photoRuleLabel(selected.photoRule as "required" | "optional" | "allowed")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative h-20 w-20 overflow-hidden rounded-xl border border-orange-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p} alt="" className="h-full w-full object-cover" />
                  <button
                    onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS_PER_REPORT && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center rounded-xl border-2 border-dashed border-orange-200 text-orange-500 hover:bg-orange-50"
                >
                  <Camera className="h-5 w-5" />
                  <span className="mt-1 text-[10px]">Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePhotos(e.target.files)}
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2.5 text-sm text-stone-600">
            <MapPin className="h-4 w-4 shrink-0 text-orange-600" />
            GPS: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </div>

          {duplicate && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900">Similar pin found nearby</p>
              <p className="mt-1 text-sm text-amber-800">
                &quot;{duplicate.title}&quot; — confirm the existing pin instead of creating a duplicate?
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => submit(duplicate.id)}
                  className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Confirm Existing Pin
                </button>
                <button
                  onClick={() => { setDuplicate(null); submit(); }}
                  className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm"
                >
                  Create New Anyway
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          )}

          {!duplicate && (
            <button
              disabled={loading}
              onClick={() => submit()}
              className="w-full rounded-2xl bg-orange-600 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
