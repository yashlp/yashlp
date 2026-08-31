"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  EMPTY_ENQUIRY,
  type ConfirmedOrder,
  type EnquiryDraft,
} from "@/lib/metals/enquiry";

type MetalsContextValue = {
  sheetOpen: boolean;
  chatOpen: boolean;
  enquiry: EnquiryDraft;
  prefill: Partial<EnquiryDraft>;
  openGetMetal: (prefill?: Partial<EnquiryDraft>) => void;
  closeGetMetal: () => void;
  setEnquiry: (patch: Partial<EnquiryDraft>) => void;
  submitEnquiry: () => void;
  openChat: () => void;
  closeChat: () => void;
  confirmedOrder: Partial<ConfirmedOrder>;
  setConfirmedOrder: (patch: Partial<ConfirmedOrder>) => void;
};

const MetalsContext = createContext<MetalsContextValue | null>(null);

export function MetalsProvider({ children }: { children: ReactNode }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [enquiry, setEnquiryState] = useState<EnquiryDraft>(EMPTY_ENQUIRY);
  const [prefill, setPrefill] = useState<Partial<EnquiryDraft>>({});
  const [confirmedOrder, setConfirmedOrderState] = useState<Partial<ConfirmedOrder>>({});

  const openGetMetal = useCallback((next?: Partial<EnquiryDraft>) => {
    const merged = { ...EMPTY_ENQUIRY, ...next };
    setPrefill(next ?? {});
    setEnquiryState(merged);
    setSheetOpen(true);
  }, []);

  const closeGetMetal = useCallback(() => setSheetOpen(false), []);

  const setEnquiry = useCallback((patch: Partial<EnquiryDraft>) => {
    setEnquiryState((prev) => ({ ...prev, ...patch }));
  }, []);

  const submitEnquiry = useCallback(() => {
    setConfirmedOrderState((prev) => ({ ...prev, ...enquiry }));
    setSheetOpen(false);
    setChatOpen(true);
  }, [enquiry]);

  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  const setConfirmedOrder = useCallback((patch: Partial<ConfirmedOrder>) => {
    setConfirmedOrderState((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(
    () => ({
      sheetOpen,
      chatOpen,
      enquiry,
      prefill,
      openGetMetal,
      closeGetMetal,
      setEnquiry,
      submitEnquiry,
      openChat,
      closeChat,
      confirmedOrder,
      setConfirmedOrder,
    }),
    [
      sheetOpen,
      chatOpen,
      enquiry,
      prefill,
      openGetMetal,
      closeGetMetal,
      setEnquiry,
      submitEnquiry,
      openChat,
      closeChat,
      confirmedOrder,
      setConfirmedOrder,
    ]
  );

  return <MetalsContext.Provider value={value}>{children}</MetalsContext.Provider>;
}

export function useMetals() {
  const ctx = useContext(MetalsContext);
  if (!ctx) throw new Error("useMetals must be used within MetalsProvider");
  return ctx;
}
