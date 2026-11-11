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
    expect(source).toContain("createPortal");
    expect(source).toContain('createPortal(mobileMenu, document.body)');
    expect(source).toContain('id="mobile-menu"');
    // Menu markup must not be nested inside the <header> JSX tree as a child
    // of the backdrop-blur element — portal is the containment break.
    expect(source).toMatch(/backdrop-blur-xl/);
    expect(source).toMatch(/\{portalReady \? createPortal\(mobileMenu, document\.body\) : null\}/);
  });

  it("restores body overflow on close and unmount", () => {
    const source = readFileSync(
      path.join(root, "src/components/layout/SiteHeader.tsx"),
      "utf8",
    );
    expect(source).toMatch(/document\.body\.style\.overflow\s*=\s*open\s*\?\s*"hidden"\s*:\s*""/);
    expect(source).toMatch(/document\.body\.style\.overflow\s*=\s*""/);
  });
});
