export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--dozy-ink)]/10 bg-[var(--dozy-surface)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between px-5 sm:px-8">
        <span
          className="text-[22px] font-light tracking-[-0.02em] text-[var(--dozy-ink)]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          Dozy
        </span>
        <nav className="flex items-center gap-8 text-[13px] text-[var(--dozy-muted)]">
          <a href="#highlights" className="transition-colors hover:text-[var(--dozy-ink)]">
            Overview
          </a>
          <a href="#showcase" className="transition-colors hover:text-[var(--dozy-ink)]">
            Plans
          </a>
          <a href="#faq" className="transition-colors hover:text-[var(--dozy-ink)]">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}
