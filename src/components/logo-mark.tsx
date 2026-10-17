import Image from "next/image";
import { logos, type LogoKey } from "@/content/logos.generated";
import { DownloadIcon, PhoneIcon } from "./icons";

const sizes = { xs: 20, sm: 32, md: 44, lg: 56 } as const;

/**
 * An official logo at a consistent size, in its own colours and proportions.
 * App Store icons fill the square; other brand marks are fitted inside it with
 * no added background. A tool without a verified logo keeps an empty space of
 * the same size so text stays aligned; no placeholder artwork is drawn.
 */
export function LogoMark({
  logo,
  name,
  size = "md",
  className = "",
}: {
  logo?: LogoKey;
  name: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const px = sizes[size];
  if (!logo) {
    return <span aria-hidden data-no-logo={name} style={{ width: px, height: px }} className={`shrink-0 ${className}`} />;
  }
  const asset = logos[logo];
  const appIcon = asset.kind === "App Store icon";
  return (
    <span style={{ width: px, height: px }} className={`flex shrink-0 items-center justify-center ${className}`}>
      <Image
        src={asset.src}
        alt=""
        width={160}
        height={160}
        unoptimized
        className={appIcon ? "size-full object-cover" : "size-[86%] object-contain"}
      />
    </span>
  );
}

type ContactLike = { label: string; logo?: LogoKey; icon?: "phone" | "cv" } & Record<string, unknown>;

/** Small icon for a contact method: the platform's own icon, or a simple line icon for phone and CV. */
export function ContactIcon({
  contact,
  size = "xs",
  onLight = false,
}: {
  contact: ContactLike;
  size?: "xs" | "sm";
  /** Use the darker accent for line icons on light backgrounds. */
  onLight?: boolean;
}) {
  if (contact.logo) return <LogoMark logo={contact.logo} name={contact.label} size={size} />;
  const px = sizes[size];
  return (
    <span
      aria-hidden
      style={{ width: px, height: px }}
      className={`flex shrink-0 items-center justify-center ${onLight ? "text-moss" : "text-mint"}`}
    >
      {contact.icon === "phone" ? <PhoneIcon /> : <DownloadIcon />}
    </span>
  );
}
