import type { ReactNode } from "react";

export const appleSans =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif';

// Light-weight editorial serif for display headlines (Oura "Editorial New" vibe).
export const displaySerif = "var(--font-instrument-serif), Georgia, serif";

export function ApplePage({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-[var(--dozy-ink)]"
      style={{ fontFamily: appleSans, backgroundColor: "var(--dozy-surface)" }}
    >
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
    <section id={id} className={`px-5 py-24 sm:px-8 sm:py-32 lg:py-40 ${className}`}>
      <div className="mx-auto w-full max-w-[980px]">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--dozy-muted)]">
      {children}
    </p>
  );
}

export function HeroTitle({ children }: { children: ReactNode }) {
  return (
    <h1
      className="mt-2 text-[clamp(3.5rem,12vw,7.5rem)] font-light leading-[0.96] tracking-[-0.03em] text-[var(--dozy-ink)]"
      style={{ fontFamily: displaySerif }}
    >
      {children}
    </h1>
  );
}

export function HeroSubtitle({ children }: { children: ReactNode }) {
  return (
    <p
      className="mt-5 max-w-xl text-[clamp(1.75rem,5vw,2.75rem)] font-light leading-[1.08] tracking-[-0.02em] text-[var(--dozy-ink)]"
      style={{ fontFamily: displaySerif }}
    >
      {children}
    </p>
  );
}

export function SectionHeadline({ children }: { children: ReactNode }) {
  return (
    <h2
      className="text-center text-[clamp(2.75rem,7.5vw,5.25rem)] font-light leading-[1.02] tracking-[-0.03em] text-[var(--dozy-ink)]"
      style={{ fontFamily: displaySerif }}
    >
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
      className={`mt-16 text-[clamp(1.85rem,4.5vw,2.75rem)] font-light leading-[1.08] tracking-[-0.02em] text-[var(--dozy-ink)] ${className}`}
      style={{ fontFamily: displaySerif }}
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
    <p className={`dozy-body ${className}`}>
      {children}
    </p>
  );
}

export function PrimaryLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center justify-center rounded-full bg-[var(--dozy-accent)] px-7 py-3 text-[15px] font-medium text-[var(--dozy-accent-ink)] transition-opacity hover:opacity-90"
    >
      {children}
    </a>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-[var(--dozy-ink)]/20 px-7 py-3 text-[15px] font-medium text-[var(--dozy-ink)] transition-colors hover:bg-[var(--dozy-ink)]/5"
    >
      {children}
    </a>
  );
}
