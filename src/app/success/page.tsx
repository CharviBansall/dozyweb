import Link from "next/link";
import { ApplePage } from "@/components/apple/apple-ui";
import { SuccessClient } from "@/components/billing/success-client";

export const metadata = {
  title: "Welcome · Dozy",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;

  return (
    <ApplePage>
      <main className="mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-5 py-16 text-center sm:px-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--dozy-muted)]">
          Dozy Pro
        </p>
        <h1
          className="mt-3 text-[clamp(2.5rem,8vw,3.75rem)] font-light leading-[1.05] tracking-[-0.03em] text-[var(--dozy-ink)]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          Trial started
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[var(--dozy-muted)]">
          Thanks for joining. We&apos;re confirming your subscription with Stripe.
        </p>
        <SuccessClient sessionId={params.session_id ?? null} />
        <p className="mt-10 text-[14px] text-[var(--dozy-muted)]">
          <Link href="/" className="underline-offset-4 hover:underline">
            Home
          </Link>
        </p>
      </main>
    </ApplePage>
  );
}
