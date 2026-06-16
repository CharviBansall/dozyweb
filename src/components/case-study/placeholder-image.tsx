type PlaceholderImageProps = {
  label: string;
  className?: string;
  aspect?: "video" | "square" | "portrait";
};

const aspectClass = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
} as const;

export function PlaceholderImage({
  label,
  className = "",
  aspect = "video",
}: PlaceholderImageProps) {
  return (
    <div
      className={`flex ${aspectClass[aspect]} w-full items-center justify-center rounded-[20px] border border-dashed border-white/15 bg-white/[0.03] px-8 py-12 ${className}`}
    >
      <p className="max-w-md text-center text-[13px] leading-relaxed tracking-wide text-white/35">
        {label}
      </p>
    </div>
  );
}
