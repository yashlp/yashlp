"use client";

import { MetalsProvider } from "@/components/metals/metals-provider";
import { GetMetalSheet } from "@/components/metals/get-metal-sheet";
import { EnquiryChat, ChatLauncher } from "@/components/metals/enquiry-chat";
import {
  NoxNav,
  NoxNewsBanner,
  NoxHero,
  NoxCatalog,
  NoxNestSection,
  NoxMission,
  NoxInstantQuote,
  NoxFooter,
} from "@/components/metals/nox-site";

export default function MetalsHomePage() {
  return (
    <MetalsProvider>
      <NoxNewsBanner />
      <NoxNav />
      <main>
        <NoxHero />
        <NoxCatalog />
        <NoxNestSection />
        <NoxMission />
        <NoxInstantQuote />
      </main>
      <NoxFooter />
      <GetMetalSheet />
      <EnquiryChat />
      <ChatLauncher />
    </MetalsProvider>
  );
}
