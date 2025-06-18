import { MicrodataItemProps, MicrodataItemType, itemType } from "@app/components/microdata";
import { ImgLoader } from "@app/components/misc/img-loading-spinner";
import { Button, buttonVariants } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@app/components/ui/dialog";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import { cn } from "@app/components/utils";
import { doesMemberHaveAccess } from "@app/utils/project";
import { FormatString } from "@app/utils/string";
import { type LoggedInUserData, ProjectPermission } from "@app/utils/types";
import type { GalleryItem, ProjectDetailsData, TeamMember } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CalendarIcon,
    ExpandIcon,
    ExternalLinkIcon,
    InfoIcon,
    ShrinkIcon,
    StarIcon,
    Trash2Icon,
    XIcon,
} from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { FormattedDate } from "~/components/ui/date";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";

const RemoveGalleryImage = lazy(() => import("./remove-img"));
const EditGalleryImage = lazy(() => import("./edit-img"));
const UploadGalleryImageForm = lazy(() => import("./upload-img"));

export default function ProjectGallery() {
    const { t } = useTranslation();
    const session = useSession();
    const ctx = useProjectData();
    const projectData = ctx.projectData;

    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [dialogOpen, setdialogOpen] = useState(false);

    return (
        <>
            {doesMemberHaveAccess(
                ProjectPermission.EDIT_DETAILS,
                ctx.currUsersMembership?.permissions,
                ctx.currUsersMembership?.isOwner,
                session?.role,
            ) ? (
                <Card className="p-card-surround w-full flex flex-row flex-wrap items-center justify-start gap-x-4 gap-y-2">
                    <Suspense>
                        <UploadGalleryImageForm projectData={projectData} />
                    </Suspense>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <InfoIcon aria-hidden className="h-btn-icon w-btn-icon" />
                        {t.project.uploadNewImg}
                    </div>
                </Card>
            ) : null}

            {projectData.gallery?.length ? (
                <div
                    itemScope
                    itemType={itemType(MicrodataItemType.ImageGallery)}
                    className="w-full grid gap-panel-cards grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
                >
                    <h2 className="col-span-full sr-only" itemProp={MicrodataItemProps.name}>
                        {`A gallery showcasing the ${projectData.name} ${FormatString(projectData.type[0])}`}
                    </h2>

                    {projectData.gallery.map((galleryItem, index) => (
                        <GalleryItemCard
                            session={session}
                            key={galleryItem.id}
                            projectData={projectData}
                            galleryItem={galleryItem}
                            index={index}
                            setActiveIndex={setActiveGalleryIndex}
                            setdialogOpen={setdialogOpen}
                            currUsersMembership={ctx.currUsersMembership}
                        />
                    ))}

                    {projectData.gallery?.[activeGalleryIndex] ? (
                        <ImageDialog
                            galleryItem={projectData.gallery[activeGalleryIndex]}
                            totalItems={projectData.gallery.length}
                            activeIndex={activeGalleryIndex}
                            setActiveIndex={setActiveGalleryIndex}
                            dialogOpen={dialogOpen}
                            setDialogOpen={setdialogOpen}
                        />
                    ) : null}
                </div>
            ) : null}
        </>
    );
}

interface GalleryItemCardProps {
    session: LoggedInUserData | null;
    projectData: ProjectDetailsData;
    galleryItem: GalleryItem;
    index: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    setdialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currUsersMembership: TeamMember | null;
}

function GalleryItemCard({
    session,
    projectData,
    galleryItem,
    index,
    setActiveIndex,
    setdialogOpen,
    currUsersMembership,
}: GalleryItemCardProps) {
    const { t } = useTranslation();

    return (
        <figure
            itemScope
            itemProp={MicrodataItemProps.image}
            itemType={itemType(MicrodataItemType.ImageObject)}
            className="grid grid-cols-1 grid-rows-[min-content,_1fr] bg-card-background rounded-lg p-2"
        >
            <button
                type="button"
                className="flex items-center justify-center aspect-video bg-[hsla(var(--background))] rounded-lg overflow-hidden"
                onClick={() => {
                    setActiveIndex(index);
                    setdialogOpen(true);
                }}
                aria-label={`View ${galleryItem.name}`}
            >
                <img
                    itemProp={MicrodataItemProps.thumbnailUrl}
                    loading="lazy"
                    src={imageUrl(galleryItem.imageThumbnail)}
                    alt={galleryItem.name}
                    className="w-full h-full object-contain cursor-pointer hover:brightness-75 transition-all duration-300"
                />
                <link itemProp={MicrodataItemProps.contentUrl} href={imageUrl(galleryItem.image)} />
            </button>

            <div className="w-full grid grid-cols-1 place-content-between gap-2 p-2 pb-1 ">
                <div className="w-full flex flex-col items-start justify-start ">
                    <span itemProp={MicrodataItemProps.name} className="flex items-center justify-start gap-2 text-lg font-bold">
                        {galleryItem.name}
                        {galleryItem.featured === true ? (
                            <StarIcon aria-hidden className="w-btn-icon h-btn-icon fill-current text-extra-muted-foreground" />
                        ) : null}
                    </span>
                    <figcaption itemProp={MicrodataItemProps.description} className="text-muted-foreground leading-tight">
                        {galleryItem.description}
                    </figcaption>
                </div>
                <div className="w-full flex flex-col items-start justify-start gap-1.5 mt-1">
                    <p className="flex gap-1.5 items-center justify-center text-muted-foreground">
                        <CalendarIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        <FormattedDate date={galleryItem.dateCreated} includeTime={false} />
                    </p>
                    {doesMemberHaveAccess(
                        ProjectPermission.EDIT_DETAILS,
                        currUsersMembership?.permissions,
                        currUsersMembership?.isOwner,
                        session?.role,
                    ) ? (
                        <div className="w-full flex flex-wrap items-center justify-start gap-x-2 gap-y-1">
                            <Suspense>
                                <EditGalleryImage galleryItem={galleryItem} projectData={projectData} />

                                <RemoveGalleryImage id={galleryItem.id} projectData={projectData}>
                                    <Button variant="secondary" size="sm">
                                        <Trash2Icon aria-hidden className="w-btn-icon-sm h-btn-icon-sm" />
                                        {t.form.remove}
                                    </Button>
                                </RemoveGalleryImage>
                            </Suspense>
                        </div>
                    ) : null}
                </div>
            </div>
        </figure>
    );
}

