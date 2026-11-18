import {
  BodyCopy,
  Eyebrow,
  HeroSubtitle,
  HeroTitle,
  PrimaryLink,
  Section,
} from "@/components/apple/apple-ui";
import { DeviceShowcase } from "@/components/device-showcase";
import { APP_STORE_URL } from "@/lib/dozy-content";
import { instrumentSerif } from "@/lib/fonts";

export function HeroSection() {
  return (
    <Section className="!pt-12 !pb-16 sm:!pt-16 sm:!pb-20">
      <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <Eyebrow>Free on iPhone and Apple Watch</Eyebrow>
          <HeroTitle>
            <span className={instrumentSerif.className}>Dozy</span>
          </HeroTitle>
          <HeroSubtitle>Find out how much sleep you owe.</HeroSubtitle>
          <BodyCopy className="mt-8 max-w-md">
            Dozy reads the sleep you already track and tells you the one thing
            to do about it today: a nap this afternoon, or an earlier bedtime
            tonight.
          </BodyCopy>
          <div className="mt-10">
            <PrimaryLink href={APP_STORE_URL} external>
              Download on the App Store
            </PrimaryLink>
          </div>
        </div>
        <DeviceShowcase priority glow float className="mx-auto lg:mx-0" />
      </div>
    </Section>
  );
}
