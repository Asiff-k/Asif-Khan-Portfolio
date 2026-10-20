import { getImageProps } from "next/image";
import { stock, type StockKey } from "@/content/stock";

/** A stock photo as a plain optimized <img> (no hydration), filling its frame. */
export function StockImage({ photo, sizes }: { photo: StockKey; sizes: string }) {
  const p = stock[photo];
  const { props } = getImageProps({
    src: p.src,
    width: p.width,
    height: p.height,
    alt: p.alt,
    sizes,
    className: "size-full object-cover",
  });
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
}

/** "Photos: A and B on Unsplash", with links to each photo page. */
export function StockCredit({ photos }: { photos: StockKey[] }) {
  const names = photos.map((k) => stock[k]);
  return (
    <p className="t-stamp mt-3 text-fg-muted">
      {names.length > 1 ? "Stock photos: " : "Stock photo: "}
      {names.map((n, i) => (
        <span key={n.page}>
          {i > 0 && (i === names.length - 1 ? " and " : ", ")}
          <a href={n.page} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            {n.photographer}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </span>
      ))}{" "}
      on Unsplash
    </p>
  );
}
