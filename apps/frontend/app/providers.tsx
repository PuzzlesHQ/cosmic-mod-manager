import { DownloadProvider } from "~/components/misc/file-downloader";
import type { UserPreferences } from "~/hooks/preferences/types";
import { CollectionsProvider } from "~/pages/collection/provider";
import { AppWidgets } from "./app-widgets";
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
					
                    <AppWidgets />
                </CollectionsProvider>
            </DownloadProvider>
        </UserPreferencesProvider>
    );
}

