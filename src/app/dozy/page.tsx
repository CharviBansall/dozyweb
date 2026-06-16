import type { Metadata } from "next";
import { DozyCaseStudyPage } from "@/components/case-study/dozy-case-study-page";

export const metadata: Metadata = {
  title: "Dozy — Case Study",
  description:
    "How Dozy helps students recover sleep without guessing when to nap — a product design case study.",
  openGraph: {
    title: "Dozy — Case Study",
    description:
      "Helping students recover sleep without guessing when to nap.",
  },
};

export default function DozyCaseStudyRoute() {
  return <DozyCaseStudyPage />;
}
