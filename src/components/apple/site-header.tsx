export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between px-5 sm:px-8">
        <span className="text-[19px] font-semibold tracking-tight text-[#1d1d1f]">
          Dozy
        </span>
        <nav className="flex items-center gap-6 text-[12px] text-[#1d1d1f]/80">
          <a href="#highlights" className="hover:text-[#1d1d1f]">
            Overview
          </a>
          <a href="#plans" className="hover:text-[#1d1d1f]">
            Plans
          </a>
          <a href="#faq" className="hover:text-[#1d1d1f]">
            FAQ
          </a>
        </nav>
      </div>
    </header>
  );
}
