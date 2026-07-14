"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check, ShoppingBag } from "lucide-react";
import { notificationSlide } from "@/lib/aesthetics/motion";

export type NoticeKind = "bag" | "wishlist" | "order" | "info";

export type Notice = {
  id: string;
  message: string;
  kind?: NoticeKind;
};

type NoticeContextValue = {
  pushNotice: (message: string, kind?: NoticeKind) => void;
};

const NoticeContext = createContext<NoticeContextValue | null>(null);

const ICONS: Record<NoticeKind, typeof Check> = {
  bag: ShoppingBag,
  wishlist: Bookmark,
  order: Check,
  info: Check,
};

function PaperStack({
  notices,
  onDismiss,
}: {
  notices: Notice[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-[420] flex w-[min(100%,20rem)] flex-col gap-2 sm:right-6">
      <AnimatePresence mode="popLayout">
        {notices.map((n) => {
          const Icon = ICONS[n.kind ?? "info"];
          return (
            <motion.div
              key={n.id}
              layout
              variants={notificationSlide}
              initial="initial"
              animate="animate"
              exit="exit"
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[var(--aes-border)] bg-[var(--aes-notice-bg,#fffaf2)] px-4 py-3 shadow-[0_8px_28px_rgba(26,26,26,0.08)]"
              role="status"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(181,142,74,0.12)] text-[var(--aes-luxury,#B58E4A)]">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
              <p className="flex-1 pt-1 text-sm leading-snug text-[var(--aes-ink)]">{n.message}</p>
              <button
                type="button"
                onClick={() => onDismiss(n.id)}
                className="mt-0.5 text-xs text-[var(--aes-ink-soft)] hover:text-[var(--aes-ink)]"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function NoticeProvider({ children }: { children: React.ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const pushNotice = useCallback(
    (message: string, kind: NoticeKind = "info") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setNotices((prev) => [...prev.slice(-2), { id, message, kind }]);
      window.setTimeout(() => dismiss(id), 2800);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ pushNotice }), [pushNotice]);

  return (
    <NoticeContext.Provider value={value}>
      {children}
      <PaperStack notices={notices} onDismiss={dismiss} />
    </NoticeContext.Provider>
  );
}

export function useNotice() {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error("useNotice must be used within NoticeProvider");
  return ctx;
}

/** Safe hook when provider may be absent (e.g. tests) */
export function useNoticeOptional() {
  return useContext(NoticeContext);
}
