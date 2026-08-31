"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { MessageCircle, Send, X } from "lucide-react";
import { useMetals } from "./metals-provider";
import {
  type ChatMessage,
  type ChatStep,
  type ConfirmedOrder,
  fieldForChangeReply,
  nextStep,
  stepPrompt,
} from "@/lib/metals/enquiry";
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

export function EnquiryChat() {
  const { chatOpen, closeChat, confirmedOrder, setConfirmedOrder } = useMetals();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<ChatStep>("welcome");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [awaitingField, setAwaitingField] = useState<keyof ConfirmedOrder | null>(null);
  const [razorpayKey, setRazorpayKey] = useState<string | null>(null);
  const [demoPay, setDemoPay] = useState(false);
  const [paying, setPaying] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<Partial<ConfirmedOrder>>({});

  useEffect(() => {
    orderRef.current = { ...confirmedOrder };
  }, [confirmedOrder]);

  const pushAgent = useCallback((text: string, quickReplies?: string[]) => {
    setMessages((m) => [
      ...m,
      { id: uid(), role: "agent", text, quickReplies, at: Date.now() },
    ]);
  }, []);

  const pushUser = useCallback((text: string) => {
    setMessages((m) => [...m, { id: uid(), role: "user", text, at: Date.now() }]);
  }, []);

  const runAgentStep = useCallback(
    async (s: ChatStep) => {
      setTyping(true);
      await new Promise((r) => setTimeout(r, 500));
      const { text, quickReplies } = stepPrompt(s, orderRef.current);
      pushAgent(text, quickReplies);
      setTyping(false);
      setStep(s);
    },
    [pushAgent]
  );

  useEffect(() => {
    if (!chatOpen) return;
    setMessages([]);
    setStep("welcome");
    setAwaitingField(null);
    orderRef.current = { ...confirmedOrder };
    void (async () => {
      await runAgentStep("welcome");
      await runAgentStep("confirm_grade");
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
  }, [chatOpen, confirmedOrder, runAgentStep]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleUserMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      pushUser(trimmed);

      if (awaitingField) {
        const patch = { [awaitingField]: trimmed };
        orderRef.current = { ...orderRef.current, ...patch };
        setConfirmedOrder(patch);
        setAwaitingField(null);
        const fieldStep = `confirm_${awaitingField.replace("Mm", "").replace("Kg", "")}` as ChatStep;
        const confirmStep: ChatStep =
          awaitingField === "sizeMm"
            ? "confirm_size"
            : awaitingField === "lengthMm"
              ? "confirm_length"
              : awaitingField === "quantityKg"
                ? "confirm_quantity"
                : awaitingField === "grade"
                  ? "confirm_grade"
                  : awaitingField === "shape"
                    ? "confirm_shape"
                    : fieldStep;
        await runAgentStep(confirmStep);
        return;
      }

      const changeField = fieldForChangeReply(trimmed);
      if (changeField && trimmed.toLowerCase().includes("change")) {
        setAwaitingField(changeField);
        const labels: Record<string, string> = {
          grade: "grade",
          shape: "shape",
          sizeMm: "size in mm",
          lengthMm: "length in mm",
          quantityKg: "quantity in kg",
        };
        pushAgent(`What ${labels[changeField]} do you need?`);
        return;
      }

      if (step === "ask_name") {
        orderRef.current = { ...orderRef.current, name: trimmed };
        setConfirmedOrder({ name: trimmed });
        await runAgentStep("ask_phone");
        return;
      }
      if (step === "ask_phone") {
        orderRef.current = { ...orderRef.current, phone: trimmed };
        setConfirmedOrder({ phone: trimmed });
        await runAgentStep("ask_email");
        return;
      }
      if (step === "ask_email") {
        orderRef.current = { ...orderRef.current, email: trimmed };
        setConfirmedOrder({ email: trimmed });
        const o = orderRef.current;
        const est = estimatePriceInr({
          grade: o.grade || "",
          sizeMm: parseSizeMm(o.sizeMm || "0"),
          lengthMm: parseFloat(o.lengthMm || "0"),
          quantityKg: parseFloat(o.quantityKg || "0"),
        });
        await runAgentStep("summary");
        pushAgent(`Estimated total: ₹${est.toLocaleString("en-IN")} (excl. GST & freight).`);
        return;
      }

      const following = nextStep(step, trimmed);
      if (following === "payment" && step === "summary") {
        await runAgentStep("payment");
        return;
      }
      if (following !== step) {
        await runAgentStep(following);
      }
    },
    [awaitingField, pushAgent, pushUser, runAgentStep, setConfirmedOrder, step]
  );

  async function handlePay() {
    const o = orderRef.current;
    if (!o.grade || !o.quantityKg) return;
    setPaying(true);
    const amount = estimatePriceInr({
      grade: o.grade,
      sizeMm: parseSizeMm(o.sizeMm || "0"),
      lengthMm: parseFloat(o.lengthMm || "0"),
      quantityKg: parseFloat(o.quantityKg || "0"),
    });

    try {
      const res = await fetch("/api/metals/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInr: amount,
          order: o,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");

      if (data.demo) {
        pushUser("Pay now (demo)");
        await runAgentStep("complete");
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
            pushUser("Payment completed");
            await runAgentStep("complete");
            resolve();
          },
          modal: { ondismiss: () => reject(new Error("cancelled")) },
          prefill: { name: o.name, email: o.email, contact: o.phone },
        });
        rzp.open();
      });
    } catch (err) {
      pushAgent(err instanceof Error && err.message === "cancelled" ? "Payment cancelled — let me know when you're ready." : "Payment could not be completed. Try again or call us.");
    } finally {
      setPaying(false);
    }
  }

  if (!chatOpen) return null;

  const showPay = step === "payment";

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
              {msg.quickReplies && msg.role === "agent" && (
                <div className="nox-quick-replies">
                  {msg.quickReplies.map((q) => (
                    <button
                      key={q}
                      type="button"
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

        {showPay && step === "payment" && (
          <div className="nox-chat-pay">
            <button type="button" className="nox-pay-btn" onClick={() => void handlePay()} disabled={paying}>
              {paying ? "Processing…" : demoPay && !razorpayKey ? "Pay now (demo)" : "Pay with Razorpay"}
            </button>
          </div>
        )}

        {step !== "complete" && step !== "payment" && (
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
              placeholder="Type your reply…"
              aria-label="Chat message"
            />
            <button type="submit" aria-label="Send">
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </>
  );
}

/** Floating chat launcher when panel is closed */
export function ChatLauncher() {
  const { chatOpen, openChat } = useMetals();
  if (chatOpen) return null;
  return (
    <button type="button" className="nox-chat-fab" onClick={openChat} aria-label="Open live chat">
      <MessageCircle size={22} />
    </button>
  );
}