function ImageDialog({
    galleryItem,
    setActiveIndex,
    totalItems,
    dialogOpen,
    setDialogOpen,
}: {
    galleryItem: GalleryItem;
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    totalItems: number;
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [isFullWidth, setIsFullWidth] = useState(false);

    function toggleFullWidth() {
        setIsFullWidth((prev) => !prev);
    }

    function next() {
        setActiveIndex((current) => {
            if (current < totalItems - 1) {
                return current + 1;
            }
            return 0;
        });
    }

    function previous() {
        setActiveIndex((current) => {
            if (current > 0) {
                return current - 1;
            }
            return totalItems - 1;
        });
    }

    function handleKeyboardInputs(e: KeyboardEvent) {
        if (e.key === "ArrowLeft") {
            previous();
        } else if (e.key === "ArrowRight") {
            next();
        }
    }

    useEffect(() => {
        document.body.addEventListener("keydown", handleKeyboardInputs);
        return () => {
            document.body.removeEventListener("keydown", handleKeyboardInputs);
        };
    }, []);

    useEffect(() => {
        if (dialogOpen === false) setIsFullWidth(false);
    }, [dialogOpen]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent
                id="gallery_dialog_content"
                className="w-full flex items-center justify-center max-w-full bg-transparent border-none ring-0 p-0 pt-0 pb-0"
            >
                <VisuallyHidden>
                    <DialogTitle>{galleryItem.name}</DialogTitle>
                    <DialogDescription>{galleryItem.description}</DialogDescription>
                </VisuallyHidden>
                <div id="image_popup_content" className="w-full h-[100dvh] flex flex-col items-center justify-center relative">
                    <DialogClose asChild>
                        <div className="absolute top-0 left-0 w-full h-full z-0" />
                    </DialogClose>

                    <ImgLoader
                        src={imageUrl(galleryItem.image)}
                        alt={galleryItem.name}
                        thumbnailSrc={imageUrl(galleryItem.imageThumbnail)}
                        className="border-none ring-0 rounded-lg object-contain z-10 w-full h-full"
                        wrapperClassName={cn(
                            "max-w-[calc(100vw_-_2rem)] sm:max-w-[calc(100vw_-_6rem)] max-h-[calc(100vh_-_4rem)]",
                            isFullWidth && "w-full h-full",
                        )}
                        setLoaded={() => {}}
                    />

                    <div className="max-w-full flex flex-col items-center justify-center group p-16 pt-24 pb-4 rounded w-fit absolute left-[50%] bottom-[0.5rem] translate-x-[-50%] z-20">
                        <div className="max-w-full w-max flex flex-col items-center justify-center transition-all duration-300 opacity-0 scale-75 translate-y-[1rem] group-hover:translate-y-[-1rem] group-hover:scale-100 group-hover:opacity-100 text-[hsla(var(--foreground-dark))]">
                            <span className="font-bold text-lg text-center bg-black/80 rounded-[0.1rem] px-1">{galleryItem.name}</span>
                            <span className="max-w-[80ch] text-pretty text-center bg-black/80 rounded-[0.1rem] px-1">
                                {galleryItem.description}
                            </span>
                        </div>

                        <div className="flex items-center justify-start gap-2 p-2.5 px-3 rounded-xl bg-card-background opacity-45 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 origin-bottom">
                            <DialogClose asChild>
                                <Button className="rounded-full" size="icon" variant="secondary">
                                    <XIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                                </Button>
                            </DialogClose>

                            <a
                                href={imageUrl(galleryItem.image)}
                                aria-label={galleryItem.name}
                                className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "rounded-full")}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <VisuallyHidden>{galleryItem.name}</VisuallyHidden>
                                <ExternalLinkIcon aria-hidden className="w-btn-icon h-btn-icon" />
                            </a>

                            <Button variant="secondary" size="icon" className="rounded-full" onClick={toggleFullWidth}>
                                {isFullWidth ? (
                                    <ShrinkIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                ) : (
                                    <ExpandIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                )}
                            </Button>

                            {totalItems > 1 ? (
                                <>
                                    <Button variant="secondary" size="icon" className="rounded-full" onClick={previous}>
                                        <ArrowLeftIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    </Button>

                                    <Button variant="secondary" size="icon" className="rounded-full" onClick={next}>
                                        <ArrowRightIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
