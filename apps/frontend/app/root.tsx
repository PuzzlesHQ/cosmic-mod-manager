import "~/index.css";

import { getCookie } from "@app/utils/cookie";
import type { LoggedInUserData } from "@app/utils/types";
import { useEffect } from "react";
import type { LinkDescriptor } from "react-router";
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    type ShouldRevalidateFunctionArgs,
    useLoaderData,
} from "react-router";
import ClientOnly from "~/components/client-only";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/Navbar/navbar";
import { MarkdownLinkHandler } from "~/components/md-editor/link-handler";
import { DownloadRipple } from "~/components/misc/file-downloader";
import LoaderBar from "~/components/misc/loader-bar";
import { shouldForceRevalidate } from "~/components/misc/refresh-page";
import { cn } from "~/components/utils";
import { getUserConfig } from "~/hooks/preferences/helpers";
import { getThemeClassName } from "~/hooks/preferences/theme";
import type { UserPreferences } from "~/hooks/preferences/types";
import { formatLocaleCode, getValidLocaleCode } from "~/locales";
import SupportedLocales, { DefaultLocale_Meta, getMetadataFromLocaleCode } from "~/locales/meta";
import { useTranslation } from "~/locales/provider";
import type { LocaleMetaData } from "~/locales/types";
import { getHintLocale, setHintLocale } from "~/locales/utils";
import { LoginDialog } from "~/pages/auth/login/login-card";
import ContextProviders from "~/providers";
import ErrorView from "~/routes/error-view";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/root";

const ASSETS_SERVER_URL = import.meta.env.BASE_URL;

export interface RootOutletData {
    userConfig: UserPreferences;
    session: LoggedInUserData | null;
    locale: LocaleMetaData;
    supportedLocales: LocaleMetaData[];
    defaultLocale: LocaleMetaData;
}

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData() as RootOutletData;
    const classes = getThemeClassName(data.userConfig.theme, data.userConfig.prefersOLED);

    return (
        <html lang={formatLocaleCode(data.locale)} className={cn(classes)} dir={data.locale.dir || "ltr"}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="publisher" content={Config.SITE_NAME_SHORT} />
                <meta name="theme-color" content="#F04570" />
                <meta name="color-scheme" content="dark light" />
                <meta property="og:logo" content={Config.SITE_ICON} />
                <meta name="google-site-verification" content="saVDIhLaNSit_2LnqK9Zz-yxY2hMGTEC_Vud5v7-Tug" />
                <Meta />
                <Links />
                {!import.meta.env.DEV && (
                    <script
                        defer
                        src="https://static.cloudflareinsights.com/beacon.min.js"
                        data-cf-beacon='{"token": "17f7926d0f21488c8e26cb18e384aa2a"}'
                    ></script>
                )}
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

    return (
        <ContextProviders init_userConfig={data.userConfig}>
            <AppSetup data={data} />
        </ContextProviders>
    );
}

function AppSetup(props: { data: RootOutletData }) {
    const data = props.data;

    return (
        <>
            {!data.session?.id && <LoginDialog isMainDialog />}
            <ValidateClientSession />
            <ClientOnly Element={LoaderBar} />

            {/* A portal for the grid_bg_div inserted from the pages/page.tsx */}
            <div id="hero_section_bg_portal" className="absolute top-0 left-0" aria-hidden />

            <div className="relative grid min-h-[100vh] w-full grid-rows-[auto_1fr_auto]">
                <Navbar />

                <div className="full_page content-container">
                    <Outlet context={data satisfies RootOutletData} />
                </div>
                <Footer />
            </div>

            <DownloadRipple />
            <MarkdownLinkHandler />
        </>
    );
}

export async function loader({ request }: Route.LoaderArgs): Promise<RootOutletData> {
    const reqUrl = new URL(request.url);
    const cookie = request.headers.get("Cookie") || "";
    const userConfig = getUserConfig(cookie);

    const effectiveLocale = getValidLocaleCode(getHintLocale(reqUrl.searchParams) || userConfig.locale);
    const effectiveLocale_Meta = getMetadataFromLocaleCode(effectiveLocale) ?? DefaultLocale_Meta;

    const urlWithLocaleHint = setHintLocale(reqUrl, effectiveLocale, userConfig.locale, true);

    // if the current page URL doesn't have the correct locale hint, redirect to the same page with the correct hint
    // the frontend still works correctly, this is just to ensure that the URL always has the correct locale hint for better sharing and consistency
    if (urlWithLocaleHint !== reqUrl.href) {
        throw Response.redirect(urlWithLocaleHint, 302);
    }

    let session: LoggedInUserData | null = null;
    if (getCookie("auth-token", cookie)?.length) {
        const sessionRes = await serverFetch(request, "/api/auth/me");
        session = await resJson<LoggedInUserData>(sessionRes);

        if (!session?.id) session = null;
    }

    return {
        userConfig: userConfig,
        session: session as LoggedInUserData | null,
        locale: effectiveLocale_Meta,
        supportedLocales: SupportedLocales,
        defaultLocale: DefaultLocale_Meta,
    };
}

export function shouldRevalidate({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) {
    if (shouldForceRevalidate(currentUrl.searchParams, nextUrl.searchParams)) return true;
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
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
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

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
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
