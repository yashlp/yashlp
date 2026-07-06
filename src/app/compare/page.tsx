"use client";

import { useEffect, useState } from "react";
import { GitCompare } from "lucide-react";
import { cn, scoreBg, scoreColor } from "@/lib/utils";

type HealthData = {
  overallScore: number;
  confidence: number;
  incidentCount: number;
  categoryScores: Record<string, number>;
};

const PLACES = [
  { name: "Downtown", lat: 40.7128, lng: -74.006 },
  { name: "Midtown", lat: 40.7549, lng: -73.984 },
  { name: "Brooklyn Heights", lat: 40.696, lng: -73.993 },
];

export default function ComparePage() {
  const [placeA, setPlaceA] = useState(PLACES[0]);
  const [placeB, setPlaceB] = useState(PLACES[1]);
  const [healthA, setHealthA] = useState<HealthData | null>(null);
  const [healthB, setHealthB] = useState<HealthData | null>(null);

  useEffect(() => {
    fetch(`/api/health?lat=${placeA.lat}&lng=${placeA.lng}`)
      .then((r) => r.json())
      .then(setHealthA);
  }, [placeA]);

  useEffect(() => {
    fetch(`/api/health?lat=${placeB.lat}&lng=${placeB.lng}`)
      .then((r) => r.json())
      .then(setHealthB);
  }, [placeB]);

  const winner =
    healthA && healthB
      ? healthA.overallScore > healthB.overallScore
        ? placeA.name
        : healthB.overallScore > healthA.overallScore
          ? placeB.name
          : "Tie"
      : null;

  const PlaceCard = ({
    place,
    health,
    onChange,
  }: {
    place: (typeof PLACES)[0];
    health: HealthData | null;
    onChange: (p: (typeof PLACES)[0]) => void;
  }) => (
    <div className="flex-1 rounded-2xl border border-border bg-white p-6">
      <select
        value={place.name}
        onChange={(e) => {
          const p = PLACES.find((x) => x.name === e.target.value) ?? PLACES[0];
          onChange(p);
        }}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium"
      >
        {PLACES.map((p) => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>

      {health ? (
        <div className="mt-4">
          <p className={cn("text-5xl font-bold", scoreColor(health.overallScore))}>
            {health.overallScore}
          </p>
          <p className="text-sm text-muted">Community Health Score</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className={cn("h-full rounded-full", scoreBg(health.overallScore))} style={{ width: `${health.overallScore}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted">
            {health.incidentCount} verified incidents · {Math.round(health.confidence * 100)}% confidence
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Loading...</p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-24">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <GitCompare className="h-6 w-6 text-teal-600" />
        Compare Places
      </h1>
      <p className="mt-1 text-muted">
        Side-by-side Community Health Scores to help you decide where to live, work, or visit.
      </p>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-stretch">
        <PlaceCard place={placeA} health={healthA} onChange={setPlaceA} />
        <div className="flex items-center justify-center">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-muted">VS</span>
        </div>
        <PlaceCard place={placeB} health={healthB} onChange={setPlaceB} />
      </div>

      {winner && healthA && healthB && (
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 p-6 text-center">
          <p className="text-lg font-semibold">
            {winner === "Tie"
              ? "Both areas have similar health scores"
              : `${winner} scores higher overall`}
          </p>
          <p className="mt-1 text-sm text-muted">
            Difference: {Math.abs(healthA.overallScore - healthB.overallScore)} points
          </p>
        </div>
      )}
    </div>
  );
}
