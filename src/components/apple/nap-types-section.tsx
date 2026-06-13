import { Section, SectionHeadline, SectionSubhead, BodyCopy } from "@/components/apple/apple-ui";
import { NAP_TYPES } from "@/lib/dozy-content";
import { ScrollReveal } from "@/components/scroll-reveal";

export function NapTypesSection() {
  return (
    <Section>
      <ScrollReveal>
        <SectionHeadline>More ways to catch up.</SectionHeadline>
        <SectionSubhead>A nap for every kind of tired.</SectionSubhead>
        <BodyCopy className="mt-4 max-w-3xl">
          Short, effective naps — from a quick power nap to a fuller recovery —
          plus window alerts for the right moment to rest. Every recommendation
          updates as your sleep debt changes.
        </BodyCopy>
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {NAP_TYPES.map((type) => (
            <li
              key={type.name}
              className="flex flex-col items-center rounded-2xl bg-[var(--dozy-card)] px-3 py-8 text-center"
            >
              <span
                className="mb-4 h-14 w-14 rounded-full"
                style={{ background: `linear-gradient(135deg, ${type.color}, var(--dozy-card))` }}
                aria-hidden
              />
              <span className="text-[15px] font-semibold text-[var(--dozy-ink)]">
                {type.name}
              </span>
              <span className="mt-1 text-[13px] text-[var(--dozy-muted)]">{type.duration}</span>
            </li>
          ))}
        </ul>
        <SectionSubhead className="mt-16">Pick your preferences.</SectionSubhead>
        <BodyCopy className="mt-4 max-w-3xl">
          20 to 90 minutes, tuned to sleep debt and time of day. Filter by nap
          type, see your rationale, and get notified when your window opens.
        </BodyCopy>
      </ScrollReveal>
    </Section>
  );
}
