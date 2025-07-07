import { itemType, MicrodataItemProps, MicrodataItemType } from "@app/components/microdata";
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
import { lazy, Suspense, useEffect, useState } from "react";
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
                <Card className="flex w-full flex-row flex-wrap items-center justify-start gap-x-4 gap-y-2 p-card-surround">
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
                    className="grid w-full grid-cols-1 gap-panel-cards sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3"
                >
                    <h2 className="sr-only col-span-full" itemProp={MicrodataItemProps.name}>
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
            className="grid grid-cols-1 grid-rows-[min-content,_1fr] rounded-lg bg-card-background p-2"
        >
            <button
                type="button"
                className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-[hsla(var(--background))]"
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
                    className="h-full w-full cursor-pointer object-contain transition-all duration-300 hover:brightness-75"
                />
                <link itemProp={MicrodataItemProps.contentUrl} href={imageUrl(galleryItem.image)} />
            </button>

            <div className="grid w-full grid-cols-1 place-content-between gap-2 p-2 pb-1 ">
                <div className="flex w-full flex-col items-start justify-start ">
                    <span itemProp={MicrodataItemProps.name} className="flex items-center justify-start gap-2 font-bold text-lg">
                        {galleryItem.name}
                        {galleryItem.featured === true ? (
                            <StarIcon aria-hidden className="h-btn-icon w-btn-icon fill-current text-extra-muted-foreground" />
                        ) : null}
                    </span>
                    <figcaption itemProp={MicrodataItemProps.description} className="text-muted-foreground leading-tight">
                        {galleryItem.description}
                    </figcaption>
                </div>
                <div className="mt-1 flex w-full flex-col items-start justify-start gap-1.5">
                    <p className="flex items-center justify-center gap-1.5 text-muted-foreground">
                        <CalendarIcon aria-hidden className="h-btn-icon w-btn-icon" />
                        <FormattedDate date={galleryItem.dateCreated} includeTime={false} />
                    </p>
                    {doesMemberHaveAccess(
                        ProjectPermission.EDIT_DETAILS,
                        currUsersMembership?.permissions,
                        currUsersMembership?.isOwner,
                        session?.role,
                    ) ? (
                        <div className="flex w-full flex-wrap items-center justify-start gap-x-2 gap-y-1">
                            <Suspense>
                                <EditGalleryImage galleryItem={galleryItem} projectData={projectData} />

                                <RemoveGalleryImage id={galleryItem.id} projectData={projectData}>
                                    <Button variant="secondary" size="sm">
                                        <Trash2Icon aria-hidden className="h-btn-icon-sm w-btn-icon-sm" />
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
                className="flex w-full max-w-full items-center justify-center border-none bg-transparent p-0 pt-0 pb-0 ring-0"
            >
                <VisuallyHidden>
                    <DialogTitle>{galleryItem.name}</DialogTitle>
                    <DialogDescription>{galleryItem.description}</DialogDescription>
                </VisuallyHidden>
                <div id="image_popup_content" className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
                    <DialogClose asChild>
                        <div className="absolute top-0 left-0 z-0 h-full w-full" />
                    </DialogClose>

                    <ImgLoader
                        src={imageUrl(galleryItem.image)}
                        alt={galleryItem.name}
                        thumbnailSrc={imageUrl(galleryItem.imageThumbnail)}
                        className="z-10 h-full w-full rounded-lg border-none object-contain ring-0"
                        wrapperClassName={cn(
                            "max-w-[calc(100vw_-_2rem)] sm:max-w-[calc(100vw_-_6rem)] max-h-[calc(100vh_-_4rem)]",
                            isFullWidth && "w-full h-full",
                        )}
                        setLoaded={() => {}}
                    />

                    <div className="group absolute bottom-[0.5rem] left-[50%] z-20 flex w-fit max-w-full translate-x-[-50%] flex-col items-center justify-center rounded p-16 pt-24 pb-4">
                        <div className="flex w-max max-w-full translate-y-[1rem] scale-75 flex-col items-center justify-center text-[hsla(var(--foreground-dark))] opacity-0 transition-all duration-300 group-hover:translate-y-[-1rem] group-hover:scale-100 group-hover:opacity-100">
                            <span className="rounded-[0.1rem] bg-black/80 px-1 text-center font-bold text-lg">
                                {galleryItem.name}
                            </span>
                            <span className="max-w-[80ch] text-pretty rounded-[0.1rem] bg-black/80 px-1 text-center">
                                {galleryItem.description}
                            </span>
                        </div>

                        <div className="flex origin-bottom scale-90 items-center justify-start gap-2 rounded-xl bg-card-background p-2.5 px-3 opacity-45 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                            <DialogClose asChild>
                                <Button className="rounded-full" size="icon" variant="secondary">
                                    <XIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
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
                                <ExternalLinkIcon aria-hidden className="h-btn-icon w-btn-icon" />
                            </a>

                            <Button variant="secondary" size="icon" className="rounded-full" onClick={toggleFullWidth}>
                                {isFullWidth ? (
                                    <ShrinkIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                ) : (
                                    <ExpandIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                )}
                            </Button>

                            {totalItems > 1 ? (
                                <>
                                    <Button variant="secondary" size="icon" className="rounded-full" onClick={previous}>
                                        <ArrowLeftIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    </Button>

                                    <Button variant="secondary" size="icon" className="rounded-full" onClick={next}>
                                        <ArrowRightIcon aria-hidden className="h-btn-icon w-btn-icon" />
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
