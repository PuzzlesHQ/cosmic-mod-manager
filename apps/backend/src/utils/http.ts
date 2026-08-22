import type { Context } from "hono";
import { deleteCookie as honoDeleteCookie, setCookie as honoSetCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";
import env from "~/utils/env";
import { respondJson } from "./jsonRes";

export type ApiError = {
    data: { success: false; message: string };
    status: THttpStatus;
};
export type ApiSuccess<T> = {
    data: { success: true; data: T };
    status: THttpStatus;
};
export type ApiResponse<T> = ApiError | ApiSuccess<T>;

export function isSuccessResponse<T>(res: ApiResponse<T>): res is ApiSuccess<T> {
    return res.data.success === true;
}

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHENTICATED: 401,
    UNAUTHORIZED: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    NOT_IMPLEMENTED: 501,
    SERVER_ERROR: 500,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,
} as const;
export type THttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

type ErrMsg = string | undefined;

export function serverErrorResponse<M extends ErrMsg = undefined>(ctx: Context, message?: M) {
    return respondJson(ctx, serverErrorResponseData(message));
}

export function invalidRequestResponse<M extends ErrMsg = undefined>(ctx: Context, message?: M) {
    return respondJson(ctx, invalidRequestResponseData(message));
}

export function tooManyRequestsResponse<M extends ErrMsg = undefined>(ctx: Context, message?: M) {
    return respondJson(ctx, tooManyRequestsResponseData(message));
}

export function notFoundResponse<M extends ErrMsg = undefined>(ctx: Context, message?: M) {
    return respondJson(ctx, notFoundResponseData(message));
}

export function unauthorizedReqResponse<M extends ErrMsg = undefined>(ctx: Context, message?: M) {
    return respondJson(ctx, unauthorizedReqResponseData(message));
}

export function unauthenticatedReqResponse<M extends ErrMsg = undefined>(ctx: Context, message?: M) {
    return respondJson(ctx, unauthenticatedReqResponseData(message));
}

const DefaultMessages = {
    [HTTP_STATUS.SERVER_ERROR]: "Server Error",
    [HTTP_STATUS.BAD_REQUEST]: "Invalid request",
    [HTTP_STATUS.TOO_MANY_REQUESTS]: "Too many requests, try again after a few minutes!",
    [HTTP_STATUS.NOT_FOUND]: "Resource not found",
    [HTTP_STATUS.UNAUTHORIZED]: "Unauthorized",
    [HTTP_STATUS.UNAUTHENTICATED]: "Unauthenticated",
} as const;
type TDefaultMessages = typeof DefaultMessages;

type ErrStr<M, Status extends keyof TDefaultMessages> = M extends string ? M : TDefaultMessages[Status];

export function serverErrorResponseData<M extends ErrMsg = undefined>(msg?: M) {
    const status = HTTP_STATUS.SERVER_ERROR;
    return {
        data: {
            success: false,
            message: (msg ?? DefaultMessages[status]) as ErrStr<M, typeof status>,
        },
        status: status,
    } as const;
}

export function invalidRequestResponseData<M extends ErrMsg = undefined>(message?: M) {
    const status = HTTP_STATUS.BAD_REQUEST;

    return {
        data: {
            success: false,
            message: (message ?? DefaultMessages[status]) as ErrStr<M, typeof status>,
        },
        status: status,
    } as const;
}

export function tooManyRequestsResponseData<M extends ErrMsg = undefined>(message?: M) {
    const status = HTTP_STATUS.TOO_MANY_REQUESTS;

    return {
        data: {
            success: false,
            message: (message ?? DefaultMessages[status]) as ErrStr<M, typeof status>,
        },
        status: status,
    } as const;
}

export function notFoundResponseData<M extends ErrMsg = undefined>(message?: M) {
    const status = HTTP_STATUS.NOT_FOUND;

    return {
        data: {
            success: false,
            message: (message ?? DefaultMessages[status]) as ErrStr<M, typeof status>,
        },
        status: status,
    } as const;
}

export function unauthorizedReqResponseData<M extends ErrMsg = undefined>(message?: M) {
    const status = HTTP_STATUS.UNAUTHORIZED;

    return {
        data: {
            success: false,
            message: (message ?? DefaultMessages[status]) as ErrStr<M, typeof status>,
        },
        status: status,
    } as const;
}
export function unauthenticatedReqResponseData<M extends ErrMsg = undefined>(message?: M) {
    const status = HTTP_STATUS.UNAUTHENTICATED;

    return {
        data: {
            success: false,
            message: (message ?? DefaultMessages[status]) as ErrStr<M, typeof status>,
        },
        status: status,
    } as const;
}

// Cookie helpers
export function setCookie(ctx: Context, name: string, value: string, options?: CookieOptions) {
    return honoSetCookie(ctx, name, value, {
        sameSite: "Lax",
        domain: env.COOKIE_DOMAIN,
        ...options,
    });
}

export function deleteCookie(ctx: Context, name: string, options?: CookieOptions) {
    return honoDeleteCookie(ctx, name, { domain: env.COOKIE_DOMAIN, path: "/", sameSite: "Lax", ...options });
}
