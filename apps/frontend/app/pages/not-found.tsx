import { VariantButtonLink } from "~/components/ui/link";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

interface Props {
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    linkLabel?: string;
    linkHref?: string;
    className?: string;
}

export default function NotFoundPage({ className, title, description, linkHref, linkLabel }: Props) {
    const { t } = useTranslation();

    return (
        <div className={cn("full_page flex w-full flex-col items-center justify-center", className)}>
            <div className="flex w-full flex-col items-center justify-center">
                <h1 className="flex w-full items-center justify-center text-center font-extrabold text-5xl leading-snug">
                    {title || t.error.pageNotFound}
                </h1>
            </div>
            <p className="flex max-w-xl items-center justify-center text-center text-lg dark:text-foreground-muted">
                {description || t.error.pageNotFoundDesc}
            </p>

            <VariantButtonLink variant="link" to={linkHref || "/"} label={linkLabel || t.common.home} className="mt-4 text-lg">
                {linkLabel || t.common.home}
            </VariantButtonLink>
        </div>
    );
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: `${t.error.pageNotFound} | ${Config.SITE_NAME_SHORT}`,
        description: t.error.pageNotFoundDesc,
        image: Config.SITE_ICON,
        url: undefined,
    });
}
