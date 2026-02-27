import { useEffect } from "react";
import { useLocation } from "react-router";
import { usePreferences } from "~/hooks/preferences";
import { useTranslation } from "~/locales/provider";
import { setHintLocale } from "~/locales/utils";
import { setReturnUrl } from "~/pages/auth/oauth-providers";
import { useNavigate } from "./link";

export default function Redirect({ to }: { to: string }) {
    const { t, locale } = useTranslation();
    const location = useLocation();
    const prefs = usePreferences();

    useEffect(() => {
        if (to === "/login" || to === "/signup") {
            setReturnUrl(location);
        }

        window.location.href = new URL(setHintLocale(to, locale, prefs.locale), window.location.origin).href;
    }, []);

    return (
        <div className="grid w-full place-items-center gap-4 py-8">
            <span className="text-foreground-muted">{t.common.redirecting}</span>
        </div>
    );
}

export function SoftRedirect({ to }: { to: string }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        navigate(to);
    }, []);

    return (
        <div className="grid w-full place-items-center gap-4 py-8">
            <span className="text-foreground-muted">{t.common.redirecting}</span>
        </div>
    );
}
