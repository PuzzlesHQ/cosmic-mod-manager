import { CopyrightIcon, HeartHandshakeIcon, LockIcon, ScaleIcon, ShieldIcon } from "lucide-react";
import { Outlet } from "react-router";
import { Panel, PanelContent, SidePanel } from "~/components/misc/panel";
import { useTranslation } from "~/locales/provider";

export default function () {
    const { t } = useTranslation();
    const legal = t.legal;

    return (
        <Panel className="pb-12">
            <SidePanel
                header={legal.legal}
                sections={[
                    {
                        items: [
                            {
                                label: legal.termsTitle,
                                href: "/legal/terms",
                                icon: <HeartHandshakeIcon aria-hidden className="aspect-square h-[65%]" />,
                            },
                            {
                                label: legal.rulesTitle,
                                href: "/legal/rules",
                                icon: <ScaleIcon aria-hidden className="aspect-square h-[65%]" />,
                            },
                            {
                                label: legal.copyrightPolicyTitle,
                                href: "/legal/copyright",
                                icon: <CopyrightIcon aria-hidden className="aspect-square h-[65%]" />,
                            },
                            {
                                label: legal.securityNoticeTitle,
                                href: "/legal/security",
                                icon: <ShieldIcon aria-hidden className="aspect-square h-[65%]" />,
                            },
                            {
                                label: legal.privacyPolicyTitle,
                                href: "/legal/privacy",
                                icon: <LockIcon aria-hidden className="aspect-square h-[65%]" />,
                            },
                        ],
                    },
                ]}
            />

            <PanelContent main>
                <Outlet />
            </PanelContent>
        </Panel>
    );
}
