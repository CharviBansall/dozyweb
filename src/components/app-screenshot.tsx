import Image from "next/image";

type AppScreenshotProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/** App screenshot with consistent 20px radius and soft shadow. */
export function AppScreenshot({
  src,
  alt,
  className = "",
  priority = false,
}: AppScreenshotProps) {
  return (
    <div className={`dozy-media ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={473}
        height={1024}
        className="block h-auto w-full"
        sizes="(max-width: 640px) 72vw, 280px"
        priority={priority}
      />
    </div>
  );
}
