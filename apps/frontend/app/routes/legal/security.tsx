import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function () {
    const { t } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bright-heading rounded-lg bg-card-background p-6"
            text={t.legal.securityNotice({
                title: t.legal.securityNoticeTitle,
                adminEmail: Config.ADMIN_EMAIL,
                siteName_Short: Config.SITE_NAME_SHORT,
            })}
        />
    );
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.legal.securityNoticeTitle, Config.SITE_NAME_SHORT),
        description: t.meta.securityNoticePageDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: undefined,
    });
}
