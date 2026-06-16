import { ProjectCard } from "@/components/portfolio/project-card";
import { displaySerif } from "@/components/apple/apple-ui";
import { DOZY_PROJECT_CARD } from "@/lib/dozy-case-study";

export function PortfolioHome() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1d1d1f]">
      <header className="mx-auto flex max-w-[980px] items-center justify-between px-5 py-8 sm:px-8 sm:py-10">
        <p
          className="text-[22px] font-light tracking-[-0.02em]"
          style={{ fontFamily: displaySerif }}
        >
          Charvi Bansal
        </p>
        <a
          href="mailto:charvibansal2006@gmail.com"
          className="text-[13px] text-[#86868b] transition-colors hover:text-[#1d1d1f]"
        >
          Contact
        </a>
      </header>

      <main className="mx-auto max-w-[980px] px-5 pb-24 sm:px-8 sm:pb-32">
        <section className="pt-8 sm:pt-12 lg:pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">
            Selected work
          </p>
          <h1
            className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3rem)] font-light leading-[1.08] tracking-[-0.03em]"
            style={{ fontFamily: displaySerif }}
          >
            Product design for health, clarity, and calm interfaces.
          </h1>
        </section>

        <section className="mt-16 sm:mt-20 lg:mt-24">
          <ProjectCard {...DOZY_PROJECT_CARD} />
        </section>
      </main>
    </div>
  );
}
