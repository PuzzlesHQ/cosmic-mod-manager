import type { RouteConfig } from "@react-router/dev/routes";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";

const ProjectTypes = ["project", "mod", "modpack", "shader", "resource-pack", "datamod", "plugin", "world"];

export default remixRoutesOptionAdapter((defineRoutes) => {
    return defineRoutes((route) => {
        route("", path("page.tsx"), { id: "__home-page", index: true });
        route("about", path("about.tsx"), { id: "__about-page" });
        route("status", path("status.tsx"), { id: "__status-page" });

        // Auth routes
        route("login", path("auth/login.tsx"), { id: "__login-page" });
        route("signup", path("auth/signup.tsx"), { id: "__signup-page" });
        route("change-password", path("auth/change-password.tsx"), { id: "__change-password-page" });
        route("auth/revoke-session", path("auth/revoke-session.tsx"), { id: "__revoke-session-page" });
        route("auth/confirm-action", path("auth/confirm-action.tsx"), { id: "__confirm-action-page" });
        route("auth/callback/:authProvider", path("auth/auth-callback.tsx"), {
            id: "__auth-callback-page",
        });

        // User Settings
        route("settings", path("settings/layout.tsx"), { id: "__settings-layout" }, () => {
            route("", path("settings/prefs.tsx"), { index: true, id: "__prefs" });
            route("profile", path("settings/profile.tsx"), { id: "__profile-settings" });
            route("account", path("settings/account.tsx"), { id: "__account-settings" });
            route("sessions", path("settings/sessions.tsx"), { id: "__sessions-settings" });
        });

        // Dashboard
        route("dashboard", path("dashboard/layout.tsx"), { id: "__dashboard-layout" }, () => {
            route("", path("dashboard/overview.tsx"), { index: true, id: "__overview" });
            route("notifications", path("dashboard/notifications/page.tsx"), { id: "__notifications" });
            route("notifications/history", path("dashboard/notifications/history.tsx"), {
                id: "__notifications-history",
            });

            route("analytics", path("dashboard/analytics.tsx"), { id: "__analytics" });

            route("projects", path("dashboard/projects.tsx"), { id: "__dashboard-projects" });
            route("organizations", path("dashboard/organizations.tsx"), {
                id: "__dashboard-organizations",
            });
            route("collections", path("dashboard/collections.tsx"), { id: "__dashboard-collections" });
            route("*", path("$.tsx"), { id: "__dashboard-not-found" });
        });

        // Search pages
        route("", path("search/layout.tsx"), { id: "__search-layout" }, () => {
            for (const type of ProjectTypes) {
                route(`${type}s`, path("search/page.tsx"), { id: `__${type}s-search` });
            }
        });

        for (const type of ProjectTypes) {
            // Project pages
            route(`${type}/:projectSlug`, path("project/data-wrapper.tsx"), { id: `__${type}__data-wrapper` }, () => {
                route("", path("project/layout.tsx"), { id: `__${type}__layout` }, () => {
                    route("", path("project/page.tsx"), { index: true, id: `__${type}__page` });
                    route("gallery", path("project/gallery.tsx"), { id: `__${type}__gallery` });
                    route("changelog", path("project/changelog.tsx"), {
                        id: `__${type}__changelog`,
                    });
                    route("versions", path("project/versions.tsx"), { id: `__${type}__versions` });
                    route("moderation", path("project/moderation.tsx"), { id: `__${type}__moderation` });

                    route("version", path("project/versions.tsx"), {
                        id: `__${type}__versions_alternate`,
                    });
                    route("version/:versionSlug", path("project/version/page.tsx"), {
                        id: `__${type}__version__page`,
                    });
                    route("version/new", path("project/version/new.tsx"), {
                        id: `__${type}__version__new`,
                    });
                    route("version/:versionSlug/edit", path("project/version/edit.tsx"), {
                        id: `__${type}__version__edit`,
                    });
                });
                route("settings", path("project/settings/layout.tsx"), { id: `__${type}__settings-layout` }, () => {
                    route("", path("project/settings/general.tsx"), {
                        id: `__${type}__settings__general`,
                        index: true,
                    });
                    route("tags", path("project/settings/tags.tsx"), {
                        id: `__${type}__settings__tags`,
                    });
                    route("description", path("project/settings/description.tsx"), {
                        id: `__${type}__settings__description`,
                    });
                    route("license", path("project/settings/license.tsx"), {
                        id: `__${type}__settings__license`,
                    });
                    route("links", path("project/settings/links.tsx"), {
                        id: `__${type}__settings__links`,
                    });
                    route("members", path("project/settings/members.tsx"), {
                        id: `__${type}__settings__members`,
                    });
                    route("analytics", path("project/settings/analytics.tsx"), {
                        id: `__${type}__settings__analytics`,
                    });
                    route("*", path("$.tsx"), { id: `__${type}__settings-not-found` });
                });
            });
        }

        // Organization pages
        route("organization/:orgSlug", path("organization/data-wrapper.tsx"), { id: "__organization-data-wrapper" }, () => {
            route("settings", path("organization/settings/layout.tsx"), { id: "__org-settings" }, () => {
                route("", path("organization/settings/page.tsx"), {
                    index: true,
                    id: "__org-general-settings",
                });
                route("projects", path("organization/settings/projects.tsx"), {
                    id: "__org-projects-settings",
                });
                route("members", path("organization/settings/members.tsx"), {
                    id: "__org-members-settings",
                });
                route("analytics", path("organization/settings/analytics.tsx"), {
                    id: "__org-analytics-page",
                });
                route("*", path("$.tsx"), { id: "__org-settings-not-found" });
            });

            route("", path("organization/layout.tsx"), { id: "__organization__layout" }, () => {
                route("", path("organization/page.tsx"), {
                    index: true,
                    id: "__organization__projects-all",
                });
                route(":projectType", path("organization/page.tsx"), {
                    id: "__organization__projects",
                });
            });
        });

        // Collections page
        route("collection/:collectionId", path("collection/layout.tsx"), { id: "__collection__layout" }, () => {
            route("", path("collection/page.tsx"), {
                index: true,
                id: "__collection__projects-all",
            });
            route(":projectType", path("collection/page.tsx"), { id: "__collection__projects" });
        });

        // User profile
        route("user/:userName", path("user/layout.tsx"), { id: "__user-profile" }, () => {
            route("", path("user/page.tsx"), { index: true, id: "__user__all-projects" });
            route(":type", path("user/page.tsx"), { id: "__user__projects" });
        });

        route("legal", path("legal/layout.tsx"), { id: "__legal-pages" }, () => {
            route("", path("legal/terms.tsx"), { id: "__legal__index-page", index: true });
            route("terms", path("legal/terms.tsx"), { index: true, id: "__terms" });
            route("rules", path("legal/rules.tsx"), { id: "__content-rules" });
            route("copyright", path("legal/copyright.tsx"), { id: "__copyright-policy" });
            route("security", path("legal/security.tsx"), { id: "__security-notice" });
            route("privacy", path("legal/privacy.tsx"), { id: "__privacy-policy" });
        });

        // Moderation pages
        route("moderation", path("moderation/layout.tsx"), { id: "__moderation-pages" }, () => {
            route("", path("moderation/page.tsx"), { id: "__moderation__index-page", index: true });
            route("analytics", path("moderation/analytics.tsx"), { id: "__moderation__analytics-page" });
            route("review", path("moderation/review.tsx"), { id: "__moderation__review-page" });
        });

        // Miscellaneous pages
        route("md-editor", path("editor/page.tsx"), { id: "__md-editor" });

        // Sitemap
        route("/:sitemap.xml", path("sitemap.tsx"), { id: "sitemaps" });

        // Not found
        route("*", path("$.tsx"), { id: "global__not-found" });
    });
}) satisfies RouteConfig;

function path(pathname: string, prefix = "routes") {
    return `${prefix}/${pathname}`;
}
