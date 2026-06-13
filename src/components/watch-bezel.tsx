import Image from "next/image";

type WatchBezelProps = {
  priority?: boolean;
  className?: string;
  src?: string;
};

/** Watch Ultra bezel with Dozy screen baked into the PNG for pixel-perfect fit. */
export function WatchBezel({
  priority = false,
  className = "",
  src = "/devices/watch-ultra-dozy-v2.png",
}: WatchBezelProps) {
  return (
    <Image
      src={src}
      alt="Apple Watch Ultra with Dozy"
      width={600}
      height={960}
      className={`block h-auto w-full object-contain dozy-device-shadow ${className}`}
      priority={priority}
    />
  );
}
