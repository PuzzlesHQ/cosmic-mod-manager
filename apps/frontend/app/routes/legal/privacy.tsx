import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { FormatUrl_WithHintLocale } from "~/utils/urls";

export default function () {
    const { t } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bright-heading rounded-lg bg-card-background p-6"
            text={t.legal.privacyPolicy({
                title: t.legal.privacyPolicyTitle,
                supportEmail: Config.SUPPORT_EMAIL,
                siteName_Short: Config.SITE_NAME_SHORT,
                siteName_Long: Config.SITE_NAME_LONG,
                websiteUrl: Config.FRONTEND_URL,
                sessionSettings_PageUrl: `${Config.FRONTEND_URL}${FormatUrl_WithHintLocale("settings/sessions")}`,
                accountSettings_PageUrl: `${Config.FRONTEND_URL}${FormatUrl_WithHintLocale("settings/account")}`,
            })}
        />
    );
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.legal.privacyPolicyTitle, Config.SITE_NAME_SHORT),
        description: t.meta.privacyPolicyPageDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: undefined,
    });
}
