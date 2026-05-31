"use client";

import { useState } from "react";
import { Section, SectionHeadline } from "@/components/apple/apple-ui";
import { FAQ } from "@/lib/dozy-content";
import { ScrollReveal } from "@/components/scroll-reveal";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-[#f5f5f7]">
      <ScrollReveal>
        <SectionHeadline>Questions? Answers.</SectionHeadline>
        <ul className="mt-12 divide-y divide-neutral-300/80 rounded-[1.75rem] bg-white px-6 sm:px-8">
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
                  <span className="text-[1.05rem] font-semibold text-[#1d1d1f] sm:text-[1.15rem]">
                    {item.q}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    className={`mt-1.5 shrink-0 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
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
                    <p className="pb-5 text-[17px] leading-[1.47] text-[#6e6e73]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollReveal>
    </Section>
  );
}
