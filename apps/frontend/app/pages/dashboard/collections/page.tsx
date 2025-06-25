import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { EarthIcon, HeartIcon, LockIcon, PlusIcon } from "lucide-react";
import { CollectionListItemCard } from "~/components/item-card";
import { useTranslation } from "~/locales/provider";
import CreateNewCollection_Dialog from "./new-collection";
import type { Collection } from "@app/utils/types/api";
import { CollectionPagePath } from "~/utils/urls";
import { imageUrl } from "@app/utils/url";
import { CollectionVisibility } from "@app/utils/types";
import useCollections from "~/pages/collection/provider";
import { useState } from "react";
import { Input } from "@app/components/ui/input";
import { FOLLOWS_COLLECTIONS_ID } from "@app/utils/constants";

interface Props {
    collections: Collection[];
}

export default function CollectionsDashboardPage(props: Props) {
    const { t } = useTranslation();
    const ctx = useCollections();

    const [search, setSearch] = useState("");

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="w-full flex flex-row flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <CardTitle>{t.dashboard.collections}</CardTitle>
            </CardHeader>

            <CardContent className="gap-4">
                <div className="w-full gap-3 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t.collection.searchCollections}
                    />

                    <CreateNewCollection_Dialog>
                        <Button>
                            <PlusIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                            {t.form.createNew}
                        </Button>
                    </CreateNewCollection_Dialog>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <LockIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                        ) : (
                                            <EarthIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                        )}
                                        {
                                            t.projectSettings[
                                                collection.visibility === CollectionVisibility.PRIVATE ? "private" : "public"
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
            icon={<HeartIcon aria-hidden className="w-[60%] h-[60%] text-accent-background fill-current" />}
            description={t.collection.followedProjectsDesc}
            projects={props.followingProjects}
            className={props.className}
            visibility={
                <div className="inline-flex items-center justify-center gap-1">
                    <LockIcon aria-hidden className="w-btn-icon h-btn-icon" />
                    {t.projectSettings.private}
                </div>
            }
        />
    );
}
