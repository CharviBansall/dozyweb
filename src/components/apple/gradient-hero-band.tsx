"use client";

import { GradientBackground } from "@/components/gradient-background";
import { instrumentSerif } from "@/lib/fonts";

/** Full-bleed gradient hero — Oura-style centered opener, Dozy colors. */
export function GradientHeroBand() {
  return (
    <section className="dozy-hero-gradient relative isolate flex min-h-[88vh] flex-col items-center justify-center overflow-hidden bg-black px-5 py-32 text-center sm:px-8 sm:py-40">
      <GradientBackground />
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-white/80">
          Rest smarter. Nap on time.
        </p>
        <p
          className={`${instrumentSerif.className} mt-4 text-[clamp(4.5rem,15vw,9rem)] font-normal leading-[0.9] tracking-[-0.03em] text-white`}
        >
          Dozy
        </p>
        <p className="mt-6 max-w-xl text-[clamp(1.1rem,3vw,1.5rem)] font-medium text-white/90">
          Rest smarter. Nap on time. Wake up sharp.
        </p>
        <a
          href="#highlights"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-[var(--dozy-accent)] px-8 py-3 text-[16px] font-semibold text-[var(--dozy-accent-ink)] transition-transform duration-200 hover:scale-[1.03]"
        >
          Explore
        </a>
      </div>
    </section>
  );
}
