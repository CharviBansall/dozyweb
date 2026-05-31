import { PrimaryLink, Section } from "@/components/apple/apple-ui";
import { ScrollReveal } from "@/components/scroll-reveal";

export function FooterSection() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <Section className="!py-12">
        <ScrollReveal>
          <div className="grid gap-10 sm:grid-cols-2">
            <div className="rounded-[1.75rem] bg-[#f5f5f7] px-8 py-10 text-center">
              <h3 className="text-[2rem] font-semibold text-[#1d1d1f]">Dozy</h3>
              <p className="mt-3 text-[17px] text-[#6e6e73]">
                Personalized naps from Apple Health sleep data.
              </p>
              <p className="mt-6">
                <PrimaryLink href="#download">Download on the App Store</PrimaryLink>
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-[#f5f5f7] px-8 py-10 text-center">
              <h3 className="text-[2rem] font-semibold text-[#1d1d1f]">
                Built with HealthKit
              </h3>
              <p className="mt-3 text-[17px] text-[#6e6e73]">
                Sleep trends, nap windows, timers, and gentle wake — designed for
                iPhone and Apple Watch.
              </p>
            </div>
          </div>
          <p className="mt-12 text-center text-[12px] text-[#6e6e73]">
            Copyright © {new Date().getFullYear()} Dozy. Apple Watch and iPhone
            are trademarks of Apple Inc.
          </p>
        </ScrollReveal>
      </Section>
    </footer>
  );
}
