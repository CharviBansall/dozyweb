import { Section } from "@/components/apple/apple-ui";
import { ScrollReveal } from "@/components/scroll-reveal";

export function FooterSection() {
  return (
    <footer className="border-t border-[var(--dozy-ink)]/10 bg-[var(--dozy-surface)]">
      <Section className="!py-12">
        <ScrollReveal>
          <p className="text-center text-[12px] text-[var(--dozy-muted)]">
            Questions?{" "}
            <a
              href="mailto:charvibansal2006@gmail.com"
              className="underline-offset-2 transition-colors hover:text-[var(--dozy-ink)] hover:underline"
            >
              Contact us
            </a>
          </p>
          <p className="mt-3 text-center text-[12px] text-[var(--dozy-muted)]">
            Copyright © {new Date().getFullYear()} Dozy. Apple Watch and iPhone
            are trademarks of Apple Inc.
          </p>
        </ScrollReveal>
      </Section>
    </footer>
  );
}
