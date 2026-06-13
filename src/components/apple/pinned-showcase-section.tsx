"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AppScreenshot } from "@/components/app-screenshot";
import { BodyCopy, displaySerif } from "@/components/apple/apple-ui";
import Image from "next/image";

type Slide = {
  title: string;
  headline: string;
  body: string;
  src: string;
  alt: string;
};

const SLIDES: Slide[] = [
  {
    title: "Summary",
    headline: "Your sleep, at a glance.",
    body: "Sleep debt, today’s nap window, and last night’s restorative sleep — three rings and three numbers that tell you how rested you really are.",
    src: "/images/01_summary.png",
    alt: "Dozy summary — sleep debt, nap window, restorative rings",
  },
  {
    title: "Sleep Debt",
    headline: "Know exactly what you owe.",
    body: "Dozy adds up your shortfall night after night and shows it in plain numbers. Tap any day to see exactly how you slept.",
    src: "/images/02_sleepdebt.png",
    alt: "Dozy sleep debt — daily breakdown and highlights",
  },
  {
    title: "Nap Window",
    headline: "Catch up with the right nap.",
    body: "When you’re running low, Dozy finds the right length at the right time — so you recover without wrecking tonight’s sleep.",
    src: "/images/03_napwindow.png",
    alt: "Dozy nap window — a 90-minute nap timer",
  },
  {
    title: "Restorative",
    headline: "See the sleep that repairs you.",
    body: "Deep and REM — the stages that actually repair you — broken down so you know how recovered you really are.",
    src: "/images/04_restorative.png",
    alt: "Dozy restorative sleep — deep, REM, and light",
  },
];

const SLIDE_COUNT = SLIDES.length;
const MOBILE_QUERY = "(max-width: 1023px)";

function PhoneStack({
  imageRefs,
  className = "",
}: {
  imageRefs: RefObject<(HTMLDivElement | null)[]>;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 rounded-[2rem] bg-[#0c0c0e] p-[8px] shadow-[0_24px_48px_-28px_rgba(0,0,0,0.2)] ring-1 ring-black/5 ${className}`}
    >
      <div className="relative aspect-[473/1024] w-[240px] overflow-hidden rounded-[20px] bg-black lg:w-[280px]">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            className="absolute inset-0"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={473}
              height={1024}
              className="h-full w-full object-cover object-top"
              sizes="280px"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideCopy({ slide, centered = false }: { slide: Slide; centered?: boolean }) {
  return (
    <>
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--dozy-muted)]">
        {slide.title}
      </p>
      <h3
        className={`mt-3 text-[clamp(1.65rem,4vw,2.25rem)] font-light leading-[1.1] tracking-[-0.02em] text-[var(--dozy-ink)] ${centered ? "text-center" : ""}`}
        style={{ fontFamily: displaySerif }}
      >
        {slide.headline}
      </h3>
      <BodyCopy className={`mt-4 max-w-md ${centered ? "mx-auto text-center" : ""}`}>
        {slide.body}
      </BodyCopy>
    </>
  );
}

function TextBlocks({
  textRefs,
  dimmed = false,
}: {
  textRefs: RefObject<(HTMLDivElement | null)[]>;
  dimmed?: boolean;
}) {
  return (
    <div className="flex flex-col gap-12 sm:gap-14">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.title}
          ref={(el) => {
            textRefs.current[index] = el;
          }}
          style={{ opacity: dimmed ? (index === 0 ? 1 : 0.3) : 1 }}
        >
          <SlideCopy slide={slide} />
        </div>
      ))}
    </div>
  );
}

