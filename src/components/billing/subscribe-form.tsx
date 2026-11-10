"use client";

import { useState, type FormEvent } from "react";

export function SubscribeForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() || undefined }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 w-full max-w-md space-y-4">
      <label className="block text-left text-[13px] font-medium text-[var(--dozy-muted)]">
        Email
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[var(--dozy-ink)]/10 bg-white px-4 py-3 text-[16px] text-[var(--dozy-ink)] outline-none ring-[var(--dozy-accent)] focus:ring-2"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--dozy-accent)] px-7 py-3 text-[15px] font-medium text-[var(--dozy-accent-ink)] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Redirecting…" : "Start 3-day free trial"}
      </button>
      {error ? (
        <p className="text-center text-[14px] text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <p className="text-center text-[13px] leading-relaxed text-[var(--dozy-muted)]">
        $19/month after trial. Cancel anytime in the customer portal.
      </p>
    </form>
  );
}
