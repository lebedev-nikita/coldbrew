import { describe, expectTypeOf, test } from "vitest";

import { fetchJson, HttpError, NetworkError, UnauthorizedError } from "./fetchJson.js";
import { JsonParseError } from "./parseJson.js";

describe("fetchJson", { tags: ["unit"] }, () => {
  test("types", async () => {
    const res = await fetchJson("");
    const err = res._unsafeUnwrapErr();

    expectTypeOf<UnauthorizedError>().toExtend<typeof err>();
    expectTypeOf<JsonParseError>().toExtend<typeof err>();
    expectTypeOf<NetworkError>().toExtend<typeof err>();
    expectTypeOf<HttpError>().toExtend<typeof err>();
  });
});
