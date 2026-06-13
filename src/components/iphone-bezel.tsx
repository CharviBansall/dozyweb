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
  top: "2.45%",
  left: "4.05%",
  right: "4.05%",
  bottom: "2.25%",
  // Elliptical radius matches the inner display curve (w / h)
  borderRadius: "12.2% / 5.35%",
  scale: 1.045,
} as const;

export function IPhoneBezel({
  priority = false,
  className = "",
  screenSrc = "/devices/dozy-splash-screen.png",
  screenAlt = "Dozy — reads your sleep, plans your nap",
}: IPhoneBezelProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Image
        src="/devices/iphone-17-mist-blue-portrait.png"
        alt=""
        width={1350}
        height={2760}
        className="relative block h-auto w-full object-contain dozy-device-shadow"
        priority={priority}
        aria-hidden
      />
      <div
        className="absolute z-10 overflow-hidden bg-black"
        style={{
          top: SCREEN_INSET.top,
          left: SCREEN_INSET.left,
          right: SCREEN_INSET.right,
          bottom: SCREEN_INSET.bottom,
          borderRadius: SCREEN_INSET.borderRadius,
          transform: `scale(${SCREEN_INSET.scale})`,
          transformOrigin: "center center",
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
