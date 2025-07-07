import { fallbackProjectIcon, fallbackUserIcon } from "@app/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { cn } from "@app/components/utils";
import type { ProjectType } from "@app/utils/types";
import type { ModerationProjectItem } from "@app/utils/types/api/moderation";
import { imageUrl } from "@app/utils/url";
import { AlertTriangleIcon, EyeIcon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { ImgWrapper } from "~/components/ui/avatar";
import { TimePassedSince } from "~/components/ui/date";
import Link, { VariantButtonLink } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath, ProjectPagePath, UserProfilePath } from "~/utils/urls";

const TIME_24H = 86400000;
const TIME_48H = TIME_24H * 2;

export default function ReviewProjects({ projects }: { projects: ModerationProjectItem[] }) {
    const { t } = useTranslation();
    // const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
    const [showing, _setShowing] = useState<"all" | ProjectType>("all");

    // const _tempSet = new Set<string>();
    // for (const project of projects) {
    //     for (const type of project.type) {
    //         _tempSet.add(type);
    //     }
    // }
    // const filterableTypes = Array.from(_tempSet);
    let filteredProjects: ModerationProjectItem[] = [];
    if (showing === "all") filteredProjects = projects;
    else {
        for (const project of projects) {
            if (project.type.includes(showing)) filteredProjects.push(project);
        }
    }

    const projectsOver24Hours = filteredProjects.filter((project) => {
        const _timePassed = TimePassed_ms(project.dateQueued);
        if (_timePassed >= TIME_24H && _timePassed < TIME_48H) return true;
        return false;
    });
    const projectsOver48Hours = filteredProjects.filter((project) => TimePassed_ms(project.dateQueued) >= TIME_48H);

    // TODO: Add filters

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.moderation.review}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 text-muted-foreground">
                <span>{t.moderation.projectsInQueue(projects.length)}</span>
                {projectsOver24Hours.length > 0 ? (
                    <span className="font-medium text-warning-foreground">
                        <TriangleAlertIcon aria-hidden className="inline h-3.5 w-3.5" />{" "}
                        {t.moderation.projectsQueuedFor(projectsOver24Hours.length, 24)}
                    </span>
                ) : null}
                {projectsOver48Hours.length > 0 ? (
                    <span className="font-bold text-danger-foreground">
                        <TriangleAlertIcon aria-hidden className="inline h-4 w-4" />{" "}
                        {t.moderation.projectsQueuedFor(projectsOver48Hours.length, 48)}
                    </span>
                ) : null}

                <div className="mt-3 grid grid-cols-1 gap-panel-cards">
                    {filteredProjects.map((project) => (
                        <ModerationItem key={project.id} project={project} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function ModerationItem({ project }: { project: ModerationProjectItem }) {
    const { t } = useTranslation();
    const isOver48Hrs = TimePassed_ms(project.dateQueued) > TIME_48H;
    const isOver24Hrs = TimePassed_ms(project.dateQueued) > TIME_24H && !isOver48Hrs;

    return (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-lg bg-background p-card-surround">
            <div className="items-between flex flex-col flex-wrap justify-center gap-y-4">
                <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1">
                    <Link
                        to={ProjectPagePath(project.type[0], project.slug)}
                        className="flex items-center justify-start gap-x-2 hover:brightness-110"
                    >
                        <ImgWrapper
                            src={imageUrl(project.icon)}
                            alt={project.name}
                            vtId={project.id}
                            className="h-10 w-10"
                            fallback={fallbackProjectIcon}
                        />
                        <span className="font-bold leading-none">{project.name}</span>
                    </Link>
                    by
                    <Link
                        to={project.author.isOrg ? OrgPagePath(project.author.slug) : UserProfilePath(project.author.slug)}
                        className="flex items-center justify-start gap-x-1.5 hover:brightness-110"
                    >
                        <ImgWrapper
                            src={imageUrl(project.author.icon)}
                            alt={project.author.name}
                            className="h-5 w-5 rounded-full"
                            fallback={fallbackUserIcon}
                        />
                        <span className="underline">{project.author.name}</span>
                    </Link>
                    <span>is requesting to be {project.requestedStatus}</span>
                </div>

                <span
                    className={cn(
                        "flex items-center justify-start gap-x-1.5",
                        isOver24Hrs && "text-warning-foreground",
                        isOver48Hrs && "text-danger-foreground",
                    )}
                >
                    {isOver24Hrs || (isOver48Hrs && <AlertTriangleIcon aria-hidden className="inline h-4 w-4" />)}
                    {t.moderation.submitted(TimePassedSince({ date: project.dateQueued }))}
                </span>
            </div>

            <VariantButtonLink url={ProjectPagePath(project.type[0], project.slug)} size="sm">
                <EyeIcon aria-hidden className="h-btn-icon w-btn-icon" /> {t.moderation.viewProject}
            </VariantButtonLink>
        </div>
    );
}

function TimePassed_ms(date: string | Date) {
    try {
        return Date.now() - new Date(date).getTime();
    } catch {
        return 0;
    }
}
