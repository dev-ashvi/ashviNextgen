import { describe, expect, it } from "vitest";
import { sanitizeAnalyticsEvent } from "./VercelAnalytics";

describe("sanitizeAnalyticsEvent", () => {
  it("strips all query parameters from pageviews", () => {
    const result = sanitizeAnalyticsEvent({
      type: "pageview",
      url: "https://www.ashvi.tech/contact?interest=build&token=secret",
    });
    expect(result).toEqual({
      type: "pageview",
      url: "https://www.ashvi.tech/contact",
    });
  });

  it("drops api paths", () => {
    expect(
      sanitizeAnalyticsEvent({
        type: "pageview",
        url: "https://www.ashvi.tech/api/contact",
      }),
    ).toBeNull();
  });

  it("removes hash fragments", () => {
    const result = sanitizeAnalyticsEvent({
      type: "pageview",
      url: "https://www.ashvi.tech/#our-work",
    });
    expect(result?.url).toBe("https://www.ashvi.tech/");
  });

  it("strips query params from relative URLs", () => {
    expect(
      sanitizeAnalyticsEvent({
        type: "pageview",
        url: "/contact?interest=transform",
      }),
    ).toEqual({ type: "pageview", url: "/contact" });
  });
});
