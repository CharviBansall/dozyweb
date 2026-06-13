import { Section, SectionHeadline, SectionSubhead } from "@/components/apple/apple-ui";
import { AppleFeatureContainer } from "@/components/apple-feature-container";
import { ScrollReveal } from "@/components/scroll-reveal";

export function MetricsSection() {
  return (
    <Section className="bg-[var(--dozy-surface)]">
      <ScrollReveal>
        <SectionHeadline>Yours, and yours alone.</SectionHeadline>
        <SectionSubhead className="text-center sm:text-left">
          Built on Apple Health. Private by design.
        </SectionSubhead>
        <div className="mt-14 flex justify-center">
          <AppleFeatureContainer />
        </div>
      </ScrollReveal>
    </Section>
  );
}
