import { DownloadProvider } from "~/components/misc/file-downloader";
import { Toaster } from "~/components/ui/sonner";
import { BreadcrumbsContextProvider } from "~/hooks/breadcrumb";
import type { UserPreferences } from "~/hooks/preferences/types";
import { CollectionsProvider } from "~/pages/collection/provider";
import { UserPreferencesProvider } from "./hooks/preferences";

interface ContextProvidersProps {
    children: React.ReactNode;
    init_userConfig: UserPreferences;
}

export default function ContextProviders({ children, init_userConfig }: ContextProvidersProps) {
    return (
        <UserPreferencesProvider init={init_userConfig}>
            <BreadcrumbsContextProvider>
                <DownloadProvider>
                    <CollectionsProvider>{children}</CollectionsProvider>
                    <Toaster />
                </DownloadProvider>
            </BreadcrumbsContextProvider>
        </UserPreferencesProvider>
    );
}
