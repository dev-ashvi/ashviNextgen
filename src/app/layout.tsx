import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
