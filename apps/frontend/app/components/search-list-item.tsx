import DefaultSearchListItem from "@app/components/misc/search-list-item";
import { FormatCount } from "@app/utils/number";
import type React from "react";
import { useRootData } from "~/hooks/root-data";
import { formatLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath, ProjectPagePath, UserProfilePath } from "~/utils/urls";
import { FormattedDate, TimePassedSince } from "./ui/date";
import ProjectSupportedEnv from "~/pages/project/supported-env";

export { ViewType } from "@app/components/misc/search-list-item";

type Props = Omit<
    React.ComponentProps<typeof DefaultSearchListItem>,
    | "t"
    | "supportedEnv"
    | "ProjectPagePath"
    | "OrgPagePath"
    | "UserProfilePath"
    | "viewTransitions"
    | "TimeSince_Fn"
    | "NumberFormatter"
    | "DateFormatter"
>;

export default function SearchListItem(props: Props) {
    const viewTransitions = useRootData()?.userConfig.viewTransitions !== false;
    const { t, locale } = useTranslation();

    return (
        <DefaultSearchListItem
            {...props}
            t={t}
            supportedEnv={
                <ProjectSupportedEnv clientSide={props.clientSide} serverSide={props.serverSide} className="text-extra-muted-foreground" />
            }
            UserProfilePath={UserProfilePath}
            ProjectPagePath={ProjectPagePath}
            OrgPagePath={OrgPagePath}
            viewTransitions={viewTransitions}
            TimeSince_Fn={(date: string | Date) => {
                return TimePassedSince({ date: date });
            }}
            NumberFormatter={(num: number) => {
                return FormatCount(num, formatLocaleCode(locale));
            }}
            DateFormatter={(date: string | Date) => {
                return FormattedDate({ date: date });
            }}
        />
    );
}