function StackedContent() {
  return (
    <div className="px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
      <div className="mx-auto flex w-full max-w-[980px] flex-col gap-24 sm:gap-32 lg:gap-40">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.title}
            className="flex flex-col items-center gap-10 text-center sm:gap-12"
          >
            <div className="flex w-full justify-center">
              <AppScreenshot
                src={slide.src}
                alt={slide.alt}
                priority={index === 0}
                className="w-[72vw] max-w-[300px] sm:max-w-[280px]"
              />
            </div>
            <div className="w-full max-w-md">
              <SlideCopy slide={slide} centered />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Apple-style pinned scroll on desktop; stacked layout on mobile and reduced motion. */
export function PinnedShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gsapCtxRef = useRef<gsap.Context | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [useStackedLayout, setUseStackedLayout] = useState(true);

  const cleanupGsap = useCallback(() => {
    if (typeof window === "undefined") return;

    scrollTriggerRef.current?.kill(true);
    scrollTriggerRef.current = null;
    gsapCtxRef.current?.revert();
    gsapCtxRef.current = null;
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia(MOBILE_QUERY);

    const update = () => {
      const shouldStack = reducedMq.matches || mobileMq.matches;
      if (shouldStack) {
        cleanupGsap();
      }
      setUseStackedLayout(shouldStack);
    };

    update();
    reducedMq.addEventListener("change", update);
    mobileMq.addEventListener("change", update);

    return () => {
      reducedMq.removeEventListener("change", update);
      mobileMq.removeEventListener("change", update);
    };
  }, [cleanupGsap]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    if (useStackedLayout) {
      cleanupGsap();
      return;
    }

    const pinContainer = pinContainerRef.current;
    if (!pinContainer) return;

    gsap.registerPlugin(ScrollTrigger);

    const images = imageRefs.current.filter((el): el is HTMLDivElement => el != null);
    const texts = textRefs.current.filter((el): el is HTMLDivElement => el != null);
    if (images.length !== SLIDE_COUNT || texts.length !== SLIDE_COUNT) return;

    const ctx = gsap.context(() => {
      gsap.set(images, { opacity: 0 });
      gsap.set(images[0], { opacity: 1 });
      gsap.set(texts, { opacity: 0.3 });
      gsap.set(texts[0], { opacity: 1 });

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: pinContainer,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate: (self) => {
          const t = self.progress * (SLIDE_COUNT - 1);
          const i = Math.min(SLIDE_COUNT - 2, Math.floor(t));
          const frac = t - i;

          images.forEach((img, idx) => {
            let opacity = 0;
            if (idx === i) opacity = 1 - frac;
            else if (idx === i + 1) opacity = frac;
            gsap.set(img, { opacity });
          });

          texts.forEach((block, idx) => {
            let opacity = 0.3;
            if (idx === i) opacity = 0.3 + 0.7 * (1 - frac);
            else if (idx === i + 1) opacity = 0.3 + 0.7 * frac;
            gsap.set(block, { opacity });
          });
        },
      });
    }, pinContainer);

    gsapCtxRef.current = ctx;

    const refresh = () => ScrollTrigger.refresh();
    refresh();
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      cleanupGsap();
    };
  }, [useStackedLayout, cleanupGsap]);

  useLayoutEffect(() => {
    return () => {
      cleanupGsap();
    };
  }, [cleanupGsap]);

  return (
    <section ref={sectionRef} id="showcase" className="relative bg-[var(--dozy-surface)]">
      <div className={useStackedLayout ? undefined : "hidden"} aria-hidden={!useStackedLayout}>
        <StackedContent />
      </div>

      <div
        ref={pinContainerRef}
        className={useStackedLayout ? "hidden" : undefined}
        aria-hidden={useStackedLayout}
      >
        <div className="flex h-[100svh] items-center px-5 sm:px-8">
          <div className="mx-auto grid w-full max-w-[1060px] items-center gap-16 lg:grid-cols-[auto_1fr] lg:gap-24">
            <div className="flex justify-center lg:justify-end">
              <PhoneStack imageRefs={imageRefs} />
            </div>
            <TextBlocks textRefs={textRefs} dimmed />
          </div>
        </div>
      </div>
    </section>
  );
}
