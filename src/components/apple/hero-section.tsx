import { Eyebrow, HeroSubtitle, HeroTitle, PrimaryLink, Section } from "@/components/apple/apple-ui";
import { DeviceShowcase } from "@/components/device-showcase";
import { instrumentSerif } from "@/lib/fonts";

export function HeroSection() {
  return (
    <Section className="!pt-8 pb-8 sm:!pt-12">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>Find it on the App Store.</Eyebrow>
          <HeroTitle>
            <span className={instrumentSerif.className}>Dozy</span>
          </HeroTitle>
          <HeroSubtitle>Reads your sleep. Plans your nap.</HeroSubtitle>
          <p className="mt-6 text-[17px] leading-[1.47] text-[#6e6e73]">
            Personalized nap recommendations from Apple Health — timing, duration,
            and gentle wake alarms built around your body clock.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <PrimaryLink href="#download">Learn more</PrimaryLink>
            <PrimaryLink href="#download">Download on the App Store</PrimaryLink>
          </div>
        </div>
        <DeviceShowcase priority />
      </div>
    </Section>
  );
}
