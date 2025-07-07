import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function () {
    const { t } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bright-heading rounded-lg bg-card-background p-6"
            text={t.legal.copyrightPolicy({
                title: t.legal.copyrightPolicyTitle,
                adminEmail: Config.ADMIN_EMAIL,
                siteName_Short: Config.SITE_NAME_SHORT,
                siteName_Long: Config.SITE_NAME_LONG,
            })}
        />
    );
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.legal.copyrightPolicyTitle, Config.SITE_NAME_SHORT),
        description: t.meta.copyrightPolicyPageDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: undefined,
    });
}
