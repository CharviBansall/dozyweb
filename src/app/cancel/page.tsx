import Link from "next/link";
import { ApplePage, PrimaryLink } from "@/components/apple/apple-ui";

export const metadata = {
  title: "Checkout canceled · Dozy",
};

export default function CancelPage() {
  return (
    <ApplePage>
      <main className="mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-5 py-16 text-center sm:px-8">
        <h1
          className="text-[clamp(2.5rem,8vw,3.75rem)] font-light leading-[1.05] tracking-[-0.03em] text-[var(--dozy-ink)]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          Checkout canceled
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[var(--dozy-muted)]">
          No charge was made. You can restart the 3-day trial whenever you&apos;re
          ready.
        </p>
        <p className="mt-8">
          <PrimaryLink href="/subscribe">Try again</PrimaryLink>
        </p>
        <p className="mt-6 text-[14px] text-[var(--dozy-muted)]">
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </main>
    </ApplePage>
  );
}
