"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";

const NOTE_TITLE = "A note from the beginning";
const NOTE_LINES = ["We're just getting started.", "Every piece is currently available by pre-order."];

const DETAIL_BODY = [
  "Only Aesthetics is still early — a small shop built around mood, makers, and objects worth living with.",
  "Right now, every piece you see can be reserved by pre-order. That lets us make (or source) with care instead of rushing stock onto shelves that don't deserve it.",
  "When you pre-order, you're holding a place in the next batch. We'll confirm timelines at checkout and keep you updated as your order moves from studio to doorstep.",
  "Thank you for being here at the start. The collection will grow — slowly, and on purpose.",
];

export function HangingNoteBoard() {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="aes-hanging-note pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end px-3 sm:px-6 md:px-10">
        <div className="pointer-events-auto aes-hanging-note__pendulum">
          <div className="aes-hanging-note__strings" aria-hidden>
            <span className="aes-hanging-note__string" />
            <span className="aes-hanging-note__string" />
          </div>
          <button
            type="button"
            className="aes-hanging-note__board"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <p className="aes-hanging-note__eyebrow">{NOTE_TITLE}</p>
            <p className="aes-hanging-note__line">{NOTE_LINES[0]}</p>
            <p className="aes-hanging-note__line aes-hanging-note__line--muted">{NOTE_LINES[1]}</p>
            <span className="aes-hanging-note__hint">Tap to read more</span>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="aes-hanging-note__overlay"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="aes-hanging-note__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="aes-hanging-note__close"
              onClick={() => setOpen(false)}
              aria-label="Close note"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="aes-hanging-note__dialog-eyebrow">From the studio</p>
            <h2 id={titleId} className="aes-hanging-note__dialog-title">
              {NOTE_TITLE}
            </h2>
            <div className="aes-hanging-note__dialog-body">
              {DETAIL_BODY.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <p className="aes-hanging-note__dialog-signoff">— Only Aesthetics</p>
          </div>
        </div>
      )}
    </>
  );
}
