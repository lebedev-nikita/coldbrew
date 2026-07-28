type Constructor<T> = new (...args: any[]) => T;

export function isInstanceof<TSource, TTarget extends TSource>(
  value: TSource,
  constructors: Constructor<TTarget> | Constructor<TTarget>[],
): value is TTarget {
  if (Array.isArray(constructors)) {
    return constructors.some((constructor) => value instanceof constructor);
  }
  return value instanceof constructors;
}
