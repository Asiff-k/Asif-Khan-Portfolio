import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { CinemaRoot } from "@/components/cinema/cinema-root";
import { introScript } from "@/components/cinema/intro";
import { StageLoader } from "@/components/cinema/stage-loader";
import { Overlays } from "@/components/cinema/overlays";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site-url";
import "lenis/dist/lenis.css";
import "./globals.css";

// The whole portfolio is static. The build fails if any route needs
// request-time server rendering.
export const ensureStatic = "navigation";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Asiful Hasan Khan · Software developer and UI/UX designer",
    template: "%s · Asiful Hasan Khan",
  },
  description:
    "Portfolio of Asiful Hasan Khan, a final-year CSE student in Sylhet, Bangladesh, who builds web apps and designs interfaces.",
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The intro script adds a class before hydration; only <html> attributes are exempt.
      suppressHydrationWarning
      className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Decides before first paint whether the hero intro plays. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-dvh">
        <div aria-hidden className="intro-bar intro-bar--top" />
        <div aria-hidden className="intro-bar intro-bar--bottom" />
        <a
          href="#main"
          className="t-label sr-only z-50 bg-ink px-4 py-3 text-stone focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <StageLoader />
        <Overlays />
        <CinemaRoot />
      </body>
    </html>
  );
}
