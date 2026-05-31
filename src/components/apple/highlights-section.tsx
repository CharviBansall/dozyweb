import { BodyCopy, Section, SectionHeadline } from "@/components/apple/apple-ui";
import { HIGHLIGHTS } from "@/lib/dozy-content";
import { ScrollReveal } from "@/components/scroll-reveal";

export function HighlightsSection() {
  return (
    <Section id="highlights" className="bg-[#f5f5f7]">
      <ScrollReveal>
        <SectionHeadline>Gets you resting. Keeps you sharp.</SectionHeadline>
        <ul className="mt-14 grid gap-10 sm:grid-cols-2">
          {HIGHLIGHTS.map((item) => (
            <li key={item.title}>
              <p className="text-[19px] font-semibold leading-snug text-[#1d1d1f]">
                {item.title}
              </p>
              <BodyCopy className="mt-2">{item.body}</BodyCopy>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </Section>
  );
}
