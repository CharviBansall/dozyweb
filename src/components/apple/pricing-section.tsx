import { PrimaryLink, Section } from "@/components/apple/apple-ui";
import { ScrollReveal } from "@/components/scroll-reveal";

export function PricingSection() {
  return (
    <Section id="download">
      <ScrollReveal>
        <div className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-[1.75rem] bg-[#f5f5f7] px-8 py-10 text-center">
            <h3 className="text-[2rem] font-semibold leading-tight text-[#1d1d1f]">
              Free to try
            </h3>
            <p className="mt-3 text-[17px] leading-[1.47] text-[#6e6e73]">
              Connect Apple Health and get personalized nap recommendations,
              trends, and timers — no subscription required during beta.
            </p>
            <p className="mt-6">
              <PrimaryLink href="#download">Get started</PrimaryLink>
            </p>
          </article>
          <article className="rounded-[1.75rem] bg-[#f5f5f7] px-8 py-10 text-center">
            <h3 className="text-[2rem] font-semibold leading-tight text-[#1d1d1f]">
              Built for Apple
            </h3>
            <p className="mt-3 text-[17px] leading-[1.47] text-[#6e6e73]">
              Designed for iPhone and Apple Watch with HealthKit, local wake
              alarms, and nap window notifications.
            </p>
            <p className="mt-6">
              <PrimaryLink href="#devices">See supported devices</PrimaryLink>
            </p>
          </article>
        </div>
      </ScrollReveal>
    </Section>
  );
}
