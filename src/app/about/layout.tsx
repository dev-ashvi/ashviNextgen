import "@/components/about/about-hero.css";

/**
 * About route layout — loads hero motion CSS (scoped under `.ah`).
 * Does not wrap or alter page structure.
 */
export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
