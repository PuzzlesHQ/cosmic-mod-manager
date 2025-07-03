export type FixedLenArray<T, N extends number, A extends T[] = []> = A["length"] extends N ? A : FixedLenArray<T, N, [T, ...A]>;

export type FixedStringArray<T extends number> = FixedLenArray<string, T>;
export type FixedNumberArray<T extends number> = FixedLenArray<number, T>;

export type UnwrapArray<T> = T extends Array<infer U> ? U : never;
