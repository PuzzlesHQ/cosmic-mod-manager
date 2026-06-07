import { describe, expect, test } from "bun:test";
import { API_SCOPE, decodePatScopes, encodePatScopes } from "./pats";

describe("encodePatScopes", () => {
    test("should correctly encode the scopes", () => {
        const encoded = encodePatScopes([API_SCOPE.USER_READ_EMAIL, API_SCOPE.USER_WRITE]);
        // user_read_email: 1 << 0
        // user_write: 1 << 2
        expect(encoded).toEqual(0n | (1n << 0n) | (1n << 2n));
    });

    test("should return 0 for no scopes", () => {
        const encoded = encodePatScopes([]);
        expect(encoded).toBe(0n);
    });

    test("should ignore invalid scopes", () => {
        const encoded = encodePatScopes(["invalid_scope", API_SCOPE.USER_READ]);
        const decoded = decodePatScopes(encoded);
        expect(decoded).toEqual([API_SCOPE.USER_READ]);
    });

    test("should handle duplicate scopes", () => {
        const encoded = encodePatScopes([API_SCOPE.USER_READ, API_SCOPE.USER_READ]);
        const decoded = decodePatScopes(encoded);
        expect(decoded).toEqual([API_SCOPE.USER_READ]);
    });
});

describe("decodePatScopes", () => {
    test("should decode multiple scopes", () => {
        const scopes = [API_SCOPE.USER_READ, API_SCOPE.PROJECT_WRITE, API_SCOPE.VERSION_DELETE];
        const encoded = encodePatScopes(scopes);
        const decoded = decodePatScopes(encoded);
        expect(decoded).toEqual(expect.arrayContaining(scopes));
        expect(decoded.length).toBe(scopes.length);
    });

    test("should return empty array for 0", () => {
        const decoded = decodePatScopes(0n);
        expect(decoded).toEqual([]);
    });

    test("should maintain order consistency", () => {
        const allScopes = Object.values(API_SCOPE);
        const encoded = encodePatScopes(allScopes);
        const decoded = decodePatScopes(encoded);

        expect(decoded.length).toBe(allScopes.length);
        expect(decoded).toEqual(expect.arrayContaining(allScopes));
    });
});
