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
    title: "Apple Watch and iPhone",
    body: "Dozy reads sleep from Apple Health on your iPhone — stages, duration, and trends — then recommends the right nap length and the best window to take it.",
  },
  {
    id: "watch",
    title: "Apple Watch and Dozy",
    body: "Start a nap from your wrist, track the timer on your Ultra, and get a gentle haptic when your power nap window ends — without unlocking your phone.",
  },
  {
    id: "alerts",
    title: "Nap window notifications",
    body: "When your circadian dip lines up with low sleep debt, Dozy nudges you on iPhone and Watch so you can rest before the moment passes.",
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

export function AppleFeatureContainer() {
  const [activeId, setActiveId] = useState(FEATURES[0].id);

  return (
    <div
      className="w-full max-w-5xl rounded-[2rem] bg-[#f5f5f7] px-6 py-8 sm:px-10 sm:py-12"
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
                  <div className="border-t border-neutral-300/80" />
                ) : null}
                <button
                  type="button"
                  onClick={() => setActiveId(feature.id)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="text-[1.05rem] font-semibold leading-snug text-neutral-950 sm:text-[1.15rem]">
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
                    <p className="pb-5 pr-6 text-[0.95rem] leading-relaxed text-neutral-600">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative flex min-h-[300px] items-center justify-center overflow-visible px-2 sm:min-h-[380px]">
          <DeviceShowcase />
        </div>
      </div>
    </div>
  );
}
