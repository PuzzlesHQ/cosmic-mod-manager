import type { DeepPartial } from "./types";

export function fillEmptyKeys<T extends object>(_obj: DeepPartial<T>, _fallback: T): T {
    if (!_fallback || typeof _fallback !== "object") {
        throw new Error("Fallback must be a non-null object");
    }

    const target = _obj as Record<string, unknown>;
    const fallback = _fallback as Record<string, unknown>;

    for (const key in fallback) {
        if (isObject(fallback[key])) {
            if (!target[key] || typeof target[key] !== "object") {
                target[key] = {};
            }
            fillEmptyKeys(target[key] as Record<string, unknown>, fallback[key] as Record<string, unknown>);
        } else if (!target[key]) {
            target[key] = fallback[key];
        }
    }

    return target as T;
}

function isObject(val: unknown): boolean {
    if (!val) return false;
    if (Array.isArray(val)) return false;
    return typeof val === "object";
}
