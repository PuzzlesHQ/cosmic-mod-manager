import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { ProfileSettingsPage } from "~/pages/settings/profile";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/profile";

export default function () {
    const session = useSession();

    if (!session?.id) return <Redirect to="/login" />;
    return <ProfileSettingsPage session={session} />;
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.common.settings, t.settings.publicProfile),
        description: t.settings.publicProfile,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/settings/profile`,
    });
}
