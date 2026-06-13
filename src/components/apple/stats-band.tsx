"use client";

import { useEffect, useRef, useState } from "react";

import { displaySerif } from "@/components/apple/apple-ui";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const DURATION = 1500;

type Stat = {
  /** Target numeric value the count-up animates toward. */
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 14, label: "days of sleep history analyzed" },
  { value: 100, suffix: "%", label: "on-device — nothing leaves your phone" },
  { value: 1, suffix: ":1", label: "nap credit toward your debt" },
];

/** Animates a single integer from 0 to target once the band scrolls into view. */
function CountUp({ value, prefix = "", suffix = "" }: Stat) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let started = false;

    const animate = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        setDisplay(Math.round(value * easeOutCubic(t)));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            observer.disconnect();
            if (prefersReduced) {
              setDisplay(value);
            } else {
              animate();
            }
          }
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/** Thin editorial band of three count-up stats beneath the hero. */
export function StatsBand() {
  return (
    <section className="border-y border-[var(--dozy-ink)]/10 px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-[980px] grid-cols-3 gap-6 sm:gap-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div
              className="text-[clamp(2.5rem,7vw,4rem)] font-light leading-[1] tracking-[-0.02em] text-[var(--dozy-ink)]"
              style={{ fontFamily: displaySerif }}
            >
              <CountUp {...stat} />
            </div>
            <p className="dozy-body mx-auto mt-3 max-w-[14ch] text-[13px] leading-[1.4] sm:text-[14px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
