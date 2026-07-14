"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "oa_about_lamp_played";

type Phase = "idle" | "swing" | "on";

export function AboutLampHeading({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const played = sessionStorage.getItem(SESSION_KEY) === "1";

    if (reduced || played) {
      setPhase("on");
      return;
    }

    const swingTimer = window.setTimeout(() => setPhase("swing"), 280);
    const onTimer = window.setTimeout(() => {
      setPhase("on");
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 1700);

    return () => {
      window.clearTimeout(swingTimer);
      window.clearTimeout(onTimer);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="aes-lamp-stage">
        <h1 className="aes-gallery-title aes-lamp-heading text-center">{children}</h1>
      </div>
    );
  }

  return (
    <div className="aes-lamp-stage">
      <div
        className={
          phase === "idle"
            ? "aes-lamp-fixture is-idle"
            : phase === "swing"
              ? "aes-lamp-fixture is-swing"
              : "aes-lamp-fixture is-on"
        }
        aria-hidden
      >
        <div className="aes-lamp-cord" />
        <div className="aes-lamp-shade" />
        <div className="aes-lamp-bulb" />
      </div>

      <div className={phase === "on" ? "aes-lamp-spotlight is-on" : "aes-lamp-spotlight"} aria-hidden />

      <h1 className={`aes-gallery-title aes-lamp-heading text-center ${phase === "on" ? "is-lit" : ""}`}>
        {children}
      </h1>
    </div>
  );
}
