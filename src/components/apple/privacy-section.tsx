import {
  displaySerif,
  Section,
  SectionHeadline,
} from "@/components/apple/apple-ui";
import { ScrollReveal } from "@/components/scroll-reveal";

const POINTS = [
  "Health data stays on your device",
  "Seamless iCloud sync",
  "No data uploads, ever",
  "No ads, no tracking",
];

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      className="mt-0.5 shrink-0"
      aria-hidden
    >
      <circle cx="11" cy="11" r="11" fill="#34c759" fillOpacity="0.15" />
      <path
        d="M6.5 11.5l3 3 6-6.5"
        fill="none"
        stroke="#34c759"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PrivacySection() {
  return (
    <Section id="privacy" className="bg-[var(--dozy-surface-alt)]">
      <ScrollReveal>
        <SectionHeadline>Privacy first</SectionHeadline>
        <p
          className="mt-8 text-center text-[clamp(1.35rem,3.5vw,1.85rem)] font-light leading-[1.2] tracking-[-0.01em] text-[var(--dozy-muted)]"
          style={{ fontFamily: displaySerif }}
        >
          Your sleep data never leaves your device.
        </p>
      </ScrollReveal>
      <ScrollReveal
        as="ul"
        stagger={80}
        className="mx-auto mt-16 flex max-w-md flex-col gap-8 sm:mt-20"
      >
        {POINTS.map((point) => (
          <li key={point} className="flex items-start gap-4">
            <CheckIcon />
            <span className="dozy-body text-[18px] leading-snug text-[var(--dozy-ink)]">
              {point}
            </span>
          </li>
        ))}
      </ScrollReveal>
    </Section>
  );
}
