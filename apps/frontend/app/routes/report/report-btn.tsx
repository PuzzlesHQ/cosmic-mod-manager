import { Button, type ButtonVariants_T } from "@app/components/ui/button";
import type { ReportItemType } from "@app/utils/types/api/report";
import { FlagIcon } from "lucide-react";
import { useLocation } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { setReturnUrl } from "~/pages/auth/oauth-providers";
import { ITEM_ID_PARAM_KEY, ITEM_TYPE_PARAM_KEY } from "~/pages/report/page";

interface Props {
    itemType: ReportItemType;
    itemId: string;
    className?: string;
    btnVariant?: ButtonVariants_T["variant"];
    btnSize?: ButtonVariants_T["size"];
}

export default function ReportButton(props: Props) {
    const { t } = useTranslation();
    const session = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    function handleClick() {
        if (!session?.id) {
            setReturnUrl(location);
            navigate("/login");
        }

        console.log(`${props.itemType} -> ${props.itemId}`);
        navigate(`/report?${ITEM_TYPE_PARAM_KEY}=${props.itemType}&${ITEM_ID_PARAM_KEY}=${encodeURIComponent(props.itemId)}`);
    }

    return (
        <Button
            variant={props.btnVariant || "secondary-destructive"}
            size={props.btnSize}
            className={props.className}
            onClick={handleClick}
        >
            <FlagIcon aria-hidden className="w-btn-icon h-btn-icon" />
            {t.common.report}
        </Button>
    );
}
