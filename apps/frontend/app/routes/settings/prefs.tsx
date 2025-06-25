import { useTranslation } from "~/locales/provider";
import PreferencesPage from "~/pages/settings/preferences";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default PreferencesPage;

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.common.settings, t.settings.preferences),
        description: t.settings.preferences,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/settings`,
    });
}
