export type ReturnedPromiseResolvedType<T> = T extends (...args: any[]) => Promise<infer R> ? R : never;
export type Unarray<T> = T extends Array<infer U> ? U : T;
