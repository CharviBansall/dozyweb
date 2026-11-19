"use client";

import Image from "next/image";

type IPhoneBezelProps = {
  priority?: boolean;
  className?: string;
  screenSrc?: string;
  screenAlt?: string;
};

/** Screen mask tuned for Bezel iPhone 17 Mist Blue portrait (1350×2760). */
const SCREEN_INSET = {
  // The frame's transparent cutout starts 5.3% in from the sides and 2.5%
  // from the top and bottom. The screen sits behind the frame and tucks a
  // little under it, so the frame always stays visible.
  top: "2.1%",
  left: "4.7%",
  right: "4.7%",
  bottom: "2.1%",
  // Elliptical radius matches the inner display curve (w / h)
  borderRadius: "12.2% / 5.35%",
} as const;

export function IPhoneBezel({
  priority = false,
  className = "",
  screenSrc = "/devices/dozy-v2-today-screen.png",
  screenAlt = "Dozy Today screen: today\u2019s one thing and the sleep rings",
}: IPhoneBezelProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Image
        src="/devices/iphone-17-mist-blue-portrait.png"
        alt=""
        width={1350}
        height={2760}
        className="pointer-events-none relative z-10 block h-auto w-full object-contain dozy-device-shadow"
        priority={priority}
        aria-hidden
      />
      <div
        className="absolute z-0 overflow-hidden bg-black"
        style={{
          top: SCREEN_INSET.top,
          left: SCREEN_INSET.left,
          right: SCREEN_INSET.right,
          bottom: SCREEN_INSET.bottom,
          borderRadius: SCREEN_INSET.borderRadius,
        }}
      >
        <Image
          src={screenSrc}
          alt={screenAlt}
          width={402}
          height={874}
          className="h-full w-full object-cover object-center"
          priority={priority}
        />
      </div>
    </div>
  );
}
