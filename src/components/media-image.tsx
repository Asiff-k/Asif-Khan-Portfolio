import Image from "next/image";
import { media, type MediaKey } from "@/content/media.generated";

type Props = {
  image: MediaKey;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Skip the optimizer, for very tall screenshots served as-is. */
  unoptimized?: boolean;
};

/** next/image for a processed asset, with its real size and blur placeholder. */
export function MediaImage({ image, alt, sizes, className, priority, unoptimized }: Props) {
  const asset = media[image];
  return (
    <Image
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={alt}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={asset.blurDataURL}
      preload={priority}
      unoptimized={unoptimized}
      className={className}
    />
  );
}
