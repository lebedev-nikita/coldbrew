class DisposablePromise<T> extends Promise<T> {
  async [Symbol.asyncDispose]() {
    await this;
  }
}

export function delay(ms: number) {
  return new DisposablePromise<void>((res) => setTimeout(() => res(), ms));
}
