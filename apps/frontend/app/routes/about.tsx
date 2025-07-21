import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/about";

export default function () {
    const { t } = useTranslation();

    return (
        <main className="grid w-full grid-cols-1">
            <MarkdownRenderBox
                className="bright-heading mx-auto max-w-[80ch] rounded-lg bg-card-background p-10 pt-4"
                text={t.legal.aboutUs({
                    discordInvite: Config.DISCORD_INVITE,
                    repoLink: Config.REPO_LINK,
                })}
            />
        </main>
    );
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.meta.about, Config.SITE_NAME_SHORT),
        description: t.meta.about,
        image: Config.SITE_ICON,
        url: undefined,
    });
}
