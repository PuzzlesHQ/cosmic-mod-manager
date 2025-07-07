import { DiscordIcon, GithubIcon, GitlabIcon, GoogleIcon } from "@app/components/icons";
import { AuthActionIntent, AuthProvider } from "@app/utils/types";
import React from "react";
import type { useLocation } from "react-router";
import { VariantButtonLink } from "~/components/ui/link";
import Config from "~/utils/config";
import { FormatUrl_WithHintLocale } from "~/utils/urls";

export const ConfiguredAuthProviders = [AuthProvider.GITHUB, AuthProvider.DISCORD, AuthProvider.GOOGLE, AuthProvider.GITLAB];

export const authProvidersList = [
    {
        name: AuthProvider.GITHUB,
        icon: <GithubIcon size="1.3rem" className="text-foreground" />,
    },
    {
        name: AuthProvider.DISCORD,
        icon: <DiscordIcon size="1.4rem" className="text-foreground" />,
    },
    {
        name: AuthProvider.GOOGLE,
        icon: <GoogleIcon size="1.4rem" className="text-foreground" />,
    },
    {
        name: AuthProvider.GITLAB,
        icon: <GitlabIcon size="1.5rem" className="text-foreground" />,
    },
];

interface Props {
    actionIntent: AuthActionIntent;
}

export default function OAuthProvidersWidget({ actionIntent = AuthActionIntent.SIGN_IN }: Props) {
    return (
        <>
            {authProvidersList?.map((provider) => {
                const url = `${Config.BACKEND_URL_PUBLIC}/api/auth/${actionIntent}/${provider.name}?redirect=true`;

                return (
                    <React.Fragment key={provider.name}>
                        <VariantButtonLink
                            url={url}
                            aria-label={`Continue using ${provider.name}`}
                            className="w-full font-medium capitalize"
                            variant="secondary"
                        >
                            <i className="flex min-w-6 items-center justify-start">{provider.icon}</i>
                            {provider.name}
                        </VariantButtonLink>
                    </React.Fragment>
                );
            })}
        </>
    );
}

export function getReturnUrl() {
    return sessionStorage.getItem("returnTo") || "";
}

export function setReturnUrl(location: ReturnType<typeof useLocation>) {
    if (location.pathname.startsWith("/login") || location.pathname.startsWith("/signup")) return;

    const returnTo = location.pathname;
    sessionStorage.setItem("returnTo", encodeURIComponent(FormatUrl_WithHintLocale(returnTo)));
}
