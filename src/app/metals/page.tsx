"use client";

import { MetalsProvider } from "@/components/metals/metals-provider";
import { GetMetalSheet } from "@/components/metals/get-metal-sheet";
import { EnquiryChat, ChatLauncher } from "@/components/metals/enquiry-chat";
import { NoxAbout } from "@/components/metals/nox-about";
import { NoxChemistry } from "@/components/metals/nox-chemistry";
import { NoxSizePrices } from "@/components/metals/nox-size-prices";
import {
  NoxNav,
  NoxNewsBanner,
  NoxHero,
  NoxCatalog,
  NoxNestSection,
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
        <NoxAbout />
        <NoxCatalog />
        <NoxSizePrices />
        <NoxChemistry />
        <NoxNestSection />
        <NoxInstantQuote />
      </main>
      <NoxFooter />
      <GetMetalSheet />
      <EnquiryChat />
      <ChatLauncher />
    </MetalsProvider>
  );
}
