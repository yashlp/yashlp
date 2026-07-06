"use client";

import { useEffect, useState } from "react";
import { GitCompare, Globe } from "lucide-react";
import { cn, scoreBg, scoreColor } from "@/lib/utils";
import { GLOBAL_SAMPLE_PLACES } from "@/lib/constants";

type HealthData = {
  overallScore: number;
  confidence: number;
  incidentCount: number;
  categoryScores: Record<string, number>;
};

export default function ComparePage() {
  const [placeA, setPlaceA] = useState(GLOBAL_SAMPLE_PLACES[0]);
  const [placeB, setPlaceB] = useState(GLOBAL_SAMPLE_PLACES[1]);
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
    place: (typeof GLOBAL_SAMPLE_PLACES)[0];
    health: HealthData | null;
    onChange: (p: (typeof GLOBAL_SAMPLE_PLACES)[0]) => void;
  }) => (
    <div className="flex-1 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm shadow-orange-50">
      <select
        value={place.name}
        onChange={(e) => {
          const p = GLOBAL_SAMPLE_PLACES.find((x) => x.name === e.target.value) ?? GLOBAL_SAMPLE_PLACES[0];
          onChange(p);
        }}
        className="w-full rounded-xl border border-orange-200 px-3 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-orange-400"
      >
        {GLOBAL_SAMPLE_PLACES.map((p) => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>

      {health ? (
        <div className="mt-4">
          <p className={cn("text-5xl font-bold", scoreColor(health.overallScore))}>
            {health.overallScore}
          </p>
          <p className="text-sm text-stone-400">Community Health Score</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-orange-100">
            <div className={cn("h-full rounded-full", scoreBg(health.overallScore))} style={{ width: `${health.overallScore}%` }} />
          </div>
          <p className="mt-3 text-xs text-stone-400">
            {health.incidentCount} verified · {Math.round(health.confidence * 100)}% confidence
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-stone-400">Loading...</p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-stone-900">
        <GitCompare className="h-6 w-6 text-orange-600" />
        Compare Places
      </h1>
      <p className="mt-1 flex items-center gap-1 text-stone-500">
        <Globe className="h-4 w-4" />
        Compare cities worldwide with evidence-backed health scores.
      </p>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-stretch">
        <PlaceCard place={placeA} health={healthA} onChange={setPlaceA} />
        <div className="flex items-center justify-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">VS</span>
        </div>
        <PlaceCard place={placeB} health={healthB} onChange={setPlaceB} />
      </div>

      {winner && healthA && healthB && (
        <div className="mt-6 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-white p-6 text-center">
          <p className="text-lg font-semibold text-stone-800">
            {winner === "Tie"
              ? "Both areas have similar health scores"
              : `${winner} scores higher overall`}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            Difference: {Math.abs(healthA.overallScore - healthB.overallScore)} points
          </p>
        </div>
      )}
    </div>
  );
}
