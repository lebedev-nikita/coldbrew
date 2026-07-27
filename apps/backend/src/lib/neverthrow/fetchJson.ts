import { err, ok, Result, ResultAsync } from "neverthrow";

import { parseJson } from "./parseJson.js";

export class UnauthorizedError extends Error {
  readonly name = "UnauthorizedError";
}
export class HttpError extends Error {
  readonly name = "HttpError";
}

export class NetworkError extends Error {
  readonly name = "NetworkError";

  constructor(cause: unknown) {
    super(cause instanceof Error ? cause.message : String(cause), { cause });
  }
}

function getText(response: Response) {
  return ResultAsync.fromPromise(response.text(), (error) => new NetworkError(error));
}

export function fetchJson(input: RequestInfo | URL, init?: RequestInit) {
  return ResultAsync.fromPromise(fetch(input, init), (error) => new NetworkError(error))
    .andThen((res) =>
      getText(res).andThen((text) => {
        if (res.status == 401) return err(new UnauthorizedError(text));
        if (!res.ok) return err(new HttpError(`${res.status}: ${res.statusText}`));
        return ok(text);
      }),
    )
    .andThen((text) => parseJson(text));
}
