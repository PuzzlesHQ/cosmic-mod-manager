import type { Collection, CollectionOwner, ProjectListItem } from "@app/utils/types/api";
import { type ShouldRevalidateFunctionArgs, useLoaderData } from "react-router";
import { shouldForceRevalidate } from "~/components/misc/refresh-page";
import { useTranslation } from "~/locales/provider";
import CollectionPageLayout from "~/pages/collection/layout";
import NotFoundPage from "~/pages/not-found";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/layout";

export default function () {
    const { t } = useTranslation();
    const data = useLoaderData<typeof loader>();

    if (!data.collection?.id || !data.owner) {
        return <NotFoundPage title={t.meta.collectionNotFound} description={t.meta.collectionNotFoundDesc(data.collectionId)} />;
    }
    return <CollectionPageLayout collection={data.collection} projects={data.projects} owner={data.owner} />;
}

interface CollectionLoaderData {
    collectionId: string;
    collection: Collection | null;
    projects: ProjectListItem[];
    owner: CollectionOwner | null;
}

export async function loader(props: Route.LoaderArgs): Promise<CollectionLoaderData> {
    const collectionId = props.params?.collectionId;

    const NoData = {
        collectionId: collectionId,
        collection: null,
        projects: [],
        owner: null,
    };
    if (!collectionId) return NoData;

    const [collectionRes, collectionProjects, collectionOwner] = await Promise.all([
        serverFetch(props.request, `/api/collections/${collectionId}`),
        serverFetch(props.request, `/api/collections/${collectionId}/projects`),
        serverFetch(props.request, `/api/collections/${collectionId}/owner`),
    ]);
    if (!collectionRes.ok || !collectionProjects.ok) return NoData;

    const [collection, projects, owner] = await Promise.all([
        resJson<Collection>(collectionRes),
        resJson<ProjectListItem[]>(collectionProjects),
        resJson<CollectionOwner>(collectionOwner),
    ]);

    return {
        collectionId: collectionId,
        collection: collection,
        projects: projects || [],
        owner: owner,
    };
}

export function shouldRevalidate({
    currentParams,
    nextParams,
    nextUrl,
    currentUrl,
    defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
    const forceRevalidate = shouldForceRevalidate(currentUrl.searchParams, nextUrl.searchParams);
    if (forceRevalidate) return true;

    const currentId = currentParams?.collectionId?.toLowerCase();
    const nextId = nextParams?.collectionId?.toLowerCase();

    if (currentId === nextId) return false;
    return defaultShouldRevalidate;
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const collection = props.data?.collection;

    if (!collection?.id) {
        return MetaTags({
            location: props.location,
            title: t.meta.collectionNotFound,
            description: t.meta.collectionNotFoundDesc(props.params.collectionId),
            image: Config.SITE_ICON,
            url: undefined,
        });
    }

    return MetaTags({
        location: props.location,
        title: t.meta.collection(collection.name),
        description: t.meta.collectionDesc(collection.description || "", Config.SITE_NAME_SHORT, collection.name),
        image: collection.icon || Config.SITE_ICON,
        url: undefined,
    });
}
