export const Limits: Record<string, RateLimit> = {
    SEARCH: {
        max: 60,
        timeWindow_s: 60,
        namespace: "SEARCH",
    },
    GET: {
        max: 200,
        timeWindow_s: 300,
        namespace: "GET",
    },
    STRICT_GET: {
        max: 75,
        timeWindow_s: 600,
        namespace: "STRICT_GET",
    },
    MODIFY: {
        max: 75,
        timeWindow_s: 600,
        namespace: "MODIFY",
    },
    CRIT_MODIFY: {
        max: 30,
        timeWindow_s: 1200,
        namespace: "CRIT_MODIFY",
    },

    // --
    CDN_IMG: {
        max: 200,
        timeWindow_s: 300,
        namespace: "CDN_IMG",
    },
    CDN_VERSION_FILE: {
        max: 75,
        timeWindow_s: 600,
        namespace: "CDN_VERSION_FILE",
    },

    //--
    EMAIL: {
        max: 10,
        timeWindow_s: 7200,
        namespace: "EMAIL",
    },
    INVALID_AUTH_ATTEMPT: {
        max: 5,
        timeWindow_s: 7200,
        namespace: "INVALID_AUTH_ATTEMPT",
    },
    DDOS_PROTECTION: {
        max: 30,
        timeWindow_s: 5,
        namespace: "DDOS_PROTECTION",
    },
};

export interface RateLimit {
    namespace: string;
    max: number;
    timeWindow_s: number;
}
