import { CubeIcon, fallbackProjectIcon, fallbackUserIcon } from "@app/components/icons";
import { MicrodataItemProps } from "@app/components/microdata";
import { ContentCardTemplate } from "@app/components/misc/panel";
import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { PopoverClose } from "@app/components/ui/popover";
import { Separator } from "@app/components/ui/separator";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { FOLLOWS_COLLECTIONS_ID } from "@app/utils/constants";
import { isModerator } from "@app/utils/constants/roles";
import { getProjectTypesFromNames } from "@app/utils/convertors";
import { CollectionVisibility } from "@app/utils/types";
import type { Collection, CollectionOwner, ProjectListItem } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { CalendarIcon, ClipboardCopyIcon, EarthIcon, HeartIcon, LockIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import ConfirmDialog from "~/components/confirm-dialog";
import { PageHeader } from "~/components/page-header";
import { TimePassedSince } from "~/components/ui/date";
import { useNavigate } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { CollectionPagePath, UserProfilePath } from "~/utils/urls";
import { TeamMember_Card } from "../project/layout";
import SecondaryNav from "../project/secondary-nav";
import EditCollection from "./edit-collection";
import useCollections from "./provider";

interface Props {
    collection: Collection;
    projects: ProjectListItem[];
    owner: CollectionOwner;
}

export default function CollectionPageLayout(props: Props) {
    const { t } = useTranslation();
    const collectionsContext = useCollections();
    const session = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    const [removingProjects, setRemovingProjects] = useState(false);
    const [markedProjects, setMarkedProjects] = useState<string[]>([]);

    function addMarkedProject(projectId: string) {
        if (markedProjects.includes(projectId)) return;
        setMarkedProjects((prev) => [...prev, projectId]);
    }

    function removeMarkedProject(projectId: string) {
        setMarkedProjects((prev) => prev.filter((id) => id !== projectId));
    }

    const ProjectsCount = t.count.projects(props.collection.projects.length);
    const aggregatedProjectTypes = new Set<string>();
    for (const project of props.projects || []) {
        for (const type of project.type) {
            aggregatedProjectTypes.add(type);
        }
    }
    const projectTypesList = Array.from(aggregatedProjectTypes);

    async function DeleteCollection() {
        const success = await collectionsContext.deleteCollection(props.collection.id);
        if (!success) return;

        RefreshPage(navigate, "/dashboard/collections");
    }

    async function RemoveCollectionProjects() {
        if (removingProjects) return;
        try {
            setRemovingProjects(true);
            await collectionsContext.removeProjectsFromCollection(props.collection.id, markedProjects);
            setMarkedProjects([]);
        } finally {
            RefreshPage(navigate, location);
            setRemovingProjects(false);
        }
    }

    const isFollowsCollection = props.collection.id === FOLLOWS_COLLECTIONS_ID;
    const icon =
        props.collection.id === FOLLOWS_COLLECTIONS_ID ? (
            <HeartIcon aria-hidden className="w-[65%] h-[65%] text-accent-background fill-current" />
        ) : (
            imageUrl(props.collection.icon)
        );

    return (
        <main className="header-content-sidebar-layout pb-12 gap-panel-cards">
            <PageHeader
                vtId={props.collection.id}
                icon={icon}
                title={props.collection.name}
                fallbackIcon={fallbackProjectIcon}
                description={props.collection.description || ""}
                titleBadge={
                    <div className="ms-2 flex items-center justify-center gap-1.5 font-bold text-extra-muted-foreground">
                        <CubeIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        {t.dashboard.collection}
                    </div>
                }
                actionBtns={
                    markedProjects.length > 0 ? (
                        <Button
                            variant="secondary-destructive-inverted"
                            onClick={RemoveCollectionProjects}
                            disabled={removingProjects}
                        >
                            {removingProjects ? <LoadingSpinner size="xs" /> : <Trash2Icon className="w-btn-icon h-btn-icon" />}
                            {t.form.remove}
                        </Button>
                    ) : null
                }
                threeDotMenu={
                    <>
                        <PopoverClose asChild>
                            <Button
                                className="w-full"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(props.collection.id);
                                }}
                            >
                                <ClipboardCopyIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                {t.common.copyId}
                                <span itemProp={MicrodataItemProps.itemid} className="sr-only">
                                    {props.collection.id}
                                </span>
                            </Button>
                        </PopoverClose>

                        {!isFollowsCollection && (props.collection.userId === session?.id || isModerator(session?.role)) ? (
                            <>
                                <Separator />

                                <EditCollection collection={props.collection} />

                                <ConfirmDialog
                                    title={t.collection.deleteCollection}
                                    description={t.collection.sureToDeleteCollection}
                                    confirmText={t.form.delete}
                                    variant="destructive"
                                    onConfirm={DeleteCollection}
                                >
                                    <Button variant="ghost-destructive" size="sm" className="w-full">
                                        <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                                        {t.form.delete}
                                    </Button>
                                </ConfirmDialog>
                            </>
                        ) : null}
                    </>
                }
            >
                <div className="flex items-center gap-2 border-0 border-e border-card-background dark:border-shallow-background pe-4">
                    <CubeIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">{ProjectsCount.join(" ")}</span>
                </div>

                <div className="flex items-center gap-2 border-0 border-e border-card-background dark:border-shallow-background pe-4">
                    {props.collection.visibility === CollectionVisibility.PRIVATE ? (
                        <LockIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    ) : (
                        <EarthIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    )}

                    <span className="font-semibold">
                        {t.projectSettings[props.collection.visibility === CollectionVisibility.PRIVATE ? "private" : "public"]}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">
                        {t.settings.created(TimePassedSince({ date: props.collection.dateCreated }))}
                    </span>
                </div>
            </PageHeader>

            <div className="h-fit grid grid-cols-1 gap-panel-cards page-content">
                {projectTypesList?.length > 1 && props.projects.length > 1 ? (
                    <SecondaryNav
                        className="bg-card-background rounded-lg px-3 py-2"
                        urlBase={CollectionPagePath(props.collection.id)}
                        links={[
                            { label: t.common.all, href: "" },
                            ...getProjectTypesFromNames(projectTypesList).map((type) => ({
                                label: t.navbar[`${type}s`],
                                href: `/${type}s`,
                            })),
                        ]}
                    />
                ) : null}

                <Outlet
                    context={
                        {
                            ...props,
                            markedProjects,
                            addMarkedProject,
                            removeMarkedProject,
                        } satisfies CollectionOutletData
                    }
                />
            </div>

            <PageSidebar owner={props.owner} />
        </main>
    );
}

export interface CollectionOutletData extends Props {
    markedProjects: string[];
    addMarkedProject: (projectId: string) => void;
    removeMarkedProject: (projectId: string) => void;
}

function PageSidebar(props: { owner: CollectionOwner }) {
    const { t } = useTranslation();

    return (
        <div className="w-full lg:w-sidebar flex flex-col gap-panel-cards page-sidebar">
            <ContentCardTemplate title={t.collection.curatedBy} titleClassName="text-lg">
                <TeamMember_Card
                    vtId={props.owner.id}
                    isOwner={false}
                    userName={props.owner.userName}
                    roleName={t.projectSettings.owner}
                    avatarImageUrl={imageUrl(props.owner.avatar)}
                    url={UserProfilePath(props.owner.userName)}
                    fallbackIcon={fallbackUserIcon}
                />
            </ContentCardTemplate>
        </div>
    );
}
