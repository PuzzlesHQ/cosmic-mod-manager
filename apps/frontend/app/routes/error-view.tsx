import { TriangleAlertIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default function () {
    const { t } = useTranslation();

    return (
        <div className="full_page flex w-full flex-col items-center justify-center gap-4">
            <div className="headings">
                <h1 className="flex w-full items-center justify-center text-center font-bold text-5xl text-danger-foreground leading-tight">
                    <TriangleAlertIcon aria-hidden className="me-6 h-12 w-12 text-danger-foreground" /> {t.error.sthWentWrong}
                </h1>
            </div>
            <p className="flex max-w-xl items-center justify-center text-center text-lg dark:text-muted-foreground">
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
