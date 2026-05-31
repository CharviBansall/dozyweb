import { Section, SectionHeadline, SectionSubhead } from "@/components/apple/apple-ui";
import { AppleFeatureContainer } from "@/components/apple-feature-container";
import { ScrollReveal } from "@/components/scroll-reveal";

export function MetricsSection() {
  return (
    <Section className="bg-white">
      <ScrollReveal>
        <SectionHeadline>Metrics that keep you on track.</SectionHeadline>
        <SectionSubhead className="text-center sm:text-left">
          Supercharge your nap with Apple Watch.
        </SectionSubhead>
        <div className="mt-14 flex justify-center">
          <AppleFeatureContainer />
        </div>
      </ScrollReveal>
    </Section>
  );
}
