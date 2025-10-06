import { useEffect } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import { omitOrigin } from "./utils/urls";

export function ChangeUrlHintOnLocaleChange() {
    const { formattedLocaleName } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    function changeHintInUrl() {
        navigate(omitOrigin(location), {
            preventScrollReset: true,
            viewTransition: false,
        });
    }

    useEffect(() => {
        changeHintInUrl();
    }, [formattedLocaleName]);

    return null;
}
