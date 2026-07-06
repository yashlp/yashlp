"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, MapPin } from "lucide-react";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";

type Category = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  type: string;
  photoRequired: boolean;
  description: string;
};

export default function ReportPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [signalType, setSignalType] = useState<"issue" | "positive">("issue");
  const [selected, setSelected] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

  const submit = async (attachToExisting?: string) => {
    if (!selected) return;
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
    <div className="mx-auto max-w-2xl px-4 py-8 pb-24">
      <h1 className="text-2xl font-bold">Report to your community</h1>
      <p className="mt-1 text-muted">
        Share an issue or positive signal. PlacePulse checks for nearby duplicates automatically.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => { setSignalType("issue"); setSelected(null); }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
            signalType === "issue" ? "bg-rose-100 text-rose-700" : "bg-slate-100"
          }`}
        >
          <AlertTriangle className="h-4 w-4" /> Issue
        </button>
        <button
          onClick={() => { setSignalType("positive"); setSelected(null); }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
            signalType === "positive" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100"
          }`}
        >
          <CheckCircle className="h-4 w-4" /> Positive Signal
        </button>
      </div>

      {!selected ? (
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat)}
              className="rounded-xl border border-border bg-white p-3 text-left transition hover:border-teal-300 hover:shadow-sm"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <p className="mt-1 text-sm font-medium">{cat.name}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-teal-50 p-4">
            <span className="text-3xl">{selected.emoji}</span>
            <div>
              <p className="font-semibold">{selected.name}</p>
              <p className="text-sm text-muted">{selected.description}</p>
            </div>
            <button onClick={() => setSelected(null)} className="ml-auto text-sm text-teal-600">
              Change
            </button>
          </div>

          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`${selected.name} nearby`}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Details (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What did you observe?"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-muted">
            <MapPin className="h-4 w-4 text-teal-600" />
            GPS: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </div>

          {duplicate && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-medium text-amber-900">Similar incident found nearby</p>
              <p className="mt-1 text-sm text-amber-800">
                &quot;{duplicate.title}&quot; — confirm the existing pin instead of creating a duplicate?
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => submit(duplicate.id)}
                  className="rounded-lg bg-teal-600 px-3 py-2 text-sm text-white"
                >
                  Confirm Existing
                </button>
                <button
                  onClick={() => { setDuplicate(null); submit(); }}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  Create New Anyway
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-rose-600">{error}</p>}

          {!duplicate && (
            <button
              disabled={loading}
              onClick={() => submit()}
              className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
