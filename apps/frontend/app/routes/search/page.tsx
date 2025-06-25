import { getProjectTypeFromName } from "@app/utils/convertors";
import { useProjectType } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import SearchPage from "~/pages/search/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default SearchPage;

export function meta() {
    const { t } = useTranslation();
    const type = useProjectType();

    return MetaTags({
        title: t.meta.addContext(t.search[type], Config.SITE_NAME_SHORT),
        description: t.meta.searchDesc(t.navbar[getProjectTypeFromName(type)], Config.SITE_NAME_SHORT, Config.SITE_NAME_LONG),
        image: Config.SITE_ICON,
        url: undefined,
    });
}
