import { Checkbox } from "@app/components/ui/checkbox";
import { cn } from "@app/components/utils";
import type { ProjectType } from "@app/utils/types";
import { useOutletContext, useParams } from "react-router";
import ProjectCardItem from "~/components/search-list-item";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import type { CollectionOutletData } from "./layout";

export default function CollectionProjectsList() {
    const { t } = useTranslation();
    const session = useSession();
    const ctx = useOutletContext<CollectionOutletData>();
    const params = useParams();
    const projectType = params.projectType;

    const formattedProjectType = projectType?.slice(0, -1);
    const filteredProjects = formattedProjectType
        ? ctx.projects?.filter((project) => project.type.includes(formattedProjectType))
        : ctx.projects;

    if (!filteredProjects.length) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <p className="text-lg text-muted-foreground italic text-center">{t.common.noResults}</p>
            </div>
        );
    }

    return (
        // biome-ignore lint/a11y/useSemanticElements: A list of project cards but not an actual list
        <div className="w-full grid grid-cols-1 gap-panel-cards" role="list">
            {filteredProjects.map((project) => {
                const projectItem = (
                    <ProjectCardItem
                        pageId="collection-projects"
                        projectType={project.type[0] as ProjectType}
                        pageProjectType={(formattedProjectType as ProjectType) || "project"}
                        key={project.id}
                        vtId={project.id}
                        projectName={project.name}
                        projectSlug={project.slug}
                        icon={project.icon}
                        featuredGallery={project.featured_gallery}
                        color={project.color}
                        summary={project.summary}
                        loaders={project.loaders}
                        featuredCategories={project.featuredCategories}
                        clientSide={project.clientSide}
                        serverSide={project.serverSide}
                        downloads={project.downloads}
                        followers={project.followers}
                        dateUpdated={new Date(project.dateUpdated)}
                        datePublished={new Date(project.datePublished)}
                        author={project?.author || ""}
                        isOrgOwned={project.isOrgOwned}
                        visibility={project.visibility}
                    />
                );
                if (ctx.collection.userId !== session?.id) return projectItem;

                const isChecked = ctx.markedProjects.includes(project.id);
                return (
                    <div key={project.id} className="relative group/search-item overflow-hidden rounded-lg">
                        {projectItem}

                        <label
                            htmlFor={project.slug}
                            className={cn(
                                "h-full w-12 flex items-center justify-center absolute end-0 bottom-0 cursor-pointer rounded-r-lg invisible bg-card-background shadow-xl shadow-background",
                                "group-hover/search-item:visible group-focus-within/search-item:visible",
                                isChecked && "visible",
                            )}
                        >
                            <Checkbox
                                title="Select item"
                                id={project.slug}
                                checked={isChecked}
                                onCheckedChange={(e) => {
                                    if (e === true) {
                                        ctx.addMarkedProject(project.id);
                                    } else {
                                        ctx.removeMarkedProject(project.id);
                                    }
                                }}
                            />
                        </label>
                    </div>
                );
            })}
        </div>
    );
}
