import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ashvi.tech"),
  title: {
    default: "AshviTech — Building AI-Native Businesses",
    template: "%s | AshviTech",
  },
  description:
    "AshviTech is an AI-native technology company building new businesses with domain experts and exploring how intelligent systems can transform existing operations.",
  alternates: {
    canonical: "https://ashvi.tech",
  },
  openGraph: {
    type: "website",
    url: "https://ashvi.tech",
    siteName: "AshviTech",
    title: "AshviTech — Building AI-Native Businesses",
    description:
      "AshviTech is an AI-native technology company building new businesses with domain experts and exploring how intelligent systems can transform existing operations.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "AshviTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AshviTech — Building AI-Native Businesses",
    description:
      "AshviTech is an AI-native technology company building new businesses with domain experts and exploring how intelligent systems can transform existing operations.",
    images: ["/brand/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/brand/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#021336",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, newsreader.variable, jetbrains.variable)}
    >
      <body className="min-h-screen font-sans antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
