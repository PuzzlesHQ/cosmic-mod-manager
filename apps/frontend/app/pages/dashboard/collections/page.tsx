import { FOLLOWS_COLLECTIONS_ID } from "@app/utils/constants";
import { CollectionVisibility } from "@app/utils/types";
import type { Collection } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { EarthIcon, HeartIcon, LockIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { CollectionListItemCard } from "~/components/item-card";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useTranslation } from "~/locales/provider";
import useCollections from "~/pages/collection/provider";
import { CollectionPagePath } from "~/utils/urls";
import CreateNewCollection_Dialog from "./new-collection";

interface Props {
    collections: Collection[];
}

export default function CollectionsDashboardPage(props: Props) {
    const { t } = useTranslation();
    const ctx = useCollections();

    const [search, setSearch] = useState("");

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="flex w-full flex-row flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <CardTitle>{t.dashboard.collections}</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-panel-cards">
                <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:flex-nowrap">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t.collection.searchCollections}
                    />

                    <CreateNewCollection_Dialog>
                        <Button>
                            <PlusIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                            {t.form.createNew}
                        </Button>
                    </CreateNewCollection_Dialog>
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    {!search || t.collection.followedProjects.toLowerCase().includes(search.toLowerCase()) ? (
                        <FollowsCollectionItem followingProjects={ctx.followingProjects.length} />
                    ) : null}

                    {(props.collections || []).map((collection) => {
                        if (search.length > 0 && !collection.name.includes(search)) return null;

                        return (
                            <CollectionListItemCard
                                vtId={collection.id}
                                key={collection.id}
                                title={collection.name}
                                url={CollectionPagePath(collection.id)}
                                icon={imageUrl(collection.icon)}
                                description={collection.description || ""}
                                projects={collection.projects.length}
                                visibility={
                                    <div className="inline-flex items-center justify-center gap-1">
                                        {collection.visibility === CollectionVisibility.PRIVATE ? (
                                            <LockIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                        ) : (
                                            <EarthIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                        )}
                                        {
                                            t.projectSettings[
                                                collection.visibility === CollectionVisibility.PRIVATE
                                                    ? "private"
                                                    : "public"
                                            ]
                                        }
                                    </div>
                                }
                            />
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export function FollowsCollectionItem(props: { followingProjects: number; className?: string }) {
    const { t } = useTranslation();

    return (
        <CollectionListItemCard
            vtId={FOLLOWS_COLLECTIONS_ID}
            title={t.collection.followedProjects}
            url={CollectionPagePath(FOLLOWS_COLLECTIONS_ID)}
            icon={<HeartIcon aria-hidden className="h-[60%] w-[60%] fill-current text-accent-bg" />}
            description={t.collection.followedProjectsDesc}
            projects={props.followingProjects}
            className={props.className}
            visibility={
                <div className="inline-flex items-center justify-center gap-1">
                    <LockIcon aria-hidden className="h-btn-icon w-btn-icon" />
                    {t.projectSettings.private}
                </div>
            }
        />
    );
}
