import { describe, expect, it } from "vitest";

import { getPaginationWindow } from "./pagination.js";

describe("getPaginationWindow", () => {
  it("clamps a page past the end of a populated result", () => {
    expect(getPaginationWindow(51, 9, 25)).toEqual({
      offset: 50,
      page: 3,
      totalPages: 3,
    });
  });

  it("keeps an empty result on the first page", () => {
    expect(getPaginationWindow(0, 4, 25)).toEqual({
      offset: 0,
      page: 1,
      totalPages: 0,
    });
  });
});
