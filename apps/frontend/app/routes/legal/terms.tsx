import MarkdownRenderBox from "~/components/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function () {
    const { t } = useTranslation();

    return (
        <MarkdownRenderBox
            className="bg-card-background bright-heading p-6 rounded-lg"
            text={t.legal.termsOfUse({
                title: t.legal.termsTitle,
                supportEmail: Config.SUPPORT_EMAIL,
            })}
        />
    );
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.legal.termsTitle, Config.SITE_NAME_SHORT),
        description: t.meta.tosPageDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: undefined,
    });
}
