"use client";

import { ApplePage } from "@/components/apple/apple-ui";
import { DevicesSection } from "@/components/apple/devices-section";
import { FaqSection } from "@/components/apple/faq-section";
import { FooterSection } from "@/components/apple/footer-section";
import { GradientHeroBand } from "@/components/apple/gradient-hero-band";
import { HeroSection } from "@/components/apple/hero-section";
import { HighlightsSection } from "@/components/apple/highlights-section";
import { MetricsSection } from "@/components/apple/metrics-section";
import { NapTypesSection } from "@/components/apple/nap-types-section";
import { PlansSection } from "@/components/apple/plans-section";
import { PricingSection } from "@/components/apple/pricing-section";
import { SiteHeader } from "@/components/apple/site-header";

export function LandingPage() {
  return (
    <ApplePage>
      <SiteHeader />
      <GradientHeroBand />
      <HeroSection />
      <HighlightsSection />
      <PricingSection />
      <PlansSection />
      <MetricsSection />
      <NapTypesSection />
      <PricingSection />
      <FaqSection />
      <DevicesSection />
      <FooterSection />
    </ApplePage>
  );
}
