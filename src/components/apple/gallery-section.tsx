import type { CSSProperties } from "react";
import Image from "next/image";
import { Section, SectionHeadline } from "@/components/apple/apple-ui";
import { ScrollReveal } from "@/components/scroll-reveal";

type Shot = {
  src: string;
  alt: string;
  /** Desktop vertical stagger offset class for a dynamic row. */
  offset: string;
};

const SHOTS: Shot[] = [
  { src: "/images/01_summary.png", alt: "Dozy summary — sleep debt, nap window, restorative rings", offset: "lg:mt-0" },
  { src: "/images/02_sleepdebt.png", alt: "Dozy sleep debt — daily breakdown and highlights", offset: "lg:mt-10" },
  { src: "/images/03_napwindow.png", alt: "Dozy nap window — a 90-minute nap timer", offset: "lg:mt-2" },
  { src: "/images/04_restorative.png", alt: "Dozy restorative sleep — deep, REM, and light", offset: "lg:mt-12" },
];

export function PhoneFrame({
  src,
  alt,
  className = "",
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`dozy-media relative shrink-0 bg-[#0c0c0e] p-[8px] ${className}`}
      style={style}
    >
      <div className="overflow-hidden rounded-[12px] bg-black">
        <Image
          src={src}
          alt={alt}
          width={473}
          height={1024}
          className="block h-auto w-full"
          sizes="(max-width: 640px) 60vw, 220px"
        />
      </div>
    </div>
  );
}

export function GallerySection() {
  return (
    <Section id="gallery" className="bg-[var(--dozy-surface)]">
      <ScrollReveal>
        <SectionHeadline>See it in action</SectionHeadline>
      </ScrollReveal>
      <ScrollReveal
        as="div"
        stagger={80}
        className="-mx-5 mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-6 sm:mx-0 sm:mt-20 sm:justify-center sm:gap-7 sm:overflow-visible sm:px-0 sm:pb-0 lg:pb-16"
      >
        {SHOTS.map((shot) => (
          <PhoneFrame
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            className={`w-[62vw] max-w-[260px] snap-center sm:w-[44vw] lg:w-[210px] ${shot.offset}`}
          />
        ))}
      </ScrollReveal>
    </Section>
  );
}
