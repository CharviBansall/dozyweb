"use client";

import { useState } from "react";
import { DeviceShowcase } from "@/components/device-showcase";

type FeatureItem = {
  id: string;
  title: string;
  body: string;
};

const FEATURES: FeatureItem[] = [
  {
    id: "health",
    title: "Built on Apple Health",
    body: "Dozy works with the sleep data your iPhone and Apple Watch already collect. No extra tracking, no account, no servers — every calculation happens on your device.",
  },
  {
    id: "timer",
    title: "A nap timer that wakes you gently",
    body: "Start a nap from your iPhone or Apple Watch. Dozy counts down and wakes you with a gentle tap on the wrist — then credits the rest toward your sleep debt.",
  },
  {
    id: "privacy",
    title: "Private by design",
    body: "Your health data never leaves your device for us. No ads, no analytics on your health, nothing to sell. What’s yours stays yours.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className={`shrink-0 text-neutral-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type AppleFeatureContainerProps = {
  phoneScreenSrc?: string;
  phoneScreenAlt?: string;
  watchSrc?: string;
};

export function AppleFeatureContainer({
  phoneScreenSrc,
  phoneScreenAlt,
  watchSrc,
}: AppleFeatureContainerProps = {}) {
  const [activeId, setActiveId] = useState(FEATURES[0].id);

  return (
    <div
      className="w-full max-w-5xl rounded-[2rem] bg-[var(--dozy-surface-alt)] px-6 py-8 sm:px-10 sm:py-12"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
      }}
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0">
          {FEATURES.map((feature, index) => {
            const open = activeId === feature.id;
            return (
              <div key={feature.id}>
                {index > 0 ? (
                  <div className="border-t border-[var(--dozy-ink)]/10" />
                ) : null}
                <button
                  type="button"
                  onClick={() => setActiveId(feature.id)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="text-[1.05rem] font-semibold leading-snug text-[var(--dozy-ink)] sm:text-[1.15rem]">
                    {feature.title}
                  </span>
                  <Chevron open={open} />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-6 text-[0.95rem] leading-relaxed text-[var(--dozy-muted)]">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative flex min-h-[300px] items-center justify-center overflow-visible px-2 sm:min-h-[380px]">
          <DeviceShowcase
            phoneScreenSrc={phoneScreenSrc}
            phoneScreenAlt={phoneScreenAlt}
            watchSrc={watchSrc}
          />
        </div>
      </div>
    </div>
  );
}
