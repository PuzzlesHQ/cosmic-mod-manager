// the order of these scopes should not be changed, as they are used in bitwise operations
export enum API_SCOPE {
    USER_READ_EMAIL = "user_read_email",
    USER_READ = "user_read",
    USER_WRITE = "user_write",
    USER_DELETE = "user_delete",
    USER_AUTH_WRITE = "user_auth_write",
    NOTIFICATION_READ = "notification_read",
    NOTIFICATION_WRITE = "notification_write",

    USER_SESSION_READ = "user_session_read",
    USER_SESSION_DELETE = "user_session_delete",

    ANALYTICS_READ = "analytics_read",
    PROJECT_CREATE = "project_create",
    PROJECT_READ = "project_read",
    PROJECT_WRITE = "project_write",
    PROJECT_DELETE = "project_delete",

    VERSION_CREATE = "version_create",
    VERSION_READ = "version_read",
    VERSION_WRITE = "version_write",
    VERSION_DELETE = "version_delete",

    ORGANIZATION_CREATE = "organization_create",
    ORGANIZATION_READ = "organization_read",
    ORGANIZATION_WRITE = "organization_write",
    ORGANIZATION_DELETE = "organization_delete",

    COLLECTION_CREATE = "collection_create",
    COLLECTION_READ = "collection_read",
    COLLECTION_WRITE = "collection_write",
    COLLECTION_DELETE = "collection_delete",

    REPORT_CREATE = "report_create",
    REPORT_READ = "report_read",
    REPORT_WRITE = "report_write",
    REPORT_DELETE = "report_delete",

    THREAD_READ = "thread_read",
    THREAD_WRITE = "thread_write",

    PAT_CREATE = "pat_create",
    PAT_READ = "pat_read",
    PAT_WRITE = "pat_write",
    PAT_DELETE = "pat_delete",
}

export const PAT_RESTRICTED_SCOPES = [
    API_SCOPE.PAT_CREATE,
    API_SCOPE.PAT_READ,
    API_SCOPE.PAT_WRITE,
    API_SCOPE.PAT_DELETE,
    API_SCOPE.USER_SESSION_READ,
    API_SCOPE.USER_SESSION_DELETE,
    API_SCOPE.USER_AUTH_WRITE,
    API_SCOPE.USER_DELETE,
    API_SCOPE.ANALYTICS_READ,
];

interface PatScopeInfo {
    id: API_SCOPE;
    flag: bigint;
}
export const ALL_API_SCOPES = -1n; // too lazy to set all the corresponding bits
const PAT_SCOPES: PatScopeInfo[] = [];
let flagCounter = 0n;

for (const scope in API_SCOPE) {
    PAT_SCOPES.push({
        id: API_SCOPE[scope as keyof typeof API_SCOPE],
        flag: 1n << flagCounter,
    });

    flagCounter++;
}

export function encodePatScopes(scopes: string[]): bigint {
    let encoded = 0n;

    for (const scope of scopes) {
        const scopeInfo = PAT_SCOPES.find((s) => s.id === scope);
        if (!scopeInfo) continue;

        encoded = encoded | scopeInfo.flag;
    }

    return encoded;
}

export function decodePatScopes(encoded: bigint): API_SCOPE[] {
    const scopes: API_SCOPE[] = [];

    for (const scopeInfo of PAT_SCOPES) {
        if ((encoded & scopeInfo.flag) === scopeInfo.flag) {
            scopes.push(scopeInfo.id);
        }
    }

    return scopes;
}

export function hasPatScope(encoded: bigint, scope: API_SCOPE): boolean {
    const scopeInfo = PAT_SCOPES.find((s) => s.id === scope);
    if (!scopeInfo) return false;

    return (encoded & scopeInfo.flag) === scopeInfo.flag;
}

export function hasAllPatScopes(encoded: bigint, scopes: API_SCOPE[]): boolean {
    for (const scope of scopes) {
        if (!hasPatScope(encoded, scope)) return false;
    }

    return true;
}

export function togglePatScope(encoded: bigint, scope: API_SCOPE): bigint {
    const scopeInfo = PAT_SCOPES.find((s) => s.id === scope);
    if (!scopeInfo) return encoded;

    // toggle using XOR (just a note for future me)
    // eg: x1xx ^ x1xx = x0xx (removes the scope)
    //     x0xx ^ x1xx = x1xx (adds the scope)
    return encoded ^ scopeInfo.flag;
}

export function patContainsRestrictedScopes(encoded: bigint) {
    for (const restrictedScope of PAT_RESTRICTED_SCOPES) {
        if (hasPatScope(encoded, restrictedScope)) return restrictedScope;
    }

    return false;
}
