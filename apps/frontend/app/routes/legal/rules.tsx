import MarkdownRenderBox from "~/components/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { FormatUrl_WithHintLocale } from "~/utils/urls";

export default function () {
    const { t } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bg-card-background bright-heading p-6 rounded-lg"
            text={t.legal.contentRules({
                title: t.legal.rulesTitle,
                supportEmail: "support@crmm.tech",
                privacyPageUrl: FormatUrl_WithHintLocale("legal/privacy"),
                termsPageUrl: FormatUrl_WithHintLocale("legal/terms"),
                siteName_Short: Config.SITE_NAME_SHORT,
            })}
        />
    );
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.legal.rulesTitle, Config.SITE_NAME_SHORT),
        description: t.meta.contentRulesPageDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: undefined,
    });
}
