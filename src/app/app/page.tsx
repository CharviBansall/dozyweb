import Link from "next/link";
import { ApplePage } from "@/components/apple/apple-ui";
import { PortalButton } from "@/components/billing/portal-button";
import { requireEntitlement } from "@/lib/access";

export const metadata = {
  title: "App · Dozy",
};

export default async function AppHomePage() {
  const entitlement = await requireEntitlement();
  const periodEnd = entitlement.currentPeriodEnd
    ? new Date(entitlement.currentPeriodEnd * 1000).toLocaleDateString()
    : null;

  return (
    <ApplePage>
      <main className="mx-auto min-h-screen max-w-[720px] px-5 py-16 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-[22px] font-light tracking-[-0.02em] text-[var(--dozy-ink)]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            Dozy
          </Link>
          <PortalButton />
        </header>

        <section className="mt-16">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--dozy-muted)]">
            Your plan
          </p>
          <h1
            className="mt-3 text-[clamp(2.5rem,8vw,3.5rem)] font-light leading-[1.05] tracking-[-0.03em] text-[var(--dozy-ink)]"
            style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
          >
            You&apos;re subscribed
          </h1>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-[var(--dozy-muted)]">
            Web access is unlocked while your subscription is{" "}
            <span className="text-[var(--dozy-ink)]">{entitlement.status}</span>
            {entitlement.email ? (
              <>
                {" "}
                for <span className="text-[var(--dozy-ink)]">{entitlement.email}</span>
              </>
            ) : null}
            .
          </p>

          <dl className="mt-10 grid gap-4 rounded-[1.75rem] bg-[var(--dozy-surface-alt)] p-6 text-left text-[15px] sm:grid-cols-2">
            <div>
              <dt className="text-[var(--dozy-muted)]">Status</dt>
              <dd className="mt-1 font-medium capitalize text-[var(--dozy-ink)]">
                {entitlement.status}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--dozy-muted)]">Price</dt>
              <dd className="mt-1 font-medium text-[var(--dozy-ink)]">$19 / month</dd>
            </div>
            {periodEnd ? (
              <div>
                <dt className="text-[var(--dozy-muted)]">
                  {entitlement.status === "trialing" ? "Trial ends" : "Renews"}
                </dt>
                <dd className="mt-1 font-medium text-[var(--dozy-ink)]">{periodEnd}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-[var(--dozy-muted)]">Cancel at period end</dt>
              <dd className="mt-1 font-medium text-[var(--dozy-ink)]">
                {entitlement.cancelAtPeriodEnd ? "Yes" : "No"}
              </dd>
            </div>
          </dl>

          <p className="mt-8 text-[15px] leading-relaxed text-[var(--dozy-muted)]">
            This is the gated web shell for Dozy Pro. Use Manage subscription to update
            payment methods or cancel via the Stripe Customer Portal.
          </p>
        </section>
      </main>
    </ApplePage>
  );
}
