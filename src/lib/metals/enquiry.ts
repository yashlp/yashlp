export type EnquiryDraft = {
  grade: string;
  shape: string;
  sizeMm: string;
  lengthMm: string;
  quantityPieces: string;
};

export type ConfirmedOrder = EnquiryDraft & {
  name: string;
  phone: string;
  email: string;
};

export type ChatMessage = {
  id: string;
  role: "agent" | "user";
  text: string;
  quickReplies?: string[];
  at: number;
};

export type ChatStep =
  | "welcome"
  | "confirm_grade"
  | "confirm_shape"
  | "confirm_size"
  | "confirm_length"
  | "confirm_quantity"
  | "ask_name"
  | "ask_phone"
  | "ask_email"
  | "summary"
  | "payment"
  | "complete";

export const EMPTY_ENQUIRY: EnquiryDraft = {
  grade: "",
  shape: "Round Bar",
  sizeMm: "",
  lengthMm: "",
  quantityPieces: "",
};

export function formatQuantity(qty: string | undefined): string {
  if (!qty?.trim()) return "—";
  const n = parseInt(qty, 10);
  if (Number.isNaN(n)) return qty;
  return `${n} ${n === 1 ? "piece" : "pieces"}`;
}

export function stepPrompt(
  step: ChatStep,
  order: Partial<ConfirmedOrder>
): { text: string; quickReplies?: string[] } {
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
        text: `Size: **${order.sizeMm || "—"} mm** — is this correct?`,
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
        text: `Order summary:\n• ${order.grade} · ${order.shape}\n• ${order.sizeMm} mm × ${order.lengthMm} mm length\n• ${formatQuantity(order.quantityPieces)}\n• ${order.name} · ${order.phone}\n• ${order.email}`,
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

export function nextStep(step: ChatStep, userText: string): ChatStep {
  const t = userText.toLowerCase();
  const isYes = t.includes("yes") || t === "correct" || t.includes("proceed");
  const isChange = t.includes("change");

  switch (step) {
    case "welcome":
      return "confirm_grade";
    case "confirm_grade":
      return isChange ? "confirm_grade" : "confirm_shape";
    case "confirm_shape":
      return isChange ? "confirm_shape" : "confirm_size";
    case "confirm_size":
      return isChange ? "confirm_size" : "confirm_length";
    case "confirm_length":
      return isChange ? "confirm_length" : "confirm_quantity";
    case "confirm_quantity":
      return isChange ? "confirm_quantity" : "ask_name";
    case "ask_name":
      return "ask_phone";
    case "ask_phone":
      return "ask_email";
    case "ask_email":
      return "summary";
    case "summary":
      return "payment";
    case "payment":
      return "complete";
    default:
      return step;
  }
}

export function isAwaitingInput(step: ChatStep, lastUserChange?: boolean): boolean {
  if (lastUserChange) return true;
  if (step === "ask_name" || step === "ask_phone" || step === "ask_email") return true;
  if (step.startsWith("confirm_")) return true;
  return false;
}

export function fieldForChangeReply(text: string): keyof EnquiryDraft | null {
  const t = text.toLowerCase();
  if (t.includes("grade")) return "grade";
  if (t.includes("shape")) return "shape";
  if (t.includes("size")) return "sizeMm";
  if (t.includes("length")) return "lengthMm";
  if (t.includes("quantity")) return "quantityPieces";
  return null;
}
