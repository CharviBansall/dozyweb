"use client";

import { useEffect, useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";

/** Dozy brand palette: Core, Deep, Bedtime */
export const DOZY_GRADIENT_COLORS = [
  "hsl(210, 80%, 60%)",
  "hsl(235, 60%, 40%)",
  "hsl(230, 85%, 73%)",
] as const;

export function GradientBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden
    >
      {mounted ? (
        <GrainGradient
          style={{ height: "100%", width: "100%" }}
          colorBack="hsl(0, 0%, 0%)"
          softness={0.76}
          intensity={0.45}
          noise={0}
          shape="corners"
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
          colors={[...DOZY_GRADIENT_COLORS]}
        />
      ) : null}
    </div>
  );
}
