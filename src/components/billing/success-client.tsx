"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SuccessClient({ sessionId }: { sessionId: string | null }) {
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your subscription…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing checkout session. If you already subscribed, open the app.");
      return;
    }

    let cancelled = false;

    async function complete() {
      try {
        const response = await fetch("/api/checkout/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = (await response.json()) as {
          entitled?: boolean;
          error?: string;
          message?: string;
        };

        if (cancelled) return;

        if (data.entitled) {
          setMessage("You're in — redirecting to Dozy…");
          router.replace("/app");
          return;
        }

        if (response.status === 202) {
          setMessage(
            data.message ||
              "Payment is still processing. We'll unlock access once Stripe confirms.",
          );
          return;
        }

        setError(data.error || "Could not confirm subscription yet.");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Confirmation failed");
        }
      }
    }

    void complete();
    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  return (
    <div className="mx-auto mt-8 max-w-md text-center">
      {error ? (
        <p className="text-[15px] text-red-600" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-[15px] text-[var(--dozy-muted)]">{message}</p>
      )}
      <p className="mt-6">
        <a
          href="/app"
          className="text-[15px] font-medium text-[var(--dozy-accent)] underline-offset-4 hover:underline"
        >
          Continue to app
        </a>
      </p>
    </div>
  );
}
