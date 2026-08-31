import type { ConfirmedOrder, EnquiryDraft } from "./enquiry";
import { formatQuantity, type ChatStep } from "./enquiry";

export type ChatSession = {
  step: ChatStep;
  awaitingField: keyof EnquiryDraft | null;
  order: Partial<ConfirmedOrder>;
};

export type AgentReply = {
  text: string;
  quickReplies?: string[];
};

export type ChatTurnResult = {
  session: ChatSession;
  agentReplies: AgentReply[];
  /** Skip advancing when user sent empty/noise on a confirm step */
  reprompt?: boolean;
};

function isYes(text: string): boolean {
  const t = text.toLowerCase().trim();
  return (
    t === "yes" ||
    t === "yes, correct" ||
    t === "correct" ||
    t.includes("yes, correct") ||
    t.includes("proceed to payment") ||
    t === "proceed"
  );
}

function isChange(text: string): boolean {
  return text.toLowerCase().includes("change");
}

function fieldForChange(text: string): keyof EnquiryDraft | null {
  const t = text.toLowerCase();
  if (t.includes("grade")) return "grade";
  if (t.includes("shape")) return "shape";
  if (t.includes("size")) return "sizeMm";
  if (t.includes("length")) return "lengthMm";
  if (t.includes("quantity")) return "quantityPieces";
  return null;
}

function formatSize(size: string | undefined, shape: string | undefined): string {
  if (!size) return "—";
  if (shape === "Flat Bar" || size.includes("×")) return `${size} mm (T×W)`;
  return `${size} mm`;
}

function promptForStep(step: ChatStep, order: Partial<ConfirmedOrder>): AgentReply {
  switch (step) {
    case "welcome":
      return {
        text: "Thanks for your enquiry! I'll confirm each detail with you before we proceed to payment.",
      };
    case "confirm_grade":
      return {
        text: `Grade: **${order.grade || "—"}** — is this correct?`,
        quickReplies: ["Yes, correct", "Change grade"],
      };
    case "confirm_shape":
      return {
        text: `Shape: **${order.shape || "—"}** — is this correct?`,
        quickReplies: ["Yes, correct", "Change shape"],
      };
    case "confirm_size":
      return {
        text: `Size: **${formatSize(order.sizeMm, order.shape)}** — is this correct?`,
        quickReplies: ["Yes, correct", "Change size"],
      };
    case "confirm_length":
      return {
        text: `Length: **${order.lengthMm || "—"} mm** — is this correct?`,
        quickReplies: ["Yes, correct", "Change length"],
      };
    case "confirm_quantity":
      return {
        text: `Quantity: **${formatQuantity(order.quantityPieces)}** — is this correct?`,
        quickReplies: ["Yes, correct", "Change quantity"],
      };
    case "ask_name":
      return { text: "What name should we put on the order?" };
    case "ask_phone":
      return { text: "What's the best phone number to reach you?" };
    case "ask_email":
      return { text: "Email address for invoice and delivery updates?" };
    case "summary":
      return {
        text: `Order summary:\n• ${order.grade} · ${order.shape}\n• ${formatSize(order.sizeMm, order.shape)} × ${order.lengthMm || "—"} mm length\n• ${formatQuantity(order.quantityPieces)}\n• ${order.name} · ${order.phone}\n• ${order.email}`,
        quickReplies: ["Proceed to payment"],
      };
    case "payment":
      return {
        text: "Ready when you are — complete payment below to confirm your order.",
        quickReplies: ["Pay now"],
      };
    case "complete":
      return { text: "Payment received. Your order is confirmed — we'll be in touch shortly!" };
    default:
      return { text: "" };
  }
}

const CHANGE_LABELS: Record<keyof EnquiryDraft, string> = {
  grade: "grade",
  shape: "shape",
  sizeMm: "size",
  lengthMm: "length in mm",
  quantityPieces: "quantity (pieces)",
};

