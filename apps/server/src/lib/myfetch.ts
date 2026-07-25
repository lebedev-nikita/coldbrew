export class JsonParseError extends Error {}
export class TextParseError extends Error {}

type Jsonable = string | number | null | Record<string, unknown> | Array<unknown>;

export async function myfetch(...args: Parameters<typeof fetch>) {
  const res = await fetch(...args);

  return {
    ok: res.ok,
    status: res.status,
    async json() {
      try {
        return (await res.json()) as Jsonable;
      } catch (error) {
        if (!(error instanceof Error)) throw error;
        return new JsonParseError(error.message, { cause: error.cause });
      }
    },
    async text() {
      try {
      } catch (error) {
        if (!(error instanceof Error)) throw error;
        return new TextParseError(error.message, { cause: error.cause });
      }
    },
  };
}
