import type { Metadata } from "next";
import { ClientLandingPage } from "@/components/client-landing-page";

const siteUrl = "https://www.appdozy.com";

export const metadata: Metadata = {
  title: "Dozy",
  description: "Rest smarter. Nap on time. Wake up sharp.",
  openGraph: {
    title: "Dozy",
    siteName: "Dozy",
    description: "Rest smarter. Nap on time. Wake up sharp.",
    url: `${siteUrl}/product`,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        secureUrl: `${siteUrl}/og.jpg`,
        width: 1200,
        height: 629,
        type: "image/jpeg",
        alt: "Dozy — Rest smarter. Nap on time.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dozy",
    description: "Rest smarter. Nap on time. Wake up sharp.",
    images: [`${siteUrl}/og.jpg`],
  },
};

export default function ProductPage() {
  return <ClientLandingPage />;
}
