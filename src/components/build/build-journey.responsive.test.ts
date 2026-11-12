import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../../..");

describe("Build journey tablet breakpoint (H4)", () => {
  it("keeps the vertical stack through tablet and horizontal from lg", () => {
    const source = readFileSync(
      path.join(root, "src/components/build/BuildPage.tsx"),
      "utf8",
    );
    expect(source).toMatch(/hidden lg:block/);
    expect(source).toMatch(/mt-12 lg:hidden/);
    // Must not reintroduce the cramped md horizontal layout.
    expect(source).not.toMatch(/hidden md:block/);
    expect(source).not.toMatch(/mt-12 md:hidden/);
  });
});

describe("Section anchor scroll margin (H1)", () => {
  it("defines a shared header-aware scroll-anchor utility", () => {
    const css = readFileSync(path.join(root, "src/app/globals.css"), "utf8");
    expect(css).toContain("--site-header-scroll-margin");
    expect(css).toMatch(/\.scroll-anchor\s*\{[^}]*scroll-margin-top:\s*var\(--site-header-scroll-margin\)/s);
    expect(css).toMatch(/scroll-padding-top:\s*var\(--site-header-scroll-margin\)/);
  });

  it("applies scroll-anchor to primary hash destinations", () => {
    const ourWork = readFileSync(
      path.join(root, "src/components/home/FeaturedWorkSection.tsx"),
      "utf8",
    );
    const partnership = readFileSync(
      path.join(root, "src/components/build/BuildPartnership.tsx"),
      "utf8",
    );
    const transform = readFileSync(
      path.join(root, "src/components/transform/TransformPage.tsx"),
      "utf8",
    );
    expect(ourWork).toMatch(/id="our-work"[\s\S]*scroll-anchor/);
    expect(partnership).toMatch(/id="how-we-build-together"[\s\S]*scroll-anchor/);
    expect(transform).toMatch(/id="our-approach"[\s\S]*scroll-anchor/);
    expect(transform).toMatch(/id="our-partnership"[\s\S]*scroll-anchor/);
  });
});
