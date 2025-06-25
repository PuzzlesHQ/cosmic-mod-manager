import { BrandIcon } from "@app/components/icons";
import { buttonVariants } from "@app/components/ui/button";
import { Prefetch } from "@app/components/ui/link";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { DotSeparator } from "@app/components/ui/separator";
import { cn } from "@app/components/utils";
import { ArrowUpRightIcon, LanguagesIcon, LinkIcon, Settings2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { type LinkProps, useLocation } from "react-router";
import Link, { useNavigate, VariantButtonLink } from "~/components/ui/link";
import ThemeSwitch from "~/components/ui/theme-switcher";
import { useRootData } from "~/hooks/root-data";
import { setUserConfig } from "~/hooks/user-config";
import { formatLocaleCode, parseLocale } from "~/locales";
import SupportedLocales from "~/locales/meta";
import { alterUrlHintLocale, useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import "./styles.css";

export default function Footer() {
    const { t, changeLocale } = useTranslation();
    const footer = t.footer;
    const legal = t.legal;

    // Just to trigger a re-render when the url changes to keep the locale in sync
    useLocation();

    return (
        <footer className="w-full bg-card-background dark:bg-card-background/35 mt-24 pt-20 pb-8 mx-auto">
            <div className="footer-grid container gap-y-5 pb-16">
                <LinksColumn area="logo">
                    <span
                        className="flex gap-2 items-center justify-center text-[1.72rem] font-bold leading-none"
                        title={Config.SITE_NAME_LONG}
                    >
                        <BrandIcon size="2.75rem" aria-label="Logo" />
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
                    <Link to="/legal" className="flex gap-2 items-center hover:underline">
                        <Title>{legal.legal}</Title>
                        <LinkIcon className="text-muted-foreground h-3.5 w-3.5" />
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
                    className="grid grid-cols-1 h-fit gap-2 place-items-center lg:place-items-start"
                >
                    <ThemeSwitch
                        label={t.footer.changeTheme}
                        noDefaultStyle
                        variant="outline"
                        className="rounded-full px-1 gap-0"
                    />

                    <VariantButtonLink prefetch={Prefetch.Render} url="/settings" variant="outline" className="rounded-full">
                        <Settings2Icon aria-hidden className="w-btn-icon-md h-btn-icon-md" aria-label={t.common.settings} />
                        {t.common.settings}
                    </VariantButtonLink>

                    <div className="">
                        <LangSwitcher />
                    </div>
                </div>
            </div>

            <div className="container flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-[small]">
                <span>{t.footer.siteOfferedIn(Config.SITE_NAME_SHORT)}</span>

                {SupportedLocales.map((locale) => {
                    const region = locale.region;
                    const label = region ? `${locale.nativeName} (${region.displayName})` : locale.nativeName;
                    const title = region ? `${locale.name} - ${region.name}` : locale.name;

                    const formattedCode = formatLocaleCode(locale);
                    const url = alterUrlHintLocale(locale);

                    return (
                        <Link
                            key={url.href}
                            to={url.href.replace(url.origin, "")}
                            className="link_blue hover:underline"
                            aria-label={title}
                            title={title}
                            preventScrollReset
                            escapeUrlWrapper
                            onClick={() => {
                                setLocaleConfig(formattedCode);
                                changeLocale(formattedCode);
                            }}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </footer>
    );
}

function Title({ children }: { children: React.ReactNode }) {
    return <h4 className="text-foreground-bright font-bold">{children}</h4>;
}

function FooterLink({ children, ...props }: LinkProps) {
    return (
        <Link
            {...props}
            prefetch={Prefetch.Viewport}
            className="w-fit flex items-center justify-center lg:justify-start gap-1 leading-none text-muted-foreground hover:text-foreground hover:underline"
        >
            {children}
        </Link>
    );
}

function OpenInNewTab_Icon() {
    return <ArrowUpRightIcon aria-hidden aria-label="Open in new tab" className="w-4 h-4 text-extra-muted-foreground inline" />;
}

function LinksColumn({ children, area }: { area: string; children: React.ReactNode }) {
    return (
        <div style={{ gridArea: area }} className="grid gap-4 h-fit lg:me-16 place-items-center lg:place-items-start">
            {children}
        </div>
    );
}

export function LangSwitcher() {
    const ctx = useRootData();
    const { locale, changeLocale } = useTranslation();
    const [currLang, setCurrLang] = useState(formatLocaleCode(locale));
    const navigate = useNavigate(true);

    useEffect(() => {
        setCurrLang(formatLocaleCode(locale));
    }, [locale]);

    const currLocaleLabel = locale.region ? `${locale.nativeName} (${locale.region.displayName})` : locale.nativeName;

    return (
        <Select
            onValueChange={(value: string) => {
                setLocaleConfig(parseLocale(value));
                changeLocale(value, navigate);
            }}
            value={currLang}
        >
            <SelectTrigger
                noDefaultStyles
                aria-label={currLocaleLabel}
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
                style={{
                    minWidth: `calc(${currLocaleLabel.length}ch + 1.3rem)`,
                }}
            >
                <LanguagesIcon aria-hidden size="1.15rem" className="text-muted-foreground" aria-label="Language switcher" />
                <SelectValue className="flex items-center justify-start" placeholder={<p>{currLang}</p>} />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    {ctx.supportedLocales?.map((locale) => {
                        const region = locale.region;
                        const label = region ? `${locale.name} (${region.displayName})` : locale.name;

                        return (
                            <SelectItem key={label} value={formatLocaleCode(locale)} aria-label={label} title={label}>
                                <div className="w-full flex items-center justify-center gap-1.5 break-words">
                                    <span className="flex items-end justify-center align-bottom">{locale.nativeName}</span>
                                    {region ? (
                                        <>
                                            <DotSeparator className="bg-extra-muted-foreground" />
                                            <span className="text-sm text-muted-foreground/85">{region.displayName}</span>
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

function setLocaleConfig(locale: string) {
    setUserConfig({ locale: locale });
}
