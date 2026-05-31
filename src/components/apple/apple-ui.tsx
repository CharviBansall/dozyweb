import type { ReactNode } from "react";

export const appleSans =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif';

export function ApplePage({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white text-[#1d1d1f]" style={{ fontFamily: appleSans }}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-5 py-16 sm:px-8 sm:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-[980px]">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[17px] font-semibold leading-snug text-[#1d1d1f]">
      {children}
    </p>
  );
}

export function HeroTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="mt-1 text-[clamp(3rem,10vw,5.5rem)] font-semibold leading-[1.05] tracking-tight text-[#1d1d1f]">
      {children}
    </h1>
  );
}

export function HeroSubtitle({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 max-w-xl text-[clamp(1.35rem,4vw,1.75rem)] font-semibold leading-snug text-[#1d1d1f]">
      {children}
    </p>
  );
}

export function SectionHeadline({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-center text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-[#1d1d1f]">
      {children}
    </h2>
  );
}

export function SectionSubhead({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`mt-10 text-[clamp(1.5rem,4vw,2rem)] font-semibold leading-snug text-[#1d1d1f] ${className}`}
    >
      {children}
    </h3>
  );
}

export function BodyCopy({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[17px] leading-[1.47] text-[#6e6e73] ${className}`}
    >
      {children}
    </p>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="text-[17px] text-[#0066cc] hover:underline"
    >
      {children}
    </a>
  );
}
