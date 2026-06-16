"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef, useState } from "react";

/** Dozy brand palette: Core, Deep, Bedtime */
export const DOZY_GRADIENT_COLORS = [
  "hsl(210, 80%, 60%)",
  "hsl(235, 60%, 40%)",
  "hsl(230, 85%, 73%)",
] as const;

const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
  { ssr: false },
);

export function GradientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showShader, setShowShader] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const node = containerRef.current;
    if (!node) return;

    const mountShader = () => {
      if (node.offsetWidth > 0 && node.offsetHeight > 0) {
        setShowShader(true);
        return true;
      }
      return false;
    };

    if (mountShader()) return;

    const observer = new ResizeObserver(() => {
      if (mountShader()) observer.disconnect();
    });
    observer.observe(node);

    const frame = window.requestAnimationFrame(() => {
      if (mountShader()) observer.disconnect();
    });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="dozy-hero-gradient pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {showShader ? (
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
