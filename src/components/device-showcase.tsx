import Image from "next/image";
import { IPhoneBezel } from "@/components/iphone-bezel";

type DeviceShowcaseProps = {
  className?: string;
  priority?: boolean;
};

/** iPhone 17 + Apple Watch Ultra bezels (Bezel mockups), Watch overlapping on the right. */
export function DeviceShowcase({
  className = "",
  priority = false,
}: DeviceShowcaseProps) {
  return (
    <div
      className={`relative flex w-full max-w-[420px] items-center justify-center sm:max-w-[480px] ${className}`}
    >
      <div className="relative z-0 w-[52%] min-w-[160px] shrink-0 sm:min-w-[200px]">
        <IPhoneBezel priority={priority} />
      </div>
      <div className="relative z-10 -ml-[18%] w-[38%] min-w-[120px] shrink-0 sm:-ml-[16%] sm:min-w-[150px]">
        <Image
          src="/devices/watch-ultra-trail.png"
          alt="Apple Watch Ultra with Dozy"
          width={400}
          height={500}
          sizes="(max-width: 640px) 130px, 160px"
          className="h-auto w-full object-contain drop-shadow-xl"
          priority={priority}
        />
      </div>
    </div>
  );
}
