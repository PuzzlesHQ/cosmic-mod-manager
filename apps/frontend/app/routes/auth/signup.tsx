import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import SignUpPage from "~/pages/auth/signup/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function () {
    const session = useSession();

    if (session?.id) {
        return <Redirect to="/dashboard" />;
    }
    return <SignUpPage />;
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.form.signup, Config.SITE_NAME_SHORT),
        description: t.meta.signupDesc(Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/signup`,
    });
}
