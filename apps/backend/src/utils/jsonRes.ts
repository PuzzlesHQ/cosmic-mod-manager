import type { Context } from "hono";
import type { TypedResponse } from "hono/types";
import type { ContentfulStatusCode } from "hono/utils/http-status";

type JsonResponse<T, S extends ContentfulStatusCode> = Response & TypedResponse<T, S, "json">;

type Discriminate<T extends { data: unknown; status: ContentfulStatusCode }> = T extends {
    data: infer D;
    status: infer S extends ContentfulStatusCode;
}
    ? JsonResponse<D, S>
    : never;

export function respondJson<T extends { readonly data: unknown; readonly status: ContentfulStatusCode }>(
    ctx: Context,
    result: T,
): Discriminate<T> {
    return ctx.json(result.data, result.status) as Discriminate<T>;
}
