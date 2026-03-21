export const Limits: Record<string, Limit> = {
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

interface Limit {
    namespace: string;
    max: number;
    timeWindow_s: number;
}
