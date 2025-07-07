import { CopyrightIcon, HeartHandshakeIcon, LockIcon, ScaleIcon, ShieldIcon } from "lucide-react";
import { Outlet } from "react-router";
import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "~/components/misc/panel";
import { ButtonLink, Prefetch } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import { FormatUrl_WithHintLocale } from "~/utils/urls";

export default function () {
    const { t } = useTranslation();
    const legal = t.legal;

    const links = [
        {
            name: legal.termsTitle,
            href: "/legal/terms",
            icon: <HeartHandshakeIcon aria-hidden size="1rem" />,
        },
        {
            name: legal.rulesTitle,
            href: "/legal/rules",
            icon: <ScaleIcon aria-hidden size="1rem" />,
        },
        {
            name: legal.copyrightPolicyTitle,
            href: "/legal/copyright",
            icon: <CopyrightIcon aria-hidden size="1rem" />,
        },
        {
            name: legal.securityNoticeTitle,
            href: "/legal/security",
            icon: <ShieldIcon aria-hidden size="1rem" />,
        },
        {
            name: legal.privacyPolicyTitle,
            href: "/legal/privacy",
            icon: <LockIcon aria-hidden size="1rem" />,
        },
    ];

    return (
        <Panel className="pb-12">
            <PanelAside aside>
                <PanelAsideNavCard label={legal.legal}>
                    {links.map((link) => (
                        <ButtonLink
                            prefetch={Prefetch.Render}
                            url={FormatUrl_WithHintLocale(link.href)}
                            key={link.href}
                            className="relative"
                            preventScrollReset
                        >
                            {link.icon}
                            <span className="text-wrap leading-tight">{link.name}</span>
                        </ButtonLink>
                    ))}
                </PanelAsideNavCard>
            </PanelAside>
            <PanelContent main>
                <Outlet />
            </PanelContent>
        </Panel>
    );
}
