import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Keep hero/body weights explicit so Chrome does not synthesize 300/500 from 400.
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ashvi.tech"),
  title: {
    default: "Ashvi — Building Intelligence. Creating Companies.",
    template: "%s | Ashvi",
  },
  description:
    "Deep technology venture studio and research lab — AI, software, data, and infrastructure turned into real companies. Built so great minds are not lost.",
  openGraph: {
    title: "Ashvi",
    url: "https://ashvi.tech",
    description:
      "Systems, support, and belief for builders. India → the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
