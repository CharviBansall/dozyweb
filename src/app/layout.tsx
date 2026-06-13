import type { Metadata } from "next";
import { instrumentSerif } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dozy",
  description:
    "Dozy reads your sleep and tells you exactly how much rest you owe yourself — then finds the perfect nap to catch up. Powered entirely by Apple Health.",
  openGraph: {
    title: "Dozy",
    siteName: "Dozy",
  },
  twitter: {
    title: "Dozy",
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
