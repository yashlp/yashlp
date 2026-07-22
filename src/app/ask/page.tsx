"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Send, Sparkles } from "lucide-react";
import { DEFAULT_MAP_CENTER } from "@/lib/constants";

const SUGGESTIONS = [
  "Is this area safe?",
  "How clean is this neighborhood?",
  "Any road or infrastructure issues?",
  "What's the Community Health Score?",
  "Is this area improving or getting worse?",
];

export default function AskAIPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(DEFAULT_MAP_CENTER);
  const [locationHint, setLocationHint] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationHint("Using a default map center — enable location for local answers.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationHint(null);
      },
      () => {
        setLocationHint("Location denied — answers use a default map center until you allow GPS.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const ask = async (q: string) => {
    setQuestion(q);
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          latitude: location.lat,
          longitude: location.lng,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.replace(`/login?next=${encodeURIComponent("/ask")}`);
        return;
      }
      setAnswer(data.answer ?? data.error ?? "Could not get an answer.");
      setSources(data.sources ?? []);
    } catch {
      setAnswer("Network error. Check your connection and try again.");
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-indigo-600 text-white">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ask AI</h1>
          <p className="text-sm text-muted">
            Natural-language questions about any place, powered by community data.
          </p>
        </div>
      </div>

      {locationHint && (
        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">{locationHint}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs hover:border-orange-300 hover:bg-orange-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && question && ask(question)}
          placeholder="Ask anything about this area..."
          className="flex-1 rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-orange-500"
        />
        <button
          type="button"
          onClick={() => question && ask(question)}
          disabled={loading || !question}
          className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-white hover:bg-orange-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {(answer || loading) && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
            <Sparkles className="h-4 w-4" />
            CivicLens AI
          </div>
          {loading ? (
            <p className="mt-3 text-sm text-muted animate-pulse">Analyzing community data...</p>
          ) : (
            <>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{answer}</p>
              {sources.length > 0 && (
                <div className="mt-4 border-t border-border pt-3">
                  <p className="text-xs font-medium text-muted">Sources</p>
                  <ul className="mt-1 space-y-0.5">
                    {sources.map((s) => (
                      <li key={s} className="text-xs text-slate-500">
                        · {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
