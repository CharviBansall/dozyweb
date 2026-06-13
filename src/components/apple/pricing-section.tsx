import { PrimaryLink, Section } from "@/components/apple/apple-ui";
import { ScrollReveal } from "@/components/scroll-reveal";

export function PricingSection() {
  return (
    <Section id="download">
      <ScrollReveal>
        <div className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-[1.75rem] bg-[var(--dozy-surface-alt)] px-8 py-10 text-center">
            <h3
              className="text-[2.5rem] font-light leading-tight tracking-[-0.02em] text-[var(--dozy-ink)]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              Free to try
            </h3>
            <p className="mt-3 text-[17px] leading-[1.55] text-[var(--dozy-muted)]">
              Connect Apple Health and get your sleep debt, nap recommendations,
              and timers — no subscription required during beta.
            </p>
            <p className="mt-6">
              <PrimaryLink href="#download">Get started</PrimaryLink>
            </p>
          </article>
          <article className="rounded-[1.75rem] bg-[var(--dozy-surface-alt)] px-8 py-10 text-center">
            <h3
              className="text-[2.5rem] font-light leading-tight tracking-[-0.02em] text-[var(--dozy-ink)]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              Built for Apple
            </h3>
            <p className="mt-3 text-[17px] leading-[1.55] text-[var(--dozy-muted)]">
              Designed for iPhone and Apple Watch with HealthKit, gentle wake
              alarms, and fully on-device privacy.
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
