import Link from "next/link";
import { CaseStudySection } from "@/components/case-study/case-study-section";
import { PlaceholderImage } from "@/components/case-study/placeholder-image";
import { displaySerif } from "@/components/apple/apple-ui";
import { DOZY_CASE_STUDY } from "@/lib/dozy-case-study";

export function DozyCaseStudyPage() {
  const { hero, meta, sections } = DOZY_CASE_STUDY;

  return (
    <div className="min-h-screen bg-[#07070d] text-white">
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#07070d]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[980px] items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="text-[13px] text-white/50 transition-colors hover:text-white"
          >
            ← Work
          </Link>
          <span
            className="text-[18px] font-light tracking-[-0.02em] text-white/90"
            style={{ fontFamily: displaySerif }}
          >
            Dozy
          </span>
          <Link
            href="/product"
            className="text-[13px] text-white/50 transition-colors hover:text-white"
          >
            Live site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[980px] px-5 pb-32 sm:px-8">
        <section className="pt-20 sm:pt-28 lg:pt-36">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
            Case study
          </p>
          <h1
            className="mt-6 max-w-4xl text-[clamp(2.5rem,7vw,4.75rem)] font-light leading-[1.02] tracking-[-0.03em] text-white"
            style={{ fontFamily: displaySerif }}
          >
            {hero.title}
          </h1>
          <p className="mt-8 max-w-2xl text-[clamp(1.05rem,2.5vw,1.35rem)] leading-[1.55] text-white/55">
            {hero.subtitle}
          </p>

          <dl className="mt-16 grid gap-10 border-t border-white/8 pt-12 sm:grid-cols-3 sm:gap-8">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Role
              </dt>
              <dd className="mt-3 text-[15px] leading-relaxed text-white/70">{meta.role}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Timeline
              </dt>
              <dd className="mt-3 text-[15px] text-white/70">{meta.timeline}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Focus
              </dt>
              <dd className="mt-3 text-[15px] leading-relaxed text-white/70">{meta.focus}</dd>
            </div>
          </dl>

          <div className="mt-16 sm:mt-20">
            <PlaceholderImage
              label="Hero — Dozy app on iPhone & Apple Watch"
              aspect="video"
            />
          </div>
        </section>

        {sections.map((section, index) => (
          <CaseStudySection
            key={section.id}
            {...section}
            imageAspect={index === sections.length - 2 ? "portrait" : "video"}
          />
        ))}

        <footer className="mt-24 border-t border-white/8 pt-16 text-center sm:mt-32">
          <p className="text-[13px] text-white/40">Next project coming soon.</p>
          <Link
            href="/"
            className="mt-6 inline-flex text-[15px] text-white/70 transition-colors hover:text-white"
          >
            Back to work
          </Link>
        </footer>
      </main>
    </div>
  );
}
