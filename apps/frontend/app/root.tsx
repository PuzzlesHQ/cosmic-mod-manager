import "./index.css";

import { getCookie } from "@app/utils/cookie";
import type { LoggedInUserData } from "@app/utils/types";
import { useEffect } from "react";
import type { LinkDescriptor } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, type ShouldRevalidateFunctionArgs, useLoaderData } from "react-router";
import ClientOnly from "~/components/client-only";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/Navbar/navbar";
import { DownloadRipple } from "~/components/misc/download-animation";
import LoaderBar from "~/components/misc/loader-bar";
import ToastAnnouncer from "~/components/toast-announcer";
import { useNavigate } from "~/components/ui/link";
import { getUserConfig, type UserConfig } from "~/hooks/user-config";
import SupportedLocales, { DefaultLocale, GetLocaleMetadata } from "~/locales/meta";
import type { LocaleMetaData } from "~/locales/types";
import ContextProviders from "~/providers";
import ErrorView from "~/routes/error-view";
import clientFetch from "~/utils/client-fetch";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { FormatUrl_WithHintLocale, getHintLocale } from "~/utils/urls";
import type { Route } from "./+types/root";
import { PageBreadCrumbs } from "./hooks/breadcrumb";
import { formatLocaleCode, parseLocale } from "./locales";
import { useTranslation } from "./locales/provider";
import { LoginDialog } from "./pages/auth/login/login-card";
import Config from "./utils/config";
import { ASSETS_SERVER_URL } from "./utils/env";

