import { getProjectTypeFromName } from "@app/utils/convertors";
import { getProjectTypeFromPath } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import SearchPage from "~/pages/search/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/page";

export default SearchPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const type = getProjectTypeFromPath(props.location.pathname);

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.search[type], Config.SITE_NAME_SHORT),
        description: t.meta.searchDesc(t.navbar[getProjectTypeFromName(type)], Config.SITE_NAME_SHORT, Config.SITE_NAME_LONG),
        image: Config.SITE_ICON,
        url: undefined,
    });
}
