import { useEffect } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "~/locales/provider";
import { setReturnUrl } from "~/pages/auth/oauth-providers";
import { FormatUrl_WithHintLocale } from "~/utils/urls";
import { useNavigate } from "./link";

export default function Redirect({ to }: { to: string }) {
    const { t } = useTranslation();
    const location = useLocation();

    useEffect(() => {
        if (to === "/login" || to === "/signup") {
            setReturnUrl(location);
        }

        window.location.href = new URL(FormatUrl_WithHintLocale(to), window.location.href).href;
    }, []);

    return (
        <div className="grid w-full place-items-center gap-4 py-8">
            <span className="text-muted-foreground">{t.common.redirecting}</span>
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
            <span className="text-muted-foreground">{t.common.redirecting}</span>
        </div>
    );
}
