import { FormatProjectTypes } from "@app/utils/project";
import type { ProjectListItem } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { SettingsIcon } from "lucide-react";
import { fallbackProjectIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import CopyBtn from "~/components/ui/copy-btn";
import Link, { useNavigate } from "~/components/ui/link";
import { ProjectStatusBadge } from "~/components/ui/project-status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useTranslation } from "~/locales/provider";
import { ProjectPagePath } from "~/utils/urls";
import CreateNewProjectDialog from "./new-project";

interface Props {
    projects: ProjectListItem[];
}

export default function ProjectsPage({ projects }: Props) {
    const { t } = useTranslation();

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="flex w-full flex-row flex-wrap items-start justify-between gap-x-6 gap-y-2">
                <CardTitle>{t.dashboard.projects}</CardTitle>
                <CreateNewProjectDialog />
            </CardHeader>
            <CardContent className="p-0">
                {projects.length === 0 ? (
                    <div className="flex w-full items-center justify-start p-6">
                        <p>{t.dashboard.createProjectInfo}</p>
                    </div>
                ) : projects.length > 0 ? (
                    <ProjectsListTable projects={projects} />
                ) : null}
            </CardContent>
        </Card>
    );
}

export function ProjectsListTable({ projects }: { projects: ProjectListItem[] }) {
    const { t } = useTranslation();
    const customNavigate = useNavigate();

    return (
        <div className="mt-2 w-full">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                        {/* ICON: VISIBLE ON sm+ width */}
                        <TableHead className="invisible w-[5.5rem] ps-table-side-pad-sm sm:w-[6.5rem] sm:ps-table-side-pad md:visible">
                            {t.form.icon}
                        </TableHead>

                        {/* DETAILS: MOBILE ONLY */}
                        <TableHead className="invisible md:hidden">{t.form.details}</TableHead>

                        {/* NAME: VISIBLE ON sm+ width */}
                        <TableHead className="hidden min-w-16 md:table-cell lg:min-w-36">{t.form.name}</TableHead>
                        {/* ID: VISIBLE ON sm+ width */}
                        <TableHead className="hidden md:table-cell">{t.form.id}</TableHead>
                        {/* TYPE: VISIBLE ON sm+ width */}
                        <TableHead className="hidden md:table-cell">{t.dashboard.type}</TableHead>
                        {/* STATUS: VISIBLE ON sm+ width */}
                        <TableHead className="hidden md:table-cell">{t.dashboard.status}</TableHead>

                        {/* SETTINGS LINK: VISIBLE ON sm+ width */}
                        <TableHead className="invisible w-10 pe-table-side-pad-sm sm:pe-table-side-pad md:visible"> </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(projects || []).map((project) => {
                        return (
                            <TableRow
                                key={project.id}
                                className="cursor-pointer text-muted-foreground"
                                onClick={(e) => {
                                    //@ts-expect-error
                                    if (!e.target.closest(".noClickRedirect")) {
                                        customNavigate(ProjectPagePath(project.type[0], project.slug));
                                    }
                                }}
                            >
                                {/* ICON */}
                                <TableCell className="ps-table-side-pad-sm sm:ps-table-side-pad">
                                    <Link
                                        tabIndex={-1}
                                        to={ProjectPagePath(project.type[0], project.slug)}
                                        className="noClickRedirect flex"
                                        aria-label={`view ${project.name}`}
                                    >
                                        <ImgWrapper
                                            vtId={project.id}
                                            src={imageUrl(project.icon)}
                                            alt={project.name}
                                            fallback={fallbackProjectIcon}
                                            className="h-12 w-12 rounded"
                                        />
                                    </Link>
                                </TableCell>

                                {/* AGGREGATED PROJECT DETAILS: VISIBLE ON MOBILE WIDTH ONLY */}
                                <TableCell className="!ps-0 sm:ps-2 md:hidden">
                                    <div className="flex flex-col items-start justify-center gap-1">
                                        <Link
                                            to={ProjectPagePath(project.type[0], project.slug)}
                                            className="noClickRedirect font-bold text-foreground leading-none hover:underline"
                                        >
                                            {project.name}
                                        </Link>

                                        <ProjectStatusBadge status={project.status} t={t} />

                                        <span className="leading-none">{FormatProjectTypes(project.type)}</span>
                                        <CopyBtn
                                            id={`${project.slug}-${project.id}`}
                                            text={project.id}
                                            label={project.id}
                                            // maxLabelChars={12}
                                            className="noClickRedirect bg-shallow-background/50 px-2 py-1"
                                            iconClassName="w-3 h-3"
                                        />
                                    </div>
                                </TableCell>

                                {/* NAME */}
                                <TableCell className="hidden md:table-cell">
                                    <Link
                                        to={ProjectPagePath(project.type[0], project.slug)}
                                        className="noClickRedirect font-medium text-base leading-none hover:underline"
                                    >
                                        {project.name}
                                    </Link>
                                </TableCell>
                                {/* ID */}
                                <TableCell className="hidden md:table-cell">
                                    <div className="noClickRedirect flex w-fit items-center justify-start font-mono text-sm">
                                        <CopyBtn
                                            id={`${project.slug}-${project.id}`}
                                            text={project.id}
                                            label={project.id}
                                            maxLabelChars={10}
                                            iconClassName="w-3 h-3"
                                        />
                                    </div>
                                </TableCell>

                                {/* TYPE */}
                                <TableCell className="hidden md:table-cell">
                                    <span className="leading-none">{FormatProjectTypes(project.type)}</span>
                                </TableCell>

                                {/* STATUS */}
                                <TableCell className="hidden md:table-cell">
                                    <ProjectStatusBadge status={project.status} t={t} />
                                </TableCell>

                                {/* SETTINGS PAGE LINK */}
                                <TableCell className="pe-table-side-pad-sm sm:pe-table-side-pad">
                                    <Link
                                        to={ProjectPagePath(project.type[0], project.slug, "settings")}
                                        className="noClickRedirect flex h-full w-fit items-center justify-center rounded p-2 hover:bg-shallow-background"
                                        aria-label="project settings"
                                    >
                                        <SettingsIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