export interface RootOutletData {
    userConfig: UserConfig;
    session: LoggedInUserData | null;
    locale: LocaleMetaData;
    supportedLocales: LocaleMetaData[];
    defaultLocale: LocaleMetaData;
}

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData() as RootOutletData;

    return (
        <html lang={formatLocaleCode(data.locale)} className={data?.userConfig.theme} dir={data.locale.dir || "ltr"}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="publisher" content={Config.SITE_NAME_SHORT} />
                <meta name="theme-color" content="#F04570" />
                <meta name="color-scheme" content="dark light" />
                <meta property="og:logo" content={Config.SITE_ICON} />
                <meta name="google-site-verification" content="saVDIhLaNSit_2LnqK9Zz-yxY2hMGTEC_Vud5v7-Tug" />
                {/* <script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" /> */}
                <Meta />
                <Links />
                <script
                    defer
                    src={`${ASSETS_SERVER_URL || "/"}telemetry.js`}
                    data-website-id="1bbb8989-cc84-4b4c-bfca-51e53779f587"
                    data-exclude-search="true"
                    data-exclude-hash="true"
                />
            </head>
            <body className="antialiased">
                {children}

                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const data = useLoaderData() as RootOutletData;

    // HANDLE SAME SITE NAVIGATIONS FROM MARKDOWN RENDERED LINKS
    const navigate = useNavigate();

    // Use React router to handle internal links
    function handleNavigate(e: MouseEvent) {
        try {
            if (!(e.target instanceof HTMLAnchorElement)) return;
            e.preventDefault();

            const target = e.target as HTMLAnchorElement;
            const targetUrl = new URL(target.href);

            if (target.getAttribute("href")?.startsWith("#")) {
                navigate(`${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`, { preventScrollReset: true });
                return;
            }

            const targetHost = targetUrl.hostname;
            const currHost = window.location.hostname;

            if (currHost.replace("www.", "") !== targetHost.replace("www.", "")) {
                window.open(targetUrl.href, "_blank");
                return;
            }

            navigate(`${targetUrl.pathname}${targetUrl.search}`, { viewTransition: true });
        } catch {}
    }

    useEffect(() => {
        function delegateMdLinkClick(e: MouseEvent) {
            if (!e.target) return;
            if (e.ctrlKey || e.metaKey || e.shiftKey) return;

            // @ts-ignore
            if (e.target?.closest(".markdown-body")) {
                handleNavigate(e);
            }
        }

        document.body.addEventListener("click", delegateMdLinkClick);
        return () => document.body.removeEventListener("click", delegateMdLinkClick);
    }, []);

    return (
        <ContextProviders theme={data.userConfig.theme}>
            {!data.session?.id && <LoginDialog isMainDialog />}
            <ValidateClientSession />
            <ClientOnly Element={ToastAnnouncer} />
            <ClientOnly Element={LoaderBar} />

            {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
            <div id="hero_section_bg_portal" className="absolute top-0 left-0" aria-hidden />

            <div className="relative grid min-h-[100vh] w-full grid-rows-[auto_1fr_auto]">
                <Navbar session={data.session} />

                <PageBreadCrumbs />

                <div className="full_page container px-4 sm:px-8">
                    <Outlet context={data satisfies RootOutletData} />
                </div>

                <Footer />
            </div>

            <DownloadRipple />
        </ContextProviders>
    );
}

export async function loader({ request }: Route.LoaderArgs): Promise<RootOutletData> {
    const reqUrl = new URL(request.url);
    let session: LoggedInUserData | null = null;
    const cookie = request.headers.get("Cookie") || "";

    if (getCookie("auth-token", cookie)?.length) {
        const sessionRes = await serverFetch(request, "/api/auth/me");
        session = await resJson<LoggedInUserData>(sessionRes);

        if (!session?.id) session = null;
    }

    // Preferences
    const userConfig = await getUserConfig(cookie);

    const hintLocale = getHintLocale(reqUrl.searchParams);
    // The locale obtained from the request url
    const hintLocale_Metadata = GetLocaleMetadata(hintLocale) || DefaultLocale;
    // The locale that is set in user's preference
    // Url locale takes priority over the prefs locale from the cookie
    const cookieLocale_Metadata = GetLocaleMetadata(parseLocale(userConfig.locale)) || DefaultLocale;

    let currLocale = hintLocale_Metadata;
    if (!hintLocale) currLocale = cookieLocale_Metadata;

    // If there's no hintLocale and user has a non default locale set, redirect to the url with user's locale
    if (!hintLocale.length && formatLocaleCode(cookieLocale_Metadata) !== formatLocaleCode(hintLocale_Metadata)) {
        const localeFormattedUrl = FormatUrl_WithHintLocale(reqUrl.pathname, formatLocaleCode(currLocale));
        throw Response.redirect(new URL(localeFormattedUrl, Config.FRONTEND_URL), 302);
    }

    return {
        userConfig: userConfig,
        session: session as LoggedInUserData | null,
        locale: currLocale,
        supportedLocales: SupportedLocales,
        defaultLocale: DefaultLocale,
    };
}

export function shouldRevalidate({ nextUrl }: ShouldRevalidateFunctionArgs) {
    const revalidate = nextUrl.searchParams.get("revalidate") === "true";

    if (revalidate) return true;
    return false;
}

const headLinks: LinkDescriptor[] = [
    {
        rel: "icon",
        type: "image/png",
        href: "/icon.png",
    },
    {
        rel: "apple-touch-icon",
        type: "image/png",
        sizes: "180*180",
        href: "/icon.png",
    },
    {
        rel: "preload",
        as: "font",
        href: "https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7SUc.woff2",
        crossOrigin: "anonymous",
    },
    {
        rel: "preload",
        as: "font",
        href: "https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2",
        crossOrigin: "anonymous",
    },
];

if (ASSETS_SERVER_URL) {
    headLinks.push({
        rel: "preconnect",
        href: ASSETS_SERVER_URL,
    });
}

export function links(): LinkDescriptor[] {
    return headLinks;
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: Config.SITE_NAME_LONG,
        description: t.meta.siteDesc(Config.SITE_NAME_LONG, Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL,
    });
}

export function ErrorBoundary() {
    return <ErrorView />;
}

function ValidateClientSession() {
    useEffect(() => {
        clientFetch("/api/auth/me");
    }, []);

    return null;
}
