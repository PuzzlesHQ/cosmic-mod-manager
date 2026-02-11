export default {
    global: {
        // Rate limit for get requests
        GET: {
            max: 500,
            timeWindow_seconds: 600,
            namespace: "global_GET",
        },
        STRICT_GET: {
            max: 150,
            timeWindow_seconds: 600,
            namespace: "global_RESTRICTED_GET",
        },
        // Rate limit for modify requests such as POST, PATCH, DELETE
        MODIFY: {
            max: 100,
            timeWindow_seconds: 600,
            namespace: "global_MODIFY",
        },
        // Rate limit for critical modify requests such as changing passwords, signing in etc.
        CRITICAL_MODIFY: {
            max: 30,
            timeWindow_seconds: 600,
            namespace: "global_CRITICAL_MODIFY",
        },
        EMAIL: {
            max: 10,
            timeWindow_seconds: 7200,
            namespace: "global_EMAIL",
        },
        INVALID_AUTH_ATTEMPT: {
            max: 5,
            timeWindow_seconds: 600,
            namespace: "global_INVALID_AUTH_ATTEMPT",
        },
        DDOS_PROTECTION: {
            max: 35,
            timeWindow_seconds: 5,
            namespace: "global_DDOS_PROTECTION",
        },
    },

    SEARCH: {
        max: 500,
        timeWindow_seconds: 600,
        namespace: "rate-limit_SEARCH",
    },
    CDN_ASSETS: {
        max: 100,
        timeWindow_seconds: 60,
        namespace: "rate-limit_CDN_ASSETS",
    },
    CDN_LARGE_FILES: {
        max: 50,
        timeWindow_seconds: 150,
        namespace: "rate-limit_CDN_LARGE_FILES",
    },
};
