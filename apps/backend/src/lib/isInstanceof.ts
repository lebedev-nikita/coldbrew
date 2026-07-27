import { TapFlatReporter } from "vitest/node";

type Constructor<T> = new (...args: any[]) => T;

export function isInstanceof<TSource, TTarget extends TSource>(
  value: TSource,
  target: Constructor<TTarget>,
): value is TTarget {
  return value instanceof target;
}
