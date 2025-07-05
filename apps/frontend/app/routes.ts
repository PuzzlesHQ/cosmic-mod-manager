import type { RouteConfig } from "@react-router/dev/routes";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";

const ProjectTypes = ["project", "mod", "modpack", "shader", "resource-pack", "datamod", "plugin", "world"];

export default remixRoutesOptionAdapter((defineRoutes) => {
    return defineRoutes((route) => {
        route("", path("page.tsx"), { id: "home-page", index: true });
        route("about", path("about.tsx"), { id: "about-page" });
        route("status", path("status.tsx"), { id: "status-page" });

        // Auth routes
        route("login", path("auth/login.tsx"), { id: "login-page" });
        route("signup", path("auth/signup.tsx"), { id: "signup-page" });
        route("change-password", path("auth/change-password.tsx"), { id: "change-password-page" });
        route("auth/revoke-session", path("auth/revoke-session.tsx"), { id: "revoke-session-page" });
        route("auth/confirm-action", path("auth/confirm-action.tsx"), { id: "confirm-action-page" });
        route("auth/callback/:authProvider", path("auth/auth-callback.tsx"), {
            id: "auth-callback-page",
        });

        // User Settings
        route("settings", path("settings/layout.tsx"), { id: "settings-layout" }, () => {
            route("", path("settings/prefs.tsx"), { index: true, id: "prefs" });
            route("profile", path("settings/profile.tsx"), { id: "profile-settings" });
            route("account", path("settings/account.tsx"), { id: "account-settings" });
            route("sessions", path("settings/sessions.tsx"), { id: "sessions-settings" });
        });

        // Dashboard
        route("dashboard", path("dashboard/layout.tsx"), { id: "dashboard-layout" }, () => {
            route("", path("dashboard/overview.tsx"), { index: true, id: "overview" });
            route("notifications", path("dashboard/notifications/page.tsx"), { id: "notifications" });
            route("notifications/history", path("dashboard/notifications/history.tsx"), {
                id: "notifications-history",
            });

            route("reports", path("dashboard/reports.tsx"), { id: "dashboard__reports" });
            route("report/:reportId", path("report/report-details.tsx"), { id: "dashboard__report__details" });
            route("analytics", path("dashboard/analytics.tsx"), { id: "analytics" });

            route("projects", path("dashboard/projects.tsx"), { id: "dashboard-projects" });
            route("organizations", path("dashboard/organizations.tsx"), {
                id: "dashboard-organizations",
            });
            route("collections", path("dashboard/collections.tsx"), { id: "dashboard-collections" });
            route("*", path("$.tsx"), { id: "dashboard-not-found" });
        });

        // Search pages
        route("", path("search/layout.tsx"), { id: "search-layout" }, () => {
            for (const type of ProjectTypes) {
                route(`${type}s`, path("search/page.tsx"), { id: `${type}s-search` });
            }
        });

        for (const type of ProjectTypes) {
            // Project pages
            route(`${type}/:projectSlug`, path("project/data-wrapper.tsx"), { id: `${type}__data-wrapper` }, () => {
                route("", path("project/layout.tsx"), { id: `${type}__layout` }, () => {
                    route("", path("project/page.tsx"), { index: true, id: `${type}__page` });
                    route("gallery", path("project/gallery.tsx"), { id: `${type}__gallery` });
                    route("changelog", path("project/changelog.tsx"), {
                        id: `${type}__changelog`,
                    });
                    route("versions", path("project/versions.tsx"), { id: `${type}__versions` });
                    route("moderation", path("project/moderation.tsx"), { id: `${type}__moderation` });

                    route("version", path("project/versions.tsx"), {
                        id: `${type}__versions_alternate`,
                    });
                    route("version/:versionSlug", path("project/version/page.tsx"), {
                        id: `${type}__version__page`,
                    });
                    route("version/new", path("project/version/new.tsx"), {
                        id: `${type}__version__new`,
                    });
                    route("version/:versionSlug/edit", path("project/version/edit.tsx"), {
                        id: `${type}__version__edit`,
                    });
                });
                route("settings", path("project/settings/layout.tsx"), { id: `${type}__settings-layout` }, () => {
                    route("", path("project/settings/general.tsx"), {
                        id: `${type}__settings__general`,
                        index: true,
                    });
                    route("tags", path("project/settings/tags.tsx"), {
                        id: `${type}__settings__tags`,
                    });
                    route("description", path("project/settings/description.tsx"), {
                        id: `${type}__settings__description`,
                    });
                    route("license", path("project/settings/license.tsx"), {
                        id: `${type}__settings__license`,
                    });
                    route("links", path("project/settings/links.tsx"), {
                        id: `${type}__settings__links`,
                    });
                    route("members", path("project/settings/members.tsx"), {
                        id: `${type}__settings__members`,
                    });
                    route("analytics", path("project/settings/analytics.tsx"), {
                        id: `${type}__settings__analytics`,
                    });
                    route("*", path("$.tsx"), { id: `${type}__settings-not-found` });
                });
            });
        }

        // Organization pages
        route("organization/:orgSlug", path("organization/data-wrapper.tsx"), { id: "organization-data-wrapper" }, () => {
            route("settings", path("organization/settings/layout.tsx"), { id: "org-settings" }, () => {
                route("", path("organization/settings/page.tsx"), {
                    index: true,
                    id: "org-general-settings",
                });
                route("projects", path("organization/settings/projects.tsx"), {
                    id: "org-projects-settings",
                });
                route("members", path("organization/settings/members.tsx"), {
                    id: "org-members-settings",
                });
                route("analytics", path("organization/settings/analytics.tsx"), {
                    id: "org-analytics-page",
                });
                route("*", path("$.tsx"), { id: "org-settings-not-found" });
            });

            route("", path("organization/layout.tsx"), { id: "organization__layout" }, () => {
                route("", path("organization/page.tsx"), {
                    index: true,
                    id: "organization__projects-all",
                });
                route(":projectType", path("organization/page.tsx"), {
                    id: "organization__projects",
                });
            });
        });

        // Collections page
        route("collection/:collectionId", path("collection/layout.tsx"), { id: "collection__layout" }, () => {
            route("", path("collection/page.tsx"), {
                index: true,
                id: "collection__projects-all",
            });
            route(":projectType", path("collection/page.tsx"), { id: "collection__projects" });
        });

        // User profile
        route("user/:userName", path("user/layout.tsx"), { id: "user-profile" }, () => {
            route("", path("user/page.tsx"), { index: true, id: "user__all-projects" });
            route(":type", path("user/page.tsx"), { id: "user__projects" });
        });

        route("legal", path("legal/layout.tsx"), { id: "legal-pages" }, () => {
            route("", path("legal/terms.tsx"), { id: "legal__index-page", index: true });
            route("terms", path("legal/terms.tsx"), { index: true, id: "terms" });
            route("rules", path("legal/rules.tsx"), { id: "content-rules" });
            route("copyright", path("legal/copyright.tsx"), { id: "copyright-policy" });
            route("security", path("legal/security.tsx"), { id: "security-notice" });
            route("privacy", path("legal/privacy.tsx"), { id: "privacy-policy" });
        });

        // Moderation pages
        route("moderation", path("moderation/layout.tsx"), { id: "moderation-pages" }, () => {
            route("", path("moderation/page.tsx"), { id: "moderation__index-page", index: true });
            route("analytics", path("moderation/analytics.tsx"), { id: "moderation__analytics-page" });
            route("review", path("moderation/review.tsx"), { id: "moderation__review-page" });
            route("reports", path("moderation/reports.tsx"), { id: "moderation__reports" });
            route("report/:reportId", path("report/report-details.tsx"), { id: "moderation__report__details" });
        });

        // Report
        route("report", path("report/page.tsx"), { id: "report_page" });

        // Miscellaneous pages
        route("md-editor", path("editor/page.tsx"), { id: "md-editor" });

        // Sitemap
        route("/:sitemap.xml", path("sitemap.tsx"), { id: "sitemaps" });

        // Not found
        route("*", path("$.tsx"), { id: "global__not-found" });
    });
}) satisfies RouteConfig;

function path(pathname: string, prefix = "routes") {
    return `${prefix}/${pathname}`;
}
