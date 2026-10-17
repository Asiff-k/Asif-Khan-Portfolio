import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site-url";
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
      className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="t-label sr-only z-50 bg-ink px-4 py-3 text-stone focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
