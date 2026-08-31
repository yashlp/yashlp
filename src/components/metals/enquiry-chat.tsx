"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { MessageCircle, Send, X } from "lucide-react";
import { useMetals } from "./metals-provider";
import type { ChatMessage } from "@/lib/metals/enquiry";
import {
  completePayment,
  createChatSession,
  initialChatMessages,
  processChatTurn,
  type ChatSession,
} from "@/lib/metals/chat-flow";
import { estimatePriceInr, parseSizeMm } from "@/lib/metals/catalog-data";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function renderText(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      )}
      {i < text.split("\n").length - 1 && <br />}
    </span>
  ));
}

function estimateLine(order: ChatSession["order"]): string {
  const est = estimatePriceInr({
    grade: order.grade || "",
    sizeMm: parseSizeMm(order.sizeMm || "0"),
    lengthMm: parseFloat(order.lengthMm || "0"),
    quantityPieces: parseFloat(order.quantityPieces || "0"),
  });
  return `Estimated total: ₹${est.toLocaleString("en-IN")} (excl. GST & freight).`;
}

export function EnquiryChat() {
  const { chatOpen, closeChat, confirmedOrder, setConfirmedOrder } = useMetals();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState<string | null>(null);
  const [demoPay, setDemoPay] = useState(false);
  const [paying, setPaying] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const orderRef = useRef(confirmedOrder);
  orderRef.current = confirmedOrder;

  const pushAgent = useCallback((text: string, quickReplies?: string[]) => {
    setMessages((m) => [
      ...m,
      { id: uid(), role: "agent", text, quickReplies, at: Date.now() },
    ]);
  }, []);

  const pushUser = useCallback((text: string) => {
    setMessages((m) => [...m, { id: uid(), role: "user", text, at: Date.now() }]);
  }, []);

  const deliverAgentReplies = useCallback(
    async (replies: { text: string; quickReplies?: string[] }[]) => {
      for (const reply of replies) {
        setTyping(true);
        await new Promise((r) => setTimeout(r, 400));
        pushAgent(reply.text, reply.quickReplies);
      }
      setTyping(false);
    },
    [pushAgent]
  );

  // Init chat only when panel opens (not when order fields update mid-chat)
  useEffect(() => {
    const opening = chatOpen && !wasOpenRef.current;
    wasOpenRef.current = chatOpen;

    if (!opening) return;

    const order = { ...orderRef.current };
    const initial = createChatSession(order);
    setSession(initial);
    setInput("");
    setBusy(false);
    setPaying(false);
    setMessages([]);

    void (async () => {
      setTyping(true);
      await new Promise((r) => setTimeout(r, 300));
      for (const reply of initialChatMessages(order)) {
        pushAgent(reply.text, reply.quickReplies);
        await new Promise((r) => setTimeout(r, 350));
      }
      setTyping(false);
    })();

    fetch("/api/metals/payment")
      .then((r) => r.json())
      .then((d) => {
        setRazorpayKey(d.keyId ?? null);
        setDemoPay(Boolean(d.demo));
      })
      .catch(() => {
        setRazorpayKey(null);
        setDemoPay(true);
      });
  }, [chatOpen, pushAgent]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const activeQuickReplyMessageId = (() => {
    if (typing || busy || paying || !session) return null;
    if (session.step === "complete" || session.step === "payment") return null;
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === "agent" && m.quickReplies?.length) return m.id;
    }
    return null;
  })();

  const handleUserMessage = useCallback(
    async (text: string) => {
      if (!session || busy || typing || paying) return;
      const trimmed = text.trim();
      if (!trimmed) return;

      setBusy(true);
      pushUser(trimmed);

      const estimate =
        session.step === "ask_email" ? estimateLine(session.order) : undefined;

      const result = processChatTurn(session, trimmed, estimate);
      setSession(result.session);
      setConfirmedOrder(result.session.order);

      if (result.agentReplies.length) {
        await deliverAgentReplies(result.agentReplies);
      }

      setBusy(false);
    },
    [session, busy, typing, paying, pushUser, deliverAgentReplies, setConfirmedOrder]
  );

  async function handlePay() {
    if (!session || paying) return;
    const o = session.order;
    if (!o.grade || !o.quantityPieces) return;

    setPaying(true);
    pushUser("Pay now");

    const amount = estimatePriceInr({
      grade: o.grade,
      sizeMm: parseSizeMm(o.sizeMm || "0"),
      lengthMm: parseFloat(o.lengthMm || "0"),
      quantityPieces: parseFloat(o.quantityPieces || "0"),
    });

    try {
      const res = await fetch("/api/metals/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInr: amount, order: o }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");

      if (data.demo) {
        const done = completePayment(session);
        setSession(done.session);
        await deliverAgentReplies(done.agentReplies);
        setPaying(false);
        return;
      }

      if (!window.Razorpay || !data.razorpayOrderId) {
        throw new Error("Razorpay not available");
      }

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay!({
          key: data.keyId,
          amount: data.amount,
          currency: "INR",
          name: "Jagetiya Metals",
          description: `${o.grade} · ${o.shape}`,
          order_id: data.razorpayOrderId,
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            await fetch("/api/metals/payment", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const done = completePayment(session);
            setSession(done.session);
            await deliverAgentReplies(done.agentReplies);
            resolve();
          },
          modal: { ondismiss: () => reject(new Error("cancelled")) },
          prefill: { name: o.name, email: o.email, contact: o.phone },
        });
        rzp.open();
      });
    } catch (err) {
      pushAgent(
        err instanceof Error && err.message === "cancelled"
          ? "Payment cancelled — tap **Pay now** when you're ready."
          : "Payment could not be completed. Try again or call us."
      );
    } finally {
      setPaying(false);
    }
  }

  if (!chatOpen || !session) return null;

  const showPay = session.step === "payment";
  const showInput =
    session.step !== "complete" &&
    session.step !== "payment" &&
    !session.awaitingField;

  return (
    <>
      {(razorpayKey || demoPay) && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      )}
      <div className="nox-chat-panel" role="dialog" aria-label="Live enquiry chat">
        <header className="nox-chat-header">
          <div>
            <p className="nox-chat-status">
              <span className="nox-chat-dot" /> Live
            </p>
            <h3 className="nox-chat-title">Order confirmation</h3>
          </div>
          <button type="button" onClick={closeChat} className="nox-icon-btn" aria-label="Close chat">
            <X size={18} />
          </button>
        </header>

        <div className="nox-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`nox-chat-bubble nox-chat-${msg.role}`}>
              <p>{renderText(msg.text)}</p>
              {msg.quickReplies &&
                msg.role === "agent" &&
                msg.id === activeQuickReplyMessageId && (
                  <div className="nox-quick-replies">
                    {msg.quickReplies.map((q) => (
                      <button
                        key={q}
                        type="button"
                        disabled={busy || typing}
                        onClick={() => {
                          if (q === "Pay now") void handlePay();
                          else void handleUserMessage(q);
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
          {typing && (
            <div className="nox-chat-bubble nox-chat-agent">
              <p className="nox-typing">Typing…</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showPay && (
          <div className="nox-chat-pay">
            <button
              type="button"
              className="nox-pay-btn"
              onClick={() => void handlePay()}
              disabled={paying || busy}
            >
              {paying ? "Processing…" : demoPay && !razorpayKey ? "Pay now (demo)" : "Pay with Razorpay"}
            </button>
          </div>
        )}

        {showInput && (
          <form
            className="nox-chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              void handleUserMessage(input);
              setInput("");
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                session.awaitingField
                  ? "Type your answer…"
                  : session.step.startsWith("confirm_")
                    ? "Or type here…"
                    : "Type your reply…"
              }
              disabled={busy || typing}
              aria-label="Chat message"
            />
            <button type="submit" disabled={busy || typing} aria-label="Send">
              <Send size={18} />
            </button>
          </form>
        )}

        {session.awaitingField && !typing && (
          <form
            className="nox-chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              void handleUserMessage(input);
              setInput("");
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter ${session.awaitingField === "quantityPieces" ? "quantity" : session.awaitingField}…`}
              disabled={busy || typing}
              aria-label="Chat message"
              autoFocus
            />
            <button type="submit" disabled={busy || typing} aria-label="Send">
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export function ChatLauncher() {
  const { chatOpen, openChat } = useMetals();
  if (chatOpen) return null;
  return (
    <button type="button" className="nox-chat-fab" onClick={openChat} aria-label="Open live chat">
      <MessageCircle size={22} />
    </button>
  );
}
