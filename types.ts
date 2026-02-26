export type PromiseReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>;
