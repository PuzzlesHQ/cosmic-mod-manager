import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { Collection, GenericErrorResponse } from "@app/utils/types/api";
import { createContext, use, useEffect, useState } from "react";
import { toast } from "~/components/ui/sonner";
import { useSession } from "~/hooks/session";
import clientFetch from "~/utils/client-fetch";
import { resJson } from "~/utils/server-fetch";

interface CollectionsContext {
    collections: Collection[];
    refetchCollections: () => Promise<void>;
    addProjectsToCollection: (collectionId: string, projects: string[]) => Promise<void>;
    removeProjectsFromCollection: (collectionId: string, projects: string[]) => Promise<void>;
    deleteCollection: (collectionId: string) => Promise<boolean>;

    followingProjects: string[];
    refetchFollows: () => Promise<void>;
    followProject: (projectId: string) => Promise<void>;
    unfollowProject: (projectId: string) => Promise<void>;
}

export const CollectionsContext = createContext<CollectionsContext | null>(null);

export function CollectionsProvider(props: { children: React.ReactNode }) {
    const session = useSession();
    const [collections, setCollections_state] = useState<Collection[]>([]);
    const [followingProjects, setFollowingProjects] = useState<string[]>([]);

    async function FetchCollections() {
        const res = await clientFetch("/api/collections");
        if (!res.ok) {
            toast.error("Failed to fetch collections");
            return;
        }

        const data = (await res.json()) as Collection[];
        setCollections_state(data);
    }

    async function FetchFollowingProjects() {
        const res = await clientFetch("/api/user/follows?idsOnly=true");
        if (!res.ok) {
            toast.error("Failed to fetch following projects");
            return;
        }

        const data = (await res.json()) as string[];
        setFollowingProjects(data);
    }

    async function editCollectionProjects(collectionId: string, projects: string[], action: "add" | "remove" = "add") {
        disableInteractions();

        const res = await clientFetch(`/api/collections/${collectionId}/projects`, {
            method: action === "add" ? "PATCH" : "DELETE",
            body: JSON.stringify({ projects: projects }),
        });

        if (!res.ok) {
            toast.error(
                action === "add" ? "Failed to add projects to collection" : "Failed to remove projects from collection",
            );
            enableInteractions();
            return;
        }

        await FetchCollections();
        enableInteractions();
    }

    async function addProjectsToCollection(collectionId: string, projects: string[]) {
        await editCollectionProjects(collectionId, projects, "add");
    }

    async function removeProjectsFromCollection(collectionId: string, projects: string[]) {
        await editCollectionProjects(collectionId, projects, "remove");
    }

    async function editFollowingProject(projectId: string, action: "add" | "remove" = "add") {
        disableInteractions();

        const res = await clientFetch(`/api/project/${projectId}/follow`, {
            method: action === "add" ? "POST" : "DELETE",
        });
        if (!res.ok) {
            const err = await resJson<GenericErrorResponse>(res);
            if (action === "add") {
                toast.error(err?.message || "Failed to follow project");
            } else {
                toast.error(err?.message || "Failed to unfollow project");
            }

            enableInteractions();
            return;
        }

        await FetchFollowingProjects();
        enableInteractions();
    }

    async function followProject(projectId: string) {
        return await editFollowingProject(projectId, "add");
    }

    async function unfollowProject(projectId: string) {
        return await editFollowingProject(projectId, "remove");
    }

    async function deleteCollection(collectionId: string) {
        const res = await clientFetch(`/api/collections/${collectionId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            toast.error("Error deleting collection");
            return false;
        }

        const data = await res.json();
        await FetchCollections();
        toast.message(data.message);
        return true;
    }

    useEffect(() => {
        if (session?.id) {
            FetchCollections();
            FetchFollowingProjects();
        } else {
            setFollowingProjects([]);
            setCollections_state([]);
        }
    }, [session?.id]);

    return (
        <CollectionsContext
            value={{
                collections: collections,
                refetchCollections: FetchCollections,
                addProjectsToCollection: addProjectsToCollection,
                removeProjectsFromCollection: removeProjectsFromCollection,
                deleteCollection: deleteCollection,

                followingProjects: followingProjects,
                refetchFollows: FetchFollowingProjects,
                followProject: followProject,
                unfollowProject: unfollowProject,
            }}
        >
            {props.children}
        </CollectionsContext>
    );
}

export default function useCollections() {
    return use(CollectionsContext) as CollectionsContext;
}
