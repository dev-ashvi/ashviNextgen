import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../../..");

describe("Transform hero mobile sculpture (H3)", () => {
  it("keeps a dedicated mobileHero presentation without altering the desktop branch classes", () => {
    const visual = readFileSync(
      path.join(root, "src/components/transform/TransformHeroVisual.tsx"),
      "utf8",
    );
    const page = readFileSync(
      path.join(root, "src/components/transform/TransformPage.tsx"),
      "utf8",
    );

    expect(visual).toContain('presentation?: "default" | "mobileHero"');
    expect(visual).toContain("object-cover");
    expect(visual).toContain("object-[center_42%]");

    // Desktop absolute branch must remain.
    expect(page).toMatch(
      /TransformHeroVisual className="absolute bottom-0 right-\[-8%\] hidden w-\[66%\] lg:block"/,
    );
    // Mobile framed crop branch.
    expect(page).toContain('presentation="mobileHero"');
    expect(page).toMatch(/h-\[248px\].*md:hidden/s);
    // Tablet natural aspect still uses default presentation under lg.
    expect(page).toMatch(/hidden w-full overflow-hidden md:block lg:hidden/);
  });
});
