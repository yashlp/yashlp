"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ReelFeed } from "@/components/aesthetic-demo/reel-feed";

export default function AestheticDemoPage() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="aesthetic-demo-root relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
        <div
          className="aesthetic-blob pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #7eb8da 0%, transparent 65%)" }}
        />
        <div
          className="aesthetic-blob-delay pointer-events-none absolute -right-20 bottom-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #1b3a6b 0%, transparent 65%)" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-md text-center">
          <p className="aesthetic-mono mb-2 text-[11px] uppercase tracking-[0.35em] text-[#4a7cbb]">
            interactive demo
          </p>
          <h1 className="text-5xl font-semibold italic leading-[1.05] tracking-tight text-[#0a1628] sm:text-6xl">
            Curio
          </h1>
          <p className="mt-1 text-2xl font-light italic text-[#1b3a6b]/70">reel shop</p>

          <p className="mx-auto mt-6 max-w-xs text-lg leading-relaxed text-[#1b3a6b]/80">
            Scroll aesthetic products like reels. Swipe right to cart, left to pass. The feed learns
            what you love.
          </p>

          <div className="mx-auto mt-8 grid max-w-xs grid-cols-3 gap-3 text-left">
            {[
              { label: "Scroll", hint: "↕ next product" },
              { label: "Swipe →", hint: "add to cart" },
              { label: "Swipe ←", hint: "pass & learn" },
            ].map(({ label, hint }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#1b3a6b]/8 bg-[#fffef7]/80 p-3 backdrop-blur-sm"
              >
                <p className="aesthetic-mono text-[10px] uppercase tracking-wider text-[#4a7cbb]">
                  {label}
                </p>
                <p className="mt-1 text-sm italic text-[#0a1628]/70">{hint}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStarted(true)}
            className="group mx-auto mt-10 flex items-center gap-3 rounded-full bg-[#1b3a6b] px-8 py-4 text-[#fffef7] shadow-xl shadow-[#1b3a6b]/25 transition hover:bg-[#0a1628] active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5" />
            <span className="aesthetic-mono text-xs uppercase tracking-[0.25em]">Enter demo</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>

          <p className="aesthetic-mono mt-6 text-[10px] uppercase tracking-wider text-[#4a7cbb]/50">
            blue · ivory · algorithmic taste
          </p>
        </div>

        {/* Phone frame hint on larger screens */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
          <p className="aesthetic-mono text-[10px] uppercase tracking-wider text-[#1b3a6b]/30">
            best on mobile — resize browser or open on phone
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="aesthetic-demo-root mx-auto h-dvh w-full max-w-lg border-x border-[#1b3a6b]/5 shadow-2xl md:my-4 md:h-[calc(100dvh-2rem)] md:rounded-[2.5rem] md:overflow-hidden">
      <ReelFeed />
    </div>
  );
}
