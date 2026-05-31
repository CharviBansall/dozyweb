import {
  BodyCopy,
  Section,
  SectionHeadline,
  SectionSubhead,
} from "@/components/apple/apple-ui";
import { AppleFeatureContainer } from "@/components/apple-feature-container";
import { ScrollReveal } from "@/components/scroll-reveal";

export function PlansSection() {
  return (
    <Section id="plans">
      <ScrollReveal>
        <SectionHeadline>
          Find a nap routine that works for you. And with you.
        </SectionHeadline>
        <SectionSubhead>Recommendations that just get you.</SectionSubhead>
        <BodyCopy className="mt-4 max-w-3xl">
          Jump right in with a nap length and start time designed around your
          sleep debt and circadian rhythm. Dozy surfaces power, extended, and
          full-cycle options — plus a clear rationale for each suggestion.
        </BodyCopy>
        <SectionSubhead>See your best window in For You.</SectionSubhead>
        <BodyCopy className="mt-4 max-w-3xl">
          From day one, Dozy learns from your Health sleep history. Your Home
          tab highlights when your nap window opens, how much sleep debt you’re
          carrying, and which nap type fits the moment.
        </BodyCopy>
        <div className="mt-14 flex justify-center">
          <AppleFeatureContainer />
        </div>
      </ScrollReveal>
    </Section>
  );
}
