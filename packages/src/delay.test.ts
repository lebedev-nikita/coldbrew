import { describe, expect, it } from "vitest";

import { delay } from "./delay.js";

describe("delay", () => {
  it("awaits", async () => {
    async function waiting() {
      await using _ = delay(1000);
    }

    const start = performance.now();
    await waiting();
    const end = performance.now();

    expect(end - start).toBeGreaterThan(1000);
    expect(end - start).toBeLessThan(1100);
  });
});
