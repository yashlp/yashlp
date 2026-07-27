"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";

const NOTE_TITLE = "A note from the beginning";
const NOTE_LINES = [
  "We're just getting started.",
  "If you love what you see, please share Only Aesthetics and help us grow.",
];

const SHARE_URL = "https://onlyaesthetic.in";
const SHARE_MESSAGE =
  "✨ We're just getting started. If you love what you see, please share Only Aesthetics and help us grow. 🤍";

const DETAIL_BODY = [
  SHARE_MESSAGE,
  "Only Aesthetic is still early — a small shop built around mood, makers, and objects worth living with.",
  "Thank you for being here at the start. The collection will grow — slowly, and on purpose.",
];

export function HangingNoteBoard() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  async function handleShare() {
    const shareData = {
      title: "Only Aesthetic",
      text: SHARE_MESSAGE,
      url: SHARE_URL,
    };

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // User cancelled or share failed — fall through to clipboard.
    }

    try {
      await navigator.clipboard.writeText(`${SHARE_MESSAGE}\n${SHARE_URL}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(SHARE_URL, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <>
      <div className="aes-hanging-note">
        <div className="aes-hanging-note__pendulum">
          <div className="aes-hanging-note__strings" aria-hidden>
            <span className="aes-hanging-note__string" />
            <span className="aes-hanging-note__string" />
          </div>
          <button
            type="button"
            className="aes-hanging-note__board aes-touch"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`${NOTE_TITLE}. Tap to read more.`}
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
              className="aes-hanging-note__close aes-touch"
              onClick={() => setOpen(false)}
              aria-label="Close note"
            >
              <X className="h-5 w-5" />
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
            <div className="aes-hanging-note__share">
              <a
                href={SHARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="aes-hanging-note__share-link"
              >
                {SHARE_URL.replace("https://", "")}
              </a>
              <button
                type="button"
                className="aes-hanging-note__share-btn aes-touch"
                onClick={handleShare}
              >
                {copied ? "Link copied" : "Share Only Aesthetics"}
              </button>
            </div>
            <p className="aes-hanging-note__dialog-signoff">— Only Aesthetic</p>
          </div>
        </div>
      )}
    </>
  );
}
