import { PlaceholderImage } from "@/components/case-study/placeholder-image";
import { displaySerif } from "@/components/apple/apple-ui";

type CaseStudySectionProps = {
  id: string;
  phase: string;
  headline: string;
  body: string;
  imageLabel: string;
  imageAspect?: "video" | "square" | "portrait";
};

export function CaseStudySection({
  id,
  phase,
  headline,
  body,
  imageLabel,
  imageAspect = "video",
}: CaseStudySectionProps) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/8 py-24 sm:py-32 lg:py-40">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
        {phase}
      </p>
      <h2
        className="mt-6 max-w-4xl text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.08] tracking-[-0.03em] text-white"
        style={{ fontFamily: displaySerif }}
      >
        {headline}
      </h2>
      <p className="mt-8 max-w-2xl text-[17px] leading-[1.65] text-white/55">{body}</p>
      <div className="mt-14 sm:mt-16">
        <PlaceholderImage label={imageLabel} aspect={imageAspect} />
      </div>
    </section>
  );
}
