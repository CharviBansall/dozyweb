"use client";

import dynamic from "next/dynamic";

const LandingPage = dynamic(
  () => import("@/components/landing-page").then((m) => m.LandingPage),
  {
    ssr: false,
    loading: () => (
      <div
        className="dozy-hero-gradient min-h-[88vh] bg-black"
        aria-busy="true"
        aria-label="Loading Dozy"
      />
    ),
  },
);

export function ClientLandingPage() {
  return <LandingPage />;
}
