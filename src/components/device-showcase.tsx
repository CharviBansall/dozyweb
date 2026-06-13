"use client";

import { IPhoneBezel } from "@/components/iphone-bezel";
import { WatchBezel } from "@/components/watch-bezel";

type DeviceShowcaseProps = {
  className?: string;
  priority?: boolean;
  phoneScreenSrc?: string;
  phoneScreenAlt?: string;
  watchSrc?: string;
  /** Soft cyan-to-blue radial glow behind the devices. */
  glow?: boolean;
  /** Gentle infinite floating motion. */
  float?: boolean;
};

/** iPhone 17 + Apple Watch Ultra bezels (Bezel mockups), Watch overlapping on the right. */
export function DeviceShowcase({
  className = "",
  priority = false,
  phoneScreenSrc,
  phoneScreenAlt,
  watchSrc,
  glow = false,
  float = false,
}: DeviceShowcaseProps) {
  return (
    <div
      className={`relative flex w-full max-w-[420px] items-center justify-center sm:max-w-[480px] ${className}`}
    >
      {glow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(94,198,242,0.32) 0%, rgba(63,109,255,0.16) 45%, transparent 72%)",
          }}
        />
      ) : null}
      <div
        className={`relative flex w-full items-center justify-center ${float ? "dozy-float" : ""}`}
      >
        <div className="relative z-0 w-[52%] min-w-[160px] shrink-0 sm:min-w-[200px]">
          <IPhoneBezel
            priority={priority}
            screenSrc={phoneScreenSrc}
            screenAlt={phoneScreenAlt}
          />
        </div>
        <div className="relative z-10 -ml-[18%] w-[38%] min-w-[120px] shrink-0 sm:-ml-[16%] sm:min-w-[150px]">
          <WatchBezel priority={priority} src={watchSrc} />
        </div>
      </div>
    </div>
  );
}
