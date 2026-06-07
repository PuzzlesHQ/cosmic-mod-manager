import { useTranslation } from "~/locales/provider";
import PreferencesPage from "~/pages/settings/preferences";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/prefs";

export default PreferencesPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.common.settings, t.settings.preferences),
        description: t.settings.preferences,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/settings`,
    });
}
