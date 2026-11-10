import { PrimaryLink, SecondaryLink, Section } from "@/components/apple/apple-ui";
import { ScrollReveal } from "@/components/scroll-reveal";
import { APP_STORE_URL } from "@/lib/dozy-content";

export function PricingSection() {
  return (
    <Section id="pricing">
      <ScrollReveal>
        <div className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-[1.75rem] bg-[var(--dozy-surface-alt)] px-8 py-10 text-center">
            <h3
              className="text-[2.5rem] font-light leading-tight tracking-[-0.02em] text-[var(--dozy-ink)]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              $19/month
            </h3>
            <p className="mt-3 text-[17px] leading-[1.55] text-[var(--dozy-muted)]">
              3-day free trial, then Dozy Pro on the web — same plan as iOS. Cancel
              anytime in the customer portal.
            </p>
            <p className="mt-6">
              <PrimaryLink href="/subscribe">Start free trial</PrimaryLink>
            </p>
          </article>
          <article className="rounded-[1.75rem] bg-[var(--dozy-surface-alt)] px-8 py-10 text-center">
            <h3
              className="text-[2.5rem] font-light leading-tight tracking-[-0.02em] text-[var(--dozy-ink)]"
              style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
            >
              On iPhone
            </h3>
            <p className="mt-3 text-[17px] leading-[1.55] text-[var(--dozy-muted)]">
              Prefer Apple? Subscribe through the App Store with the same $19/month
              plan and 3-day trial.
            </p>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <PrimaryLink href={APP_STORE_URL} external>
                App Store
              </PrimaryLink>
              <SecondaryLink href="/app">Open web app</SecondaryLink>
            </p>
          </article>
        </div>
      </ScrollReveal>
    </Section>
  );
}
