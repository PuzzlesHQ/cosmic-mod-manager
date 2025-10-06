import { DownloadProvider } from "~/components/misc/file-downloader";
import { Toaster } from "~/components/ui/sonner";
import type { UserPreferences } from "~/hooks/preferences/types";
import { CollectionsProvider } from "~/pages/collection/provider";
import { ChangeUrlHintOnLocaleChange } from "./global-effects";
import { PageBreadCrumbs } from "./hooks/breadcrumb";
import { UserPreferencesProvider } from "./hooks/preferences";

interface ContextProvidersProps {
    children: React.ReactNode;
    init_userConfig: UserPreferences;
}

export default function ContextProviders({ children, init_userConfig }: ContextProvidersProps) {
    return (
        <UserPreferencesProvider init={init_userConfig}>
            <DownloadProvider>
                <CollectionsProvider>
                    {children}
                    <GlobalEffects />
                </CollectionsProvider>
            </DownloadProvider>
        </UserPreferencesProvider>
    );
}

function GlobalEffects() {
    return (
        <>
            <Toaster />
            <PageBreadCrumbs />
            <ChangeUrlHintOnLocaleChange />
        </>
    );
}
