import { createTaggedError } from "errore";
import { err, ok, ResultAsync } from "neverthrow";

import { parseJson } from "./parseJson.js";

export class UnauthorizedError extends createTaggedError({
  name: "UnauthorizedError",
  message: "$message",
}) {}

export class HttpError extends createTaggedError({
  name: "HttpError",
  message: "$status: $statusText",
}) {}

export class NetworkError extends createTaggedError({
  name: "NetworkError",
  message: "$message",
}) {
  constructor(cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    super({ message, cause });
  }
}

function getText(response: Response) {
  return ResultAsync.fromPromise(response.text(), (e) => new NetworkError(e));
}

export function fetchJson(input: RequestInfo | URL, init?: RequestInit) {
  return ResultAsync.fromPromise(fetch(input, init), (e) => new NetworkError(e))
    .andThen((res) =>
      getText(res).andThen((text) => {
        if (res.status == 401) return err(new UnauthorizedError({ message: text }));
        if (!res.ok) return err(new HttpError({ status: res.status, statusText: res.statusText }));
        return ok(text);
      }),
    )
    .andThen((text) => parseJson(text));
}
