import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@app/components/ui/tooltip";
import { BadgeInfoIcon } from "lucide-react";
import { useOrgData } from "~/hooks/org";
import { useTranslation } from "~/locales/provider";
import CreateNewProjectDialog from "~/pages/dashboard/projects/new-project";
import { ProjectsListTable } from "~/pages/dashboard/projects/page";

export default function OrgProjectsSettings() {
    const { t } = useTranslation();
    const ctx = useOrgData();
    const orgData = ctx.orgData;
    const projects = ctx.orgProjects;

    return (
        <>
            <title>{`Projects - ${orgData.name}`}</title>

            <Card className="w-full overflow-hidden">
                <CardHeader className="flex w-full flex-row flex-wrap items-start justify-between gap-x-6 gap-y-2">
                    <CardTitle>{t.dashboard.projects}</CardTitle>
                    <div className="flex items-center justify-center gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <BadgeInfoIcon aria-hidden className="h-btn-icon-md w-btn-icon-md text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-md">{t.organization.transferProjectsTip}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <CreateNewProjectDialog orgId={orgData.id} />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {!projects?.length ? (
                        <div className="flex w-full items-center justify-start p-6">
                            <p>{t.organization.noProjects_CreateOne}</p>
                        </div>
                    ) : (
                        <ProjectsListTable projects={projects} />
                    )}
                </CardContent>
            </Card>
        </>
    );
}
