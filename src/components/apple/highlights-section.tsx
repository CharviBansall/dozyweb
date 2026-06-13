import { BodyCopy, Section, SectionHeadline } from "@/components/apple/apple-ui";
import { HIGHLIGHTS } from "@/lib/dozy-content";
import { ActivityRing } from "@/components/activity-ring";
import { ScrollReveal } from "@/components/scroll-reveal";

export function HighlightsSection() {
  return (
    <Section id="highlights" className="bg-[var(--dozy-surface-alt)]">
      <ScrollReveal>
        <SectionHeadline>Gets you resting. Keeps you sharp.</SectionHeadline>
      </ScrollReveal>
      <ScrollReveal
        as="ul"
        stagger={80}
        className="mx-auto mt-20 flex max-w-2xl flex-col gap-10 sm:mt-24"
      >
        {HIGHLIGHTS.map((item) => (
          <li
            key={item.title}
              className="flex items-start gap-6 rounded-[20px] border border-[var(--dozy-ink)]/8 bg-[var(--dozy-surface)] px-9 py-10 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.12)]"
          >
            <ActivityRing
              color={item.ring}
              progress={item.progress}
              size={64}
              className="mt-1 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[22px] font-semibold leading-snug text-[var(--dozy-ink)]">
                {item.title}
              </p>
              <BodyCopy className="mt-4">{item.body}</BodyCopy>
            </div>
          </li>
        ))}
      </ScrollReveal>
    </Section>
  );
}