export function createChatSession(order: Partial<ConfirmedOrder>): ChatSession {
  return {
    step: "confirm_grade",
    awaitingField: null,
    order: { ...order },
  };
}

export function initialChatMessages(order: Partial<ConfirmedOrder>): AgentReply[] {
  return [promptForStep("welcome", order), promptForStep("confirm_grade", order)];
}

/** Pure state machine — unit-testable */
export function processChatTurn(
  session: ChatSession,
  rawText: string,
  estimateLine?: string
): ChatTurnResult {
  const text = rawText.trim();
  const agentReplies: AgentReply[] = [];
  let next: ChatSession = {
    ...session,
    order: { ...session.order },
  };

  if (!text) {
    return { session, agentReplies: [], reprompt: true };
  }

  if (session.awaitingField) {
    const field = session.awaitingField;
    next.order[field] = text as never;
    next.awaitingField = null;
    const confirmStep = fieldToConfirmStep(field);
    next.step = confirmStep;
    agentReplies.push(promptForStep(confirmStep, next.order));
    return { session: next, agentReplies };
  }

  if (isChange(text)) {
    const field = fieldForChange(text);
    if (field && session.step.startsWith("confirm_")) {
      next.awaitingField = field;
      agentReplies.push({ text: `What ${CHANGE_LABELS[field]} do you need?` });
      return { session: next, agentReplies };
    }
  }

  switch (session.step) {
    case "confirm_grade":
    case "confirm_shape":
    case "confirm_size":
    case "confirm_length":
    case "confirm_quantity":
      if (!isYes(text)) {
        agentReplies.push({
          text: "Please tap **Yes, correct** to continue, or **Change …** to update that field.",
          quickReplies: promptForStep(session.step, session.order).quickReplies,
        });
        return { session, agentReplies, reprompt: true };
      }
      next.step = nextConfirmStep(session.step);
      agentReplies.push(promptForStep(next.step, next.order));
      return { session: next, agentReplies };

    case "ask_name":
      next.order.name = text;
      next.step = "ask_phone";
      agentReplies.push(promptForStep("ask_phone", next.order));
      return { session: next, agentReplies };

    case "ask_phone":
      next.order.phone = text;
      next.step = "ask_email";
      agentReplies.push(promptForStep("ask_email", next.order));
      return { session: next, agentReplies };

    case "ask_email":
      next.order.email = text;
      next.step = "summary";
      agentReplies.push(promptForStep("summary", next.order));
      if (estimateLine) agentReplies.push({ text: estimateLine });
      return { session: next, agentReplies };

    case "summary":
      if (!isYes(text) && !text.toLowerCase().includes("pay")) {
        agentReplies.push({
          text: "Tap **Proceed to payment** when you're ready.",
          quickReplies: ["Proceed to payment"],
        });
        return { session, agentReplies, reprompt: true };
      }
      next.step = "payment";
      agentReplies.push(promptForStep("payment", next.order));
      return { session: next, agentReplies };

    case "payment":
      return { session, agentReplies: [] };

    case "complete":
      return { session, agentReplies: [] };

    default:
      return { session, agentReplies: [] };
  }
}

function fieldToConfirmStep(field: keyof EnquiryDraft): ChatStep {
  const map: Record<keyof EnquiryDraft, ChatStep> = {
    grade: "confirm_grade",
    shape: "confirm_shape",
    sizeMm: "confirm_size",
    lengthMm: "confirm_length",
    quantityPieces: "confirm_quantity",
  };
  return map[field];
}

function nextConfirmStep(step: ChatStep): ChatStep {
  const flow: Partial<Record<ChatStep, ChatStep>> = {
    confirm_grade: "confirm_shape",
    confirm_shape: "confirm_size",
    confirm_size: "confirm_length",
    confirm_length: "confirm_quantity",
    confirm_quantity: "ask_name",
  };
  return flow[step] ?? step;
}

export function completePayment(session: ChatSession): ChatTurnResult {
  return {
    session: { ...session, step: "complete" },
    agentReplies: [promptForStep("complete", session.order)],
  };
}
