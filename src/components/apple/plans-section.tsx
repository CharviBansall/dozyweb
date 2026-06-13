import {
  BodyCopy,
  Section,
  SectionHeadline,
  SectionSubhead,
} from "@/components/apple/apple-ui";
import { PhoneFrame } from "@/components/apple/gallery-section";
import { ScrollReveal } from "@/components/scroll-reveal";

type FeatureRow = {
  title: string;
  body: string;
  src: string;
  alt: string;
};

const ROWS: FeatureRow[] = [
  {
    title: "Know exactly how much rest you owe.",
    body: "Dozy adds up your sleep shortfall night after night and shows a single honest number — how rested you actually are. Tap any day to see exactly how you slept.",
    src: "/images/02_sleepdebt.png",
    alt: "Dozy sleep debt — daily breakdown and highlights",
  },
  {
    title: "Catch up with the right nap.",
    body: "When you’re running low, Dozy recommends a nap — the right length, at the right time — to help you catch up without wrecking tonight’s sleep. Finish it and the recovery logs back to Apple Health.",
    src: "/images/03_napwindow.png",
    alt: "Dozy nap window — a 90-minute nap timer",
  },
  {
    title: "See the sleep that repairs you.",
    body: "Restorative shows how much of last night was deep and REM — the stages that actually repair you — so you know how recovered you really are.",
    src: "/images/04_restorative.png",
    alt: "Dozy restorative sleep — deep, REM, and light",
  },
  {
    title: "Everything at a glance.",
    body: "Your Home tab brings it all together: sleep debt, today’s nap window, and last night’s restorative sleep — in one place, powered entirely by Apple Health.",
    src: "/images/01_summary.png",
    alt: "Dozy summary — sleep debt, nap window, restorative rings",
  },
];

export function PlansSection() {
  return (
    <Section id="plans">
      <ScrollReveal>
        <SectionHeadline>
          Know what you owe. Catch up the right way.
        </SectionHeadline>
      </ScrollReveal>
      <div className="mt-16 flex flex-col gap-20 sm:mt-20 sm:gap-28">
        {ROWS.map((row, index) => {
          const imageLeft = index % 2 === 0;
          return (
            <div
              key={row.title}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <ScrollReveal
                from={imageLeft ? "left" : "right"}
                className={`flex justify-center ${imageLeft ? "" : "lg:order-2"}`}
              >
                <PhoneFrame
                  src={row.src}
                  alt={row.alt}
                  className="w-[60vw] max-w-[240px] lg:w-[230px]"
                />
              </ScrollReveal>
              <ScrollReveal
                delay={120}
                className={imageLeft ? "" : "lg:order-1"}
              >
                <SectionSubhead className="!mt-0">{row.title}</SectionSubhead>
                <BodyCopy className="mt-4 max-w-md">{row.body}</BodyCopy>
              </ScrollReveal>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
