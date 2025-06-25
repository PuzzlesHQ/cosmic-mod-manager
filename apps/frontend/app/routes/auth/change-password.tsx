import { useTranslation } from "~/locales/provider";
import ChangePasswordPage from "~/pages/auth/change-password";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default ChangePasswordPage;

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.auth.changePassword, Config.SITE_NAME_SHORT),
        description: t.meta.changePassDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/change-password`,
    });
}
