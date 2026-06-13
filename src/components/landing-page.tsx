"use client";

import { ApplePage } from "@/components/apple/apple-ui";
import { FaqSection } from "@/components/apple/faq-section";
import { FooterSection } from "@/components/apple/footer-section";
import { PinnedShowcaseSection } from "@/components/apple/pinned-showcase-section";
import { GradientHeroBand } from "@/components/apple/gradient-hero-band";
import { HeroSection } from "@/components/apple/hero-section";
import { HighlightsSection } from "@/components/apple/highlights-section";
import { PrivacySection } from "@/components/apple/privacy-section";
import { SiteHeader } from "@/components/apple/site-header";
import { StatsBand } from "@/components/apple/stats-band";

export function LandingPage() {
  return (
    <ApplePage>
      <SiteHeader />
      <GradientHeroBand />
      <HeroSection />
      <StatsBand />
      <HighlightsSection />
      <PinnedShowcaseSection />
      <PrivacySection />
      <FaqSection />
      <FooterSection />
    </ApplePage>
  );
}
