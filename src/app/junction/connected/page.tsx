import Link from "next/link";
import { ApplePage } from "@/components/apple/apple-ui";

export const metadata = {
  title: "Connected · Dozy",
};

export default async function JunctionConnectedPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; provider?: string }>;
}) {
  const params = await searchParams;
  const ok = params.state === "success";
  const provider = params.provider || "your tracker";

  return (
    <ApplePage>
      <main className="mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-5 py-16 text-center sm:px-8">
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--dozy-muted)]">
          Sleep sources
        </p>
        <h1
          className="mt-3 text-[clamp(2.5rem,8vw,3.5rem)] font-light leading-[1.05] tracking-[-0.03em] text-[var(--dozy-ink)]"
          style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif" }}
        >
          {ok ? "Connected" : "Almost there"}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-[var(--dozy-muted)]">
          {ok
            ? `${provider} is linked. Return to the Dozy app — sleep will sync shortly.`
            : "Finish connecting in the Dozy app if this page didn’t confirm success."}
        </p>
        <p className="mt-10 text-[14px] text-[var(--dozy-muted)]">
          <Link href="/" className="underline-offset-4 hover:underline">
            Home
          </Link>
        </p>
      </main>
    </ApplePage>
  );
}
