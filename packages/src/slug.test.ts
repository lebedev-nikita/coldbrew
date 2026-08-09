import { describe, expect, it } from "vitest";

import { slugFromEmail } from "./slug.js";

describe("slugFromEmail", () => {
  it("uses the local part of an email address", () => {
    expect(slugFromEmail("slug@google.com")).toBe("@slug");
  });

  it("normalizes email local parts to valid slug characters", () => {
    expect(slugFromEmail("Streamer.Name+alerts@example.com")).toBe("@streamer-name-alerts");
  });

  it("ensures short local parts produce valid slugs", () => {
    expect(slugFromEmail("a@example.com")).toBe("@a00");
  });
});
