import type { Metadata } from "next";
import { instrumentSerif } from "@/lib/fonts";
import "./globals.css";

const siteUrl = "https://www.appdozy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Charvi Bansal",
    template: "%s · Charvi Bansal",
  },
  description: "Product design for health, clarity, and calm interfaces.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Charvi Bansal",
    siteName: "Charvi Bansal",
    description: "Product design for health, clarity, and calm interfaces.",
    url: siteUrl,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charvi Bansal",
    description: "Product design for health, clarity, and calm interfaces.",
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
