import { Section, SectionHeadline } from "@/components/apple/apple-ui";
import { DEVICES } from "@/lib/dozy-content";
import { ScrollReveal } from "@/components/scroll-reveal";

export function DevicesSection() {
  return (
    <Section id="devices">
      <ScrollReveal>
        <SectionHeadline>Find Dozy on your favorite devices.</SectionHeadline>
        <ul className="mt-14 flex flex-wrap justify-center gap-8 sm:gap-16">
          {DEVICES.map((device) => (
            <li
              key={device}
              className="flex h-28 w-28 flex-col items-center justify-center rounded-2xl bg-[var(--dozy-card)] text-[17px] font-semibold text-[var(--dozy-ink)] sm:h-32 sm:w-32"
            >
              {device}
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </Section>
  );
}
