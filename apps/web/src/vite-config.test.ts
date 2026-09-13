import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { expect, it } from "vitest";

it("does not contain vite.config.js alongside vite.config.ts", () => {
  expect(existsSync(fileURLToPath(import.meta.resolve("../vite.config.js")))).toBe(false);
});
