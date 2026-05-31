"use client";

import { GradientBackground } from "@/components/gradient-background";
import { instrumentSerif } from "@/lib/fonts";

/** Full-bleed gradient band — Apple Fitness+ cinematic opener, Dozy colors. */
export function GradientHeroBand() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-end justify-center overflow-hidden bg-black pb-16 pt-24 sm:min-h-[75vh] sm:pb-20">
      <GradientBackground />
      <div className="relative z-10 px-5 text-center sm:px-8">
        <p
          className={`${instrumentSerif.className} text-[clamp(4rem,14vw,8rem)] font-normal leading-none tracking-[-0.03em] text-white`}
        >
          Dozy
        </p>
        <p className="mt-4 text-[clamp(1.1rem,3vw,1.5rem)] font-semibold text-white/90">
          Reads your sleep. Plans your nap.
        </p>
      </div>
    </section>
  );
}
