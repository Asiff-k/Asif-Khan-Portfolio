import { getImageProps } from "next/image";
import { preload } from "react-dom";
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

/**
 * A processed asset at its real size, with the optimizer's srcset. Rendered as
 * a plain <img> from getImageProps, so it adds nothing to hydration (next/image
 * is a client component). Only priority (above the fold) images get the blur
 * placeholder: each one is an SVG blur filter the browser has to paint, and
 * lazy images below the fold sit on the frame's surface colour instead.
 */
export function MediaImage({ image, alt, sizes, className, priority, unoptimized }: Props) {
  const asset = media[image];
  const { props } = getImageProps({
    src: asset.src,
    width: asset.width,
    height: asset.height,
    alt,
    sizes,
    ...(priority ? { placeholder: "blur" as const, blurDataURL: asset.blurDataURL } : {}),
    unoptimized,
    className,
    ...(priority ? { loading: "eager", fetchPriority: "high" } : {}),
  });
  if (priority && props.srcSet) {
    preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: "high" });
  }
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
}
