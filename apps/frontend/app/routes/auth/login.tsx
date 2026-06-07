import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import LoginPage from "~/pages/auth/login/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/login";

export default function () {
    const session = useSession();

    if (session?.id) return <Redirect to="/dashboard" />;
    return <LoginPage />;
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.form.login, Config.SITE_NAME_SHORT),
        description: t.meta.loginDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/login`,
    });
}
