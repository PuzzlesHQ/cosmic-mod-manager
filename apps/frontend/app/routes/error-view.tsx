import { RotateCwIcon, TriangleAlertIcon } from "lucide-react";
import { DiscordIcon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function () {
    const { t } = useTranslation();

    return (
        <div className="full_page flex w-full flex-col items-center justify-center gap-4">
            <div className="headings">
                <h1 className="flex w-full items-center justify-center text-center font-bold text-5xl text-error-fg leading-tight">
                    <TriangleAlertIcon aria-hidden className="me-6 h-12 w-12 text-danger-fg" /> {t.error.sthWentWrong}
                </h1>
            </div>
            <p className="flex max-w-xl items-center justify-center text-center text-lg">{t.error.errorDesc}</p>

            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => window.open(Config.DISCORD_INVITE, "_blank")}>
                    <DiscordIcon className="h-btn-icon-md w-btn-icon-md" />
                    <span className="ms-2">Discord</span>
                </Button>

                <Button variant="ghost" aria-label={t.error.refresh} onClick={() => window.location.reload()}>
                    <RotateCwIcon aria-hidden className="h-btn-icon w-btn-icon text-foreground-muted" />
                    {t.error.refresh}
                </Button>
            </div>
        </div>
    );
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.error.sthWentWrong,
        description: t.error.errorDesc,
        image: Config.SITE_ICON,
        url: undefined,
    });
}
