import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { useTranslation } from "~/locales/provider";
import { setHintLocale } from "~/locales/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/privacy";

export default function () {
    const { t, locale } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bright-heading rounded-lg bg-card-background p-6"
            text={t.legal.privacyPolicy({
                title: t.legal.privacyPolicyTitle,
                supportEmail: Config.SUPPORT_EMAIL,
                siteName_Short: Config.SITE_NAME_SHORT,
                siteName_Long: Config.SITE_NAME_LONG,
                websiteUrl: Config.FRONTEND_URL,
                sessionSettings_PageUrl: setHintLocale("settings/sessions", locale),
                accountSettings_PageUrl: setHintLocale("settings/account", locale),
            })}
        />
    );
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.legal.privacyPolicyTitle, Config.SITE_NAME_SHORT),
        description: t.meta.privacyPolicyPageDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: undefined,
    });
}
