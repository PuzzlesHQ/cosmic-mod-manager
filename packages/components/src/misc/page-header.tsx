import { MoreVerticalIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { MicrodataItemProps } from "~/microdata";
import { ImgWrapper } from "~/ui/avatar";
import { Button } from "~/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover";
import { cn } from "~/utils";

interface PageHeaderProps {
    vtId: string; // View Transition ID
    icon?: string | React.ReactNode;
    fallbackIcon?: React.ReactNode;
    title: string;
    titleBadge?: React.ReactNode;
    description?: string;
    actionBtns?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    iconClassName?: string;
    threeDotMenu?: React.ReactNode;
    style?: CSSProperties;
    viewTransitions?: boolean;
}

export function PageHeader({
    icon,
    fallbackIcon,
    title,
    titleBadge,
    description,
    actionBtns,
    children,
    className,
    iconClassName,
    threeDotMenu,
    vtId,
    viewTransitions,
    ...props
}: PageHeaderProps) {
    return (
        <div
            {...props}
            className={cn(
                "page-header mt-4 mb-1 grid w-full max-w-full grid-cols-1 gap-x-8 gap-y-6 border-0 border-card-background border-b pb-5 lg:grid-cols-[1fr_auto] dark:border-shallow-background",
                className,
            )}
        >
            <div className="flex gap-5">
                <ImgWrapper
                    itemProp={MicrodataItemProps.image}
                    vtId={vtId}
                    viewTransitions={viewTransitions}
                    src={icon || ""}
                    alt={`Icon image of ${title}`}
                    className={cn("bg-card-background shadow shadow-white dark:shadow-black ", iconClassName)}
                    fallback={fallbackIcon}
                    loading="eager"
                />
                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h1
                            itemProp={MicrodataItemProps.name}
                            className="m-0 font-extrabold text-foreground-bright text-xl leading-tight"
                        >
                            {title}
                        </h1>
                        {titleBadge}
                    </div>
                    <p
                        itemProp={MicrodataItemProps.description}
                        className="max-w-[80ch] text-pretty text-muted-foreground leading-tight"
                    >
                        {AllowWordBreaks(description, ["/", "-", "_"])}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-x-4 pt-2 text-muted-foreground">{children}</div>
                </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {actionBtns}

                    {threeDotMenu ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost-inverted" className="h-11 w-11 rounded-full p-0" aria-label="More options">
                                    <MoreVerticalIcon aria-hidden className="h-btn-icon-lg w-btn-icon-lg" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="end"
                                className="flex w-fit min-w-0 flex-col items-center justify-center gap-1 px-1 py-1"
                            >
                                {threeDotMenu}
                            </PopoverContent>
                        </Popover>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

const zeroWidthSpace = "\u200B";

function AllowWordBreaks(str: string | undefined, chars: string[]) {
    if (!str || !chars?.length) return null;

    let result = str;

    for (const char of chars) {
        let temp = "";

        const items = result.split(char);
        for (let i = 0; i < items.length; i++) {
            if (items[i + 1] === undefined) temp += items[i];
            else temp += `${items[i]}${zeroWidthSpace}${char}`;
        }

        result = temp;
    }

    return result;
}
