import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { changeHintLocale } from "~/utils/urls";
import type { Route } from "./+types/rules";

export default function () {
    const { t, locale } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bright-heading rounded-lg bg-card-background p-6"
            text={t.legal.contentRules({
                title: t.legal.rulesTitle,
                supportEmail: "support@crmm.tech",
                privacyPageUrl: changeHintLocale(locale, "legal/privacy"),
                termsPageUrl: changeHintLocale(locale, "legal/terms"),
                siteName_Short: Config.SITE_NAME_SHORT,
            })}
        />
    );
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.legal.rulesTitle, Config.SITE_NAME_SHORT),
        description: t.meta.contentRulesPageDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: undefined,
    });
}
