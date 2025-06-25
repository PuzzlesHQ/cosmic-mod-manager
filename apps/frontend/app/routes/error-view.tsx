import { Button } from "@app/components/ui/button";
import { TriangleAlertIcon } from "lucide-react";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function () {
    const { t } = useTranslation();

    return (
        <div className="w-full full_page flex flex-col items-center justify-center gap-4">
            <div className="headings">
                <h1 className="w-full text-5xl leading-tight font-bold flex items-center justify-center text-center text-danger-foreground">
                    <TriangleAlertIcon aria-hidden className="w-12 h-12 text-danger-foreground me-6" /> {t.error.sthWentWrong}
                </h1>
            </div>
            <p className="text-lg dark:text-muted-foreground max-w-xl flex items-center justify-center text-center">
                {t.error.errorDesc}
            </p>

            <Button
                className="text-foreground text-lg"
                variant="link"
                aria-label={t.error.refresh}
                onClick={() => window.location.reload()}
            >
                {t.error.refresh}
            </Button>
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
