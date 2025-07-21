import { useTranslation } from "~/locales/provider";
import RevokeSessionPage from "~/pages/auth/revoke-session";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/revoke-session";

export default RevokeSessionPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.settings.revokeSession, Config.SITE_NAME_SHORT),
        description: "",
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/change-password`,
    });
}
