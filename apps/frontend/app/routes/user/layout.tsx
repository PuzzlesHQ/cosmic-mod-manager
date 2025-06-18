import type { Collection, Organisation, ProjectListItem } from "@app/utils/types/api";
import type { UserProfileData } from "@app/utils/types/api/user";
import { UserXIcon } from "lucide-react";
import type { MetaDescriptor } from "react-router";
import { type ShouldRevalidateFunctionArgs, useLoaderData } from "react-router";
import NotFoundPage from "~/pages/not-found";
import UserPageLayout from "~/pages/user/layout";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { UserProfilePath } from "~/utils/urls";
import type { Route } from "./+types/layout";

export interface UserOutletData {
    projectsList: ProjectListItem[];
    collections: Collection[];
    userData: UserProfileData;
}

export default function () {
    const data = useLoaderData() as LoaderData;

    if (data.userSlug === "deleted_user") {
        return (
            <div className="full_page flex flex-col py-12 items-center justify-center text-extra-muted-foreground">
                <UserXIcon className="w-20 h-20" />
                <h2 className="text-2xl font-semibold">The user account was deleted.</h2>
            </div>
        );
    }

    if (!data.userData?.id) {
        return (
            <NotFoundPage
                title="User not found"
                description={`The user with username/ID "${data?.userSlug}" does not exist.`}
                linkHref="/"
                linkLabel="Home"
            />
        );
    }

    return (
        <UserPageLayout
            userData={data.userData}
            projectsList={data.projects || []}
            orgsList={data.orgs || []}
            collections={data.collections}
        />
    );
}

interface LoaderData {
    userSlug?: string;
    userData: UserProfileData | null;
    projects: ProjectListItem[];
    orgs: Organisation[];
    collections: Collection[];
}

export async function loader(props: Route.LoaderArgs): Promise<LoaderData> {
    const userName = props.params.userName;

    if (!userName || userName === "deleted_user")
        return {
            userSlug: userName,
            userData: null,
            projects: [],
            orgs: [],
            collections: [],
        };

    const [userRes, projectsRes, orgsRes, collectionsRes] = await Promise.all([
        serverFetch(props.request, `/api/user/${userName}`),
        serverFetch(props.request, `/api/user/${userName}/projects?listedOnly=true`),
        serverFetch(props.request, `/api/user/${userName}/organization`),
        serverFetch(props.request, `/api/user/${userName}/collections`),
    ]);

    const [userData, projects, orgs, collections] = await Promise.all([
        resJson<UserProfileData>(userRes),
        resJson<ProjectListItem[]>(projectsRes),
        resJson<Organisation[]>(orgsRes),
        resJson<Collection[]>(collectionsRes),
    ]);

    return {
        userSlug: userName,
        userData: userData,
        projects: projects || [],
        orgs: orgs || [],
        collections: collections || [],
    };
}

export function meta(props: Route.MetaArgs): MetaDescriptor[] {
    const { userData, userSlug } = props.data as LoaderData;
    const image = userData?.avatar || Config.SITE_ICON;

    if (!userData?.id) {
        return MetaTags({
            title: "User not found",
            description: `No user with the username/ID ${userSlug} exists on ${Config.SITE_NAME_SHORT}`,
            image: Config.SITE_ICON,
            url: `${Config.FRONTEND_URL}${UserProfilePath(userSlug || "")}`,
            suffixTitle: true,
        });
    }

    return MetaTags({
        title: userData?.userName || "",
        description: `${userData?.bio} - Download ${userData?.userName}'s projects on ${Config.SITE_NAME_SHORT}`,
        image: image,
        url: `${Config.FRONTEND_URL}${UserProfilePath(userData?.userName)}`,
        suffixTitle: true,
    });
}

export function shouldRevalidate({ currentParams, nextParams, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
    const currentId = currentParams.userName?.toLowerCase();
    const nextId = nextParams.userName?.toLowerCase();

    if (currentId === nextId) return false;
    return defaultShouldRevalidate;
}
