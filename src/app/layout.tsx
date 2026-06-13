import type { Metadata } from "next";
import { instrumentSerif } from "@/lib/fonts";
import "./globals.css";

const siteUrl = "https://www.appdozy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Dozy",
  description: "Rest smarter. Nap on time. Wake up sharp.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Dozy",
    siteName: "Dozy",
    description: "Rest smarter. Nap on time. Wake up sharp.",
    url: siteUrl,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <body>{children}</body>
    </html>
  );
}
