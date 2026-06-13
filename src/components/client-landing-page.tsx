"use client";

import dynamic from "next/dynamic";

const LandingPage = dynamic(
  () => import("@/components/landing-page").then((m) => m.LandingPage),
  { ssr: false },
);

export function ClientLandingPage() {
  return <LandingPage />;
}
