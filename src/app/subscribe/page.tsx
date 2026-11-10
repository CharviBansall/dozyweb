import Link from "next/link";
import { ApplePage } from "@/components/apple/apple-ui";
import { SubscribeForm } from "@/components/billing/subscribe-form";

export const metadata = {
  title: "Subscribe · Dozy",
  description: "Start a 3-day free trial of Dozy Pro — $19/month after trial.",
};

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; next?: string }>;
}) {
  const params = await searchParams;
  const expired = params.reason === "expired";

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
          $19/month
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[var(--dozy-muted)]">
          3-day free trial, then subscribe to keep using Dozy on the web — same plan
          as iOS.
        </p>
        {expired ? (
          <p className="mt-4 rounded-2xl bg-[var(--dozy-surface-alt)] px-4 py-3 text-[14px] text-[var(--dozy-ink)]">
            Your trial or subscription is no longer active. Resubscribe to continue.
          </p>
        ) : null}
        <SubscribeForm />
        <p className="mt-10 text-[14px] text-[var(--dozy-muted)]">
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </main>
    </ApplePage>
  );
}
