import { ArrowUpRightIcon, LanguagesIcon, LinkIcon, Settings2Icon } from "lucide-react";
import { type LinkProps, useLocation } from "react-router";
import { BrandIcon } from "~/components/icons";
import Link, { LinkPrefetchStrategy, TextLink, VariantButtonLink } from "~/components/ui/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { DotSeparator } from "~/components/ui/separator";
import { usePreferences } from "~/hooks/preferences";
import { formatLocaleCode, parseLocale } from "~/locales";
import { SupportedLocalesList } from "~/locales/meta";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { changeHintLocale } from "~/utils/urls";

export default function Footer() {
    const { updatePreferences } = usePreferences();
    const { t, changeLocale } = useTranslation();
    const location = useLocation();

    const footer = t.footer;
    const legal = t.legal;

    return (
        <footer className="mx-auto w-full bg-card-background/50 pt-20 pb-8">
            <div className="footer-grid container gap-y-5 pb-16">
                <LinksColumn area="logo">
                    <span
                        className="flex items-center justify-center gap-2 font-bold text-[1.72rem] leading-none"
                        title={Config.SITE_NAME_LONG}
                    >
                        <BrandIcon aria-label="Logo" className="h-11 w-11" />
                        {Config.SITE_NAME_SHORT}
                    </span>
                </LinksColumn>

                <LinksColumn area="links-1">
                    <Title>{footer.resources}</Title>

                    <FooterLink to="https://docs.crmm.tech" aria-label={footer.docs} target="_blank">
                        {footer.docs}
                        <OpenInNewTab_Icon />
                    </FooterLink>

                    <FooterLink to="/status" aria-label={footer.status}>
                        {footer.status}
                    </FooterLink>

                    <FooterLink to={`mailto:${Config.SUPPORT_EMAIL}`} aria-label={footer.support} target="_blank">
                        {footer.support}
                        <OpenInNewTab_Icon />
                    </FooterLink>
                </LinksColumn>

                <LinksColumn area="links-2">
                    <Title>{footer.socials}</Title>
                    <FooterLink to="/about" aria-label={footer.about}>
                        {footer.about}
                    </FooterLink>

                    <FooterLink to="https://github.com/PuzzlesHQ/cosmic-mod-manager" aria-label="GitHub Repo" target="_blank">
                        Github
                        <OpenInNewTab_Icon />
                    </FooterLink>

                    <FooterLink to={Config.DISCORD_INVITE} aria-label="Discord Invite" target="_blank">
                        Discord
                        <OpenInNewTab_Icon />
                    </FooterLink>
                </LinksColumn>

                <LinksColumn area="links-3">
                    <Link to="/legal" className="flex items-center gap-2 hover:underline">
                        <Title>{legal.legal}</Title>
                        <LinkIcon className="h-3.5 w-3.5 text-foreground-muted" />
                    </Link>

                    <FooterLink to="/legal/terms" aria-label={legal.termsTitle}>
                        {legal.termsTitle}
                    </FooterLink>

                    <FooterLink to="/legal/privacy" aria-label={legal.privacyPolicyTitle}>
                        {legal.privacyPolicyTitle}
                    </FooterLink>

                    <FooterLink to="/legal/rules" aria-label={legal.rulesTitle}>
                        {legal.rulesTitle}
                    </FooterLink>
                </LinksColumn>

                <div
                    style={{ gridArea: "buttons" }}
                    className="grid h-fit grid-cols-1 place-items-center gap-2 lg:place-items-start"
                >
                    <VariantButtonLink
                        prefetch={LinkPrefetchStrategy.Render}
                        to="/settings"
                        variant="outline"
                        className="rounded-full"
                    >
                        <Settings2Icon aria-hidden className="h-btn-icon-md w-btn-icon-md" aria-label={t.common.settings} />
                        {t.common.settings}
                    </VariantButtonLink>

                    <div className="">
                        <LangSwitcher />
                    </div>
                </div>
            </div>

            <div className="container flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-[small]">
                <span>{t.footer.siteOfferedIn(Config.SITE_NAME_SHORT)}</span>

                {SupportedLocalesList.map((locale) => {
                    const region = locale?.region;
                    const label = region ? `${locale.nativeName} (${region.displayName})` : locale.nativeName;
                    const title = region ? `${locale.name} - ${region.name}` : locale.name;

                    const formattedCode = formatLocaleCode(locale);
                    const url = changeHintLocale(locale, location.pathname);

                    return (
                        <TextLink
                            key={url}
                            to={url}
                            aria-label={title}
                            title={title}
                            preventScrollReset
                            escapeUrlWrapper
                            onClick={(e) => {
                                e.preventDefault();

                                updatePreferences({ locale: formattedCode });
                                changeLocale(formattedCode);
                            }}
                        >
                            {label}
                        </TextLink>
                    );
                })}
            </div>
        </footer>
    );
}

function Title({ children }: { children: React.ReactNode }) {
    return <h4 className="font-bold text-foreground-bright">{children}</h4>;
}

function FooterLink({ children, ...props }: LinkProps) {
    return (
        <Link
            {...props}
            prefetch={LinkPrefetchStrategy.Viewport}
            className="flex w-fit items-center justify-center gap-1 text-foreground-muted leading-none hover:text-foreground hover:underline lg:justify-start"
        >
            {children}
        </Link>
    );
}

function OpenInNewTab_Icon() {
    return <ArrowUpRightIcon aria-hidden aria-label="Open in new tab" className="inline h-4 w-4 text-foreground-extra-muted" />;
}

function LinksColumn({ children, area }: { area: string; children: React.ReactNode }) {
    return (
        <div style={{ gridArea: area }} className="grid h-fit place-items-center gap-4 lg:me-16 lg:place-items-start">
            {children}
        </div>
    );
}

export function LangSwitcher() {
    const { updatePreferences } = usePreferences();
    const { locale, changeLocale } = useTranslation();

    const formattedLocale = formatLocaleCode(locale);
    const currLocaleLabel = locale.region ? `${locale.nativeName} (${locale.region.displayName})` : locale.nativeName;

    return (
        <Select
            onValueChange={(value: string) => {
                updatePreferences({ locale: parseLocale(value) });
                changeLocale(value);
            }}
            value={formattedLocale}
        >
            <SelectTrigger
                aria-label={currLocaleLabel}
                className="rounded-full ps-4"
                variant="outline"
                style={{
                    minWidth: `calc(${currLocaleLabel.length}ch + 1.3rem)`,
                }}
            >
                <LanguagesIcon
                    aria-hidden
                    className="h-btn-icon-md w-btn-icon-md text-foreground-muted"
                    aria-label="Language switcher"
                />
                <SelectValue className="flex items-center justify-start" placeholder={<p>{formattedLocale}</p>} />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {SupportedLocalesList?.map((locale) => {
                        const region = locale.region;
                        const label = region ? `${locale.name} (${region.displayName})` : locale.name;

                        return (
                            <SelectItem key={label} value={formatLocaleCode(locale)} aria-label={label} title={label}>
                                <div className="flex w-full items-center justify-center gap-1.5 break-words">
                                    <span className="flex items-end justify-center align-bottom">{locale.nativeName}</span>
                                    {region ? (
                                        <>
                                            <DotSeparator className="bg-foreground-extra-muted" />
                                            <span className="text-foreground-muted/85 text-sm">{region.displayName}</span>
                                        </>
                                    ) : null}
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
