import { useTranslation } from "~/locales/provider";
import ModerationPagesLayout from "~/pages/moderation/layout";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default ModerationPagesLayout;

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.moderation.moderation, Config.SITE_NAME_SHORT),
        description: t.moderation.moderation,
        image: Config.SITE_ICON,
        url: undefined,
    });
}
