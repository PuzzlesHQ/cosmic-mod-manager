import { FormatCount } from "@app/utils/number";
import type React from "react";
import DefaultProjectCardItem from "~/components/misc/search-list-item";
import { useRootData } from "~/hooks/root-data";
import { useTranslation } from "~/locales/provider";
import ProjectSupportedEnv from "~/pages/project/supported-env";
import { OrgPagePath, ProjectPagePath, UserProfilePath } from "~/utils/urls";
import { FormattedDate, TimePassedSince } from "./ui/date";

export { ViewType } from "~/components/misc/search-list-item";

type Props = Omit<
    React.ComponentProps<typeof DefaultProjectCardItem>,
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

export default function ProjectCardItem(props: Props) {
    const viewTransitions = useRootData()?.userConfig.viewTransitions !== false;
    const { t, formattedLocaleName } = useTranslation();

    return (
        <DefaultProjectCardItem
            {...props}
            t={t}
            supportedEnv={
                <ProjectSupportedEnv
                    clientSide={props.clientSide}
                    serverSide={props.serverSide}
                    className="text-extra-muted-foreground"
                />
            }
            UserProfilePath={UserProfilePath}
            ProjectPagePath={ProjectPagePath}
            OrgPagePath={OrgPagePath}
            viewTransitions={viewTransitions}
            TimeSince_Fn={(date: string | Date) => {
                return TimePassedSince({ date: date });
            }}
            NumberFormatter={(num: number) => {
                return FormatCount(num, formattedLocaleName);
            }}
            DateFormatter={(date: string | Date) => {
                return FormattedDate({ date: date });
            }}
        />
    );
}
