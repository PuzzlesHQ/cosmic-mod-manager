export function cacheKey(key: string, namespace: string) {
    return `${namespace}:${key}`;
}
