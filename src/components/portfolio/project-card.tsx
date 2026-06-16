import Link from "next/link";
import { displaySerif } from "@/components/apple/apple-ui";

type ProjectCardProps = {
  title: string;
  subtitle: string;
  label: string;
  href: string;
};

export function ProjectCard({ title, subtitle, label, href }: ProjectCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[24px] bg-[#0a0a12] p-8 sm:p-10 lg:p-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 100%, rgba(88,96,214,0.22) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(94,198,242,0.12) 0%, transparent 50%), linear-gradient(165deg, #0a0a12 0%, #12121f 50%, #0d0d16 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/[0.08] transition-colors group-hover:ring-white/[0.14]"
      />

      <div className="relative z-10 flex min-h-[280px] flex-col justify-between sm:min-h-[320px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:text-[11px]">
          {label}
        </p>

        <div>
          <h2
            className="text-[clamp(2.75rem,8vw,4.5rem)] font-light leading-[0.95] tracking-[-0.03em] text-white"
            style={{ fontFamily: displaySerif }}
          >
            {title}
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/55 sm:text-[17px]">
            {subtitle}
          </p>
          <p className="mt-8 text-[13px] font-medium text-white/40 transition-colors group-hover:text-white/70">
            View case study →
          </p>
        </div>
      </div>
    </Link>
  );
}
