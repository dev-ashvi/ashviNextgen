import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../../..");

describe("AnimatedReveal reduced-motion safety (C2)", () => {
  it("scopes a CSS reduced-motion override to .ashvi-reveal", () => {
    const css = readFileSync(path.join(root, "src/app/globals.css"), "utf8");
    expect(css).toMatch(/@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/);
    expect(css).toMatch(/\.ashvi-reveal\s*\{[^}]*opacity:\s*1\s*!important/s);
    expect(css).toMatch(/\.ashvi-reveal\s*\{[^}]*transform:\s*none\s*!important/s);
  });

  it("marks reveal roots with ashvi-reveal in the component source", () => {
    const source = readFileSync(
      path.join(root, "src/components/ui/AnimatedReveal.tsx"),
      "utf8",
    );
    expect(source).toContain("ashvi-reveal");
    expect(source).toContain("usePrefersReducedMotion");
    // Must not require IntersectionObserver when reduce is active.
    expect(source).toMatch(/if\s*\(\s*reduce\s*\)\s*\{[\s\S]*setVisible\(true\)/);
  });

  it("uses useSyncExternalStore for prefers-reduced-motion", () => {
    const source = readFileSync(
      path.join(root, "src/hooks/usePrefersReducedMotion.ts"),
      "utf8",
    );
    expect(source).toContain("useSyncExternalStore");
    expect(source).toContain("getServerSnapshot");
  });
});
