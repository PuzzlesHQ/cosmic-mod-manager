import { MonitorSmartphoneIcon, PaintbrushIcon, ShieldIcon, UserIcon } from "lucide-react";
import { useMemo } from "react";
import { Outlet } from "react-router";
import { Panel, PanelContent, SidePanel, type SidePanelSection } from "~/components/misc/panel";
import { LinkPrefetchStrategy } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";

export default function SettingsPageLayout() {
    const session = useSession();
    const { t, formattedLocaleName } = useTranslation();

    const sidePanelSections = useMemo(() => {
        const sections: SidePanelSection[] = [
            {
                items: [
                    {
                        label: t.settings.preferences,
                        href: "/settings",
                        icon: <PaintbrushIcon aria-hidden className="size-4" />,
                        prefetch: LinkPrefetchStrategy.Render,
                    },
                ],
            },
        ];

        if (!session?.id) return sections;

        sections.push({
            name: t.settings.account,
            items: [
                {
                    label: t.settings.publicProfile,
                    href: "/settings/profile",
                    icon: <UserIcon aria-hidden className="size-4" />,
                    prefetch: LinkPrefetchStrategy.Render,
                },
                {
                    label: t.settings.accountAndSecurity,
                    href: "/settings/account",
                    icon: <ShieldIcon aria-hidden className="size-4" />,
                },
                {
                    label: t.settings.sessions,
                    href: "/settings/sessions",
                    icon: <MonitorSmartphoneIcon aria-hidden className="size-4" />,
                },
            ],
        });
        return sections;
    }, [session?.id, formattedLocaleName]);

    return (
        <main className="w-full">
            <Panel>
                <SidePanel header={t.common.settings} sections={sidePanelSections} />

                <PanelContent>
                    <Outlet />
                </PanelContent>
            </Panel>
        </main>
    );
}
