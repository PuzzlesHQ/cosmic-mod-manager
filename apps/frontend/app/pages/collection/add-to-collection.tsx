import { Button } from "@app/components/ui/button";
import { LabelledCheckbox } from "@app/components/ui/checkbox";
import { Input } from "@app/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { BookmarkIcon, PlusIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import { useState } from "react";
import Link from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import CreateNewCollection_Dialog from "~/pages/dashboard/collections/new-collection";
import { LoginDialog } from "../auth/login/login-card";
import useCollections from "./provider";

export function AddToCollection_Popup({ projectId }: { projectId: string }) {
    const { t } = useTranslation();
    const session = useSession();
    const ctx = useCollections();
    const [searchQuery, setSearchQuery] = useState("");

    if (!session?.id) {
        return (
            <LoginDialog>
                <AddToCollection_PopupTrigger bookmarked={false} />
            </LoginDialog>
        );
    }

    // Check if the project is in any of the user collections
    const isBookmarked = ctx.collections.some((collection) => collection.projects.includes(projectId));
    return (
        <Popover>
            <PopoverTrigger asChild>
                <AddToCollection_PopupTrigger bookmarked={isBookmarked} />
            </PopoverTrigger>

            <PopoverContent className="min-w-fit gap-3 p-3">
                {ctx.collections.length > 5 ? (
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.collection.searchCollections}
                    />
                ) : null}

                <div className="grid grid-cols-1 gap-1 rounded bg-background px-3 py-2">
                    {ctx.collections.map((collection) => {
                        if (
                            !collection.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                            !collection.id.toLowerCase().includes(searchQuery.toLowerCase())
                        ) {
                            return null;
                        }

                        const checked = collection.projects.includes(projectId);

                        return (
                            <div key={collection.id} className="group/collection-wrapper flex items-center justify-between gap-2">
                                <LabelledCheckbox
                                    checked={checked}
                                    onCheckedChange={(checked) => {
                                        if (checked === true) {
                                            ctx.addProjectsToCollection(collection.id, [projectId]);
                                        } else {
                                            ctx.removeProjectsFromCollection(collection.id, [projectId]);
                                        }
                                    }}
                                >
                                    {collection.name}
                                </LabelledCheckbox>

                                <Link
                                    to={`/collection/${collection.id}`}
                                    className="text-extra-muted-foreground opacity-0 transition-none hover:text-muted-foreground group-focus-within/collection-wrapper:opacity-100 group-hover/collection-wrapper:opacity-100 group-hover/collection-wrapper:transition-all"
                                    target="_blank"
                                >
                                    <SquareArrowOutUpRightIcon className="h-btn-icon w-btn-icon" />
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <CreateNewCollection_Dialog redirectToCollectionPage={false}>
                    <Button className="w-fit justify-start space-y-0" variant="secondary" size="sm">
                        <PlusIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                        {t.dashboard.createCollection}
                    </Button>
                </CreateNewCollection_Dialog>
            </PopoverContent>
        </Popover>
    );
}

interface TriggerProps {
    ref?: React.ComponentProps<"button">["ref"];
    bookmarked: boolean;
    onClick?: () => void;
}

function AddToCollection_PopupTrigger(props: TriggerProps) {
    return (
        <Button
            ref={props.ref}
            variant="secondary-inverted"
            className="h-11 w-11 rounded-full p-0"
            aria-label="Add to collection"
            onClick={props.onClick}
        >
            <BookmarkIcon aria-hidden className="h-btn-icon-lg w-btn-icon-lg" fill={props.bookmarked ? "currentColor" : "none"} />
        </Button>
    );
}
