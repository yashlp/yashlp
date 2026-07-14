"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { hapticLight, prefersReducedMotion } from "@/lib/aesthetics/motion";

type FlyPayload = {
  id: string;
  image: string;
  from: { x: number; y: number };
};

type FlyContextValue = {
  flyToBag: (image: string, fromEl?: HTMLElement | null) => void;
  pulseBag: number;
};

const FlyContext = createContext<FlyContextValue | null>(null);

function getBagCenter(): { x: number; y: number } {
  const el = document.querySelector<HTMLElement>("[data-aes-bag-target]");
  if (!el) {
    return { x: window.innerWidth - 36, y: 28 };
  }
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export function AddToBagProvider({ children }: { children: React.ReactNode }) {
  const [flies, setFlies] = useState<FlyPayload[]>([]);
  const [pulseBag, setPulseBag] = useState(0);

  const flyToBag = useCallback((image: string, fromEl?: HTMLElement | null) => {
    if (prefersReducedMotion()) {
      setPulseBag((n) => n + 1);
      hapticLight();
      return;
    }

    const rect = fromEl?.getBoundingClientRect();
    const from = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setFlies((f) => [...f, { id, image, from }]);
    hapticLight();

    window.setTimeout(() => {
      setPulseBag((n) => n + 1);
      setFlies((f) => f.filter((x) => x.id !== id));
    }, 480);
  }, []);

  return (
    <FlyContext.Provider value={{ flyToBag, pulseBag }}>
      {children}
      <AnimatePresence>
        {flies.map((f) => {
          const to = getBagCenter();
          return (
            <motion.div
              key={f.id}
              className="pointer-events-none fixed z-[450] h-14 w-14 overflow-hidden rounded-xl border border-white/40 shadow-lg will-change-transform"
              style={{ left: f.from.x - 28, top: f.from.y - 28 }}
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: [1, 1, 0.2],
                scale: [1, 0.55, 0.2],
                x: to.x - f.from.x,
                y: to.y - f.from.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.image} alt="" className="h-full w-full object-cover" draggable={false} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </FlyContext.Provider>
  );
}

export function useAddToBagFly() {
  const ctx = useContext(FlyContext);
  if (!ctx) {
    return {
      flyToBag: () => undefined,
      pulseBag: 0,
    };
  }
  return ctx;
}
