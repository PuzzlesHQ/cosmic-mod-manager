import { useTranslation } from "~/locales/provider";
import ChangePasswordPage from "~/pages/auth/change-password";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/change-password";

export default ChangePasswordPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.auth.changePassword, Config.SITE_NAME_SHORT),
        description: t.meta.changePassDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/change-password`,
    });
}
