import { useTranslation } from "~/locales/provider";
import ModerationPagesLayout from "~/pages/moderation/layout";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/layout";

export default ModerationPagesLayout;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.moderation.moderation, Config.SITE_NAME_SHORT),
        description: t.moderation.moderation,
        image: Config.SITE_ICON,
        url: undefined,
    });
}
