import { AuthActionIntent, AuthProvider } from "@app/utils/types";
import React from "react";
import type { useLocation } from "react-router";
import { DiscordIcon, GithubIcon, GitlabIcon, GoogleIcon } from "~/components/icons";
import { VariantButtonLink } from "~/components/ui/link";
import Config from "~/utils/config";
import { FormatUrl_WithHintLocale } from "~/utils/urls";

export const ConfiguredAuthProviders = [AuthProvider.GITHUB, AuthProvider.DISCORD, AuthProvider.GOOGLE, AuthProvider.GITLAB];

export const authProvidersList = [
    {
        name: AuthProvider.GITHUB,
        icon: <GithubIcon className="aspect-square h-[80%] w-[80%] text-foreground" />,
    },
    {
        name: AuthProvider.DISCORD,
        icon: <DiscordIcon className="aspect-square h-[75%] w-[75%]" />,
    },
    {
        name: AuthProvider.GOOGLE,
        icon: <GoogleIcon className="aspect-square h-[100%] w-[100%]" />,
    },
    {
        name: AuthProvider.GITLAB,
        icon: <GitlabIcon className="aspect-square h-[95%] w-[95%]" />,
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
                            to={url}
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
