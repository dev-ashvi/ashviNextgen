import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../../..");

describe("SiteHeader mobile menu containing-block fix (C1)", () => {
  it("portals the mobile menu outside the backdrop-filtered header", () => {
    const source = readFileSync(
      path.join(root, "src/components/layout/SiteHeader.tsx"),
      "utf8",
    );
    const theme = readFileSync(
      path.join(root, "src/components/layout/nav/navTheme.ts"),
      "utf8",
    );
    const mobile = readFileSync(
      path.join(root, "src/components/layout/nav/MobileMenu.tsx"),
      "utf8",
    );
    expect(source).toContain("createPortal");
    expect(source).toContain("createPortal(mobileMenu, document.body)");
    expect(mobile).toContain('id="mobile-menu"');
    // Light theme still uses backdrop blur; portal remains the containment break.
    expect(theme).toMatch(/backdrop-blur-xl/);
    expect(source).toMatch(
      /\{portalReady \? createPortal\(mobileMenu, document\.body\) : null\}/,
    );
  });

  it("restores body overflow on close and unmount", () => {
    const source = readFileSync(
      path.join(root, "src/components/layout/SiteHeader.tsx"),
      "utf8",
    );
    expect(source).toMatch(
      /document\.body\.style\.overflow\s*=\s*menuOpen\s*\?\s*"hidden"\s*:\s*""/,
    );
    expect(source).toMatch(/document\.body\.style\.overflow\s*=\s*""/);
  });
});
