import type { Metadata } from "next";
import { instrumentSerif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.appdozy.com"),
  title: "Dozy",
  description:
    "Rest smarter. Nap on time. Wake up sharp.",
  openGraph: {
    title: "Dozy",
    siteName: "Dozy",
    description: "Rest smarter. Nap on time. Wake up sharp.",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1024,
        height: 537,
        alt: "Dozy — Rest smarter. Nap on time.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dozy",
    description: "Rest smarter. Nap on time. Wake up sharp.",
    images: ["/og.jpg"],
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
