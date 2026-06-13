"use client";

import { useState } from "react";
import { BodyCopy, Section, SectionHeadline } from "@/components/apple/apple-ui";
import { FAQ } from "@/lib/dozy-content";
import { ScrollReveal } from "@/components/scroll-reveal";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq">
      <ScrollReveal>
        <SectionHeadline>Frequently asked questions</SectionHeadline>
      </ScrollReveal>
      <ScrollReveal
        as="ul"
        stagger={80}
        className="mt-16 divide-y divide-[var(--dozy-ink)]/10 rounded-[20px] bg-[var(--dozy-card)] px-6 sm:mt-20 sm:px-8"
      >
        {FAQ.map((item, index) => {
            const open = openIndex === index;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                  aria-expanded={open}
                >
                  <span className="text-[1.05rem] font-semibold text-[var(--dozy-ink)] sm:text-[1.15rem]">
                    {item.q}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    className={`mt-1.5 shrink-0 text-[var(--dozy-muted)] transition-transform ${open ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    <path
                      d="M2.5 4.5L6 8l3.5-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <BodyCopy className="pb-6">{item.a}</BodyCopy>
                  </div>
                </div>
              </li>
            );
          })}
      </ScrollReveal>
    </Section>
  );
}
